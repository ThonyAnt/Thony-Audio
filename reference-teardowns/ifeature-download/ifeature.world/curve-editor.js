const FilterType = {
    Bell: 0,
    LowCut: 1,
    HighCut: 2
};

class CurveControlPoint {
    constructor(normFreq, dbGain, q, type = FilterType.Bell) {
        this.normFreq = normFreq;
        this.dbGain = dbGain;
        this.q = q;
        this.type = type;
        this.isSelected = false;
    }
}

const CurveMath = {
    generateCurve: function(points, resolution = 1024) {
        let curve = new Float32Array(resolution);
        for (let i = 0; i < resolution; ++i) {
            let t = i / (resolution - 1);
            let total_dB = 0.0;
            
            for (let cp of points) {
                let sigma = 0.05 / cp.q; 
                let diff = t - cp.normFreq;
                
                if (cp.type === FilterType.Bell) {
                    total_dB += cp.dbGain * Math.exp(-(diff * diff) / (2.0 * sigma * sigma));
                } else if (cp.type === FilterType.LowCut) {
                    if (t < cp.normFreq) {
                        let val = Math.exp(-(diff * diff) / (2.0 * sigma * sigma));
                        total_dB += -48.0 * (1.0 - val);
                    }
                } else if (cp.type === FilterType.HighCut) {
                    if (t > cp.normFreq) {
                        let val = Math.exp(-(diff * diff) / (2.0 * sigma * sigma));
                        total_dB += -48.0 * (1.0 - val);
                    }
                }
            }
            
            let multiplier = Math.pow(10.0, total_dB / 20.0);
            curve[i] = Math.max(0.01, Math.min(10.0, multiplier));
        }
        return curve;
    }
};

class CurveEditor {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.points = [
            new CurveControlPoint(0.1, 0.0, 1.0, FilterType.LowCut),
            new CurveControlPoint(0.35, 6.0, 2.0, FilterType.Bell),
            new CurveControlPoint(0.65, -4.0, 4.0, FilterType.Bell),
            new CurveControlPoint(0.9, 0.0, 1.0, FilterType.HighCut)
        ];
        
        this.hoverIndex = -1;
        this.dragIndex = -1;
        this.isDragging = false;
        
        this.kLogMin = Math.log10(20.0);
        this.kLogMax = Math.log10(20000.0);
        this.rangeLog = this.kLogMax - this.kLogMin;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.setupInteractions();
        
        requestAnimationFrame(() => this.draw());
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.draw();
    }
    
    setupInteractions() {
        const getMousePos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            let clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const onDown = (e) => {
            e.preventDefault();
            const pos = getMousePos(e);
            let hit = -1;
            let minDist = 15;
            
            for (let i = 0; i < this.points.length; i++) {
                let px = this.points[i].normFreq * this.canvas.width;
                let py = this.mapDbToY(this.points[i].dbGain);
                let dist = Math.hypot(pos.x - px, pos.y - py);
                if (dist < minDist) {
                    minDist = dist;
                    hit = i;
                }
            }
            
            if (e.button === 2) {
                // Right click delete
                if (hit !== -1) {
                    this.points.splice(hit, 1);
                    this.draw();
                }
                return;
            }

            if (hit !== -1) {
                this.dragIndex = hit;
                this.isDragging = true;
                this.points.forEach(p => p.isSelected = false);
                this.points[hit].isSelected = true;
            } else {
                // Add point
                let nf = Math.max(0, Math.min(1, pos.x / this.canvas.width));
                let db = this.mapYToDb(pos.y);
                let type = FilterType.Bell;
                if (nf < 0.05) { type = FilterType.LowCut; db = 0; }
                if (nf > 0.95) { type = FilterType.HighCut; db = 0; }
                
                let p = new CurveControlPoint(nf, db, 1.0, type);
                this.points.forEach(pt => pt.isSelected = false);
                p.isSelected = true;
                this.points.push(p);
                this.points.sort((a, b) => a.normFreq - b.normFreq);
                this.dragIndex = this.points.indexOf(p);
                this.isDragging = true;
            }
            this.draw();
        };

        const onMove = (e) => {
            e.preventDefault();
            const pos = getMousePos(e);
            
            if (this.isDragging && this.dragIndex !== -1) {
                let cp = this.points[this.dragIndex];
                cp.normFreq = Math.max(0, Math.min(1, pos.x / this.canvas.width));
                if (cp.type === FilterType.Bell) {
                    cp.dbGain = Math.max(-12, Math.min(12, this.mapYToDb(pos.y)));
                }
                this.points.sort((a, b) => a.normFreq - b.normFreq);
                this.dragIndex = this.points.findIndex(p => p === cp);
                this.draw();
            } else {
                let hit = -1;
                let minDist = 15;
                for (let i = 0; i < this.points.length; i++) {
                    let px = this.points[i].normFreq * this.canvas.width;
                    let py = this.mapDbToY(this.points[i].dbGain);
                    let dist = Math.hypot(pos.x - px, pos.y - py);
                    if (dist < minDist) {
                        minDist = dist;
                        hit = i;
                    }
                }
                if (this.hoverIndex !== hit) {
                    this.hoverIndex = hit;
                    this.draw();
                }
            }
        };

        const onUp = (e) => {
            this.isDragging = false;
            this.draw();
        };
        
        const onWheel = (e) => {
            e.preventDefault();
            if (this.hoverIndex !== -1) {
                let cp = this.points[this.hoverIndex];
                cp.q = Math.max(0.1, Math.min(10.0, cp.q + (e.deltaY * -0.01)));
                this.draw();
            }
        };

        this.canvas.addEventListener('mousedown', onDown);
        this.canvas.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        this.canvas.addEventListener('touchstart', onDown, {passive: false});
        this.canvas.addEventListener('touchmove', onMove, {passive: false});
        window.addEventListener('touchend', onUp);
        this.canvas.addEventListener('wheel', onWheel, {passive: false});
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());
    }
    


    mapDbToY(dbGain) {
        // +12dB to -12dB -> 0 to 1
        let normY = (12.0 - dbGain) / 24.0;
        return normY * this.canvas.height;
    }
    
    mapYToDb(y) {
        let normY = y / this.canvas.height;
        return 12.0 - (normY * 24.0);
    }

    draw() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, w, h);
        
        // Background color
        ctx.fillStyle = '#1D1F1B';
        ctx.fillRect(0, 0, w, h);

        // Grid lines
        ctx.strokeStyle = '#252825';
        ctx.lineWidth = 1;
        const freqs = [50, 100, 200, 500, 1000, 2000, 5000, 10000];
        freqs.forEach(f => {
            let logF = Math.log10(f);
            let nx = (logF - this.kLogMin) / this.rangeLog;
            let px = nx * w;
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, h);
            ctx.stroke();
        });

        // 0 dB Line
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.moveTo(0, h/2);
        ctx.lineTo(w, h/2);
        ctx.stroke();
        ctx.fillStyle = '#4a4d48';
        ctx.font = '10px Space Mono';
        ctx.fillText('0 dB', 5, h/2 - 5);

        // Curve Math
        const res = 1024;
        let curve = CurveMath.generateCurve(this.points, res);
        
        ctx.beginPath();
        ctx.moveTo(0, h/2);
        for (let i = 0; i < res; i++) {
            let t = i / (res - 1);
            let multiplier = curve[i];
            let total_dB = 20.0 * Math.log10(Math.max(0.0001, multiplier));
            let visual_dB = Math.max(-18, Math.min(18, total_dB));
            let py = this.mapDbToY(visual_dB);
            ctx.lineTo(t * w, py);
        }
        
        // Fill
        ctx.lineTo(w, h/2);
        ctx.lineTo(0, h/2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(240, 234, 222, 0.15)'; // #F0EADE
        ctx.fill();
        
        // Line
        ctx.beginPath();
        for (let i = 0; i < res; i++) {
            let t = i / (res - 1);
            let multiplier = curve[i];
            let total_dB = 20.0 * Math.log10(Math.max(0.0001, multiplier));
            let visual_dB = Math.max(-18, Math.min(18, total_dB));
            let py = this.mapDbToY(visual_dB);
            if (i === 0) ctx.moveTo(t * w, py);
            else ctx.lineTo(t * w, py);
        }
        ctx.strokeStyle = '#F0EADE';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw points
        this.points.forEach((cp, i) => {
            let px = cp.normFreq * w;
            let py = this.mapDbToY(cp.dbGain);
            let isHover = (i === this.hoverIndex || i === this.dragIndex);
            let isSel = cp.isSelected;
            let r = (isHover || isSel) ? 6 : 4;
            
            if (isHover || isSel) {
                ctx.fillStyle = isSel ? 'rgba(240,234,222,0.4)' : 'rgba(240,234,222,0.28)';
                ctx.beginPath();
                ctx.arc(px, py, r + 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.fillStyle = (isHover || isSel) ? '#F0EADE' : 'rgba(240,234,222,0.5)';
            if (cp.type !== FilterType.Bell) {
                ctx.fillRect(px - r, py - r, r*2, r*2);
            } else {
                ctx.beginPath();
                ctx.arc(px, py, r, 0, Math.PI*2);
                ctx.fill();
            }
            
            // Tooltip for active point
            if (isHover || isSel) {
                let hzVal = Math.pow(10, this.kLogMin + cp.normFreq * this.rangeLog);
                let hzStr = hzVal >= 1000 ? (hzVal/1000).toFixed(2) + ' kHz' : hzVal.toFixed(0) + ' Hz';
                let text = hzStr;
                if (cp.type === FilterType.Bell) {
                    text += ' | ' + (cp.dbGain > 0 ? '+' : '') + cp.dbGain.toFixed(1) + ' dB';
                }
                text += ' | Q: ' + cp.q.toFixed(2);
                
                ctx.font = '12px Space Mono';
                let txtW = ctx.measureText(text).width;
                
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(px - txtW/2 - 6, py - 30, txtW + 12, 20);
                
                ctx.fillStyle = '#F0EADE';
                ctx.textAlign = 'center';
                ctx.fillText(text, px, py - 16);
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('curve-editor-canvas')) {
        new CurveEditor('curve-editor-canvas');
    }
    
    // Clipper UI Toggle
    const clipperContainer = document.getElementById('clipper-toggle-container');
    const clipperIcon = document.getElementById('clipper-mode-icon');
    if (clipperContainer && clipperIcon) {
        const clipperModes = ['CLIPPERSOFTCLIP.svg', 'CLIPPERHARDCLIP.svg', 'CLIPPEROFF.svg'];
        const clipperNames = ['Soft Clipping', 'Hard Clipping', 'Clipper Off'];
        let currentMode = 0; // Starts at Soft Clipping
        
        clipperContainer.addEventListener('click', () => {
            currentMode = (currentMode + 1) % 3;
            clipperIcon.src = clipperModes[currentMode];
            clipperIcon.alt = clipperNames[currentMode];
        });
    }
    
    // Sidechain UI Toggle
    const sidechainContainer = document.getElementById('sidechain-toggle-container');
    const sidechainIcon = document.getElementById('sidechain-mode-icon');
    if (sidechainContainer && sidechainIcon) {
        let isScOn = false;
        sidechainContainer.addEventListener('click', () => {
            isScOn = !isScOn;
            sidechainIcon.src = isScOn ? 'Sidechain.svg' : 'SidechainOff.svg';
        });
    }

    // Settings Gear Animation (C++ Port)
    const settingsGear = document.querySelector('.settings-feature img');
    if (settingsGear) {
        settingsGear.style.cursor = 'pointer';
        let currentAngle = 0;
        let targetAngle = 0;
        let isAnimating = false;

        settingsGear.addEventListener('mouseenter', () => {
            targetAngle += 360;
            if (!isAnimating) {
                animateGear();
            }
        });

        function animateGear() {
            isAnimating = true;
            if (Math.abs(currentAngle - targetAngle) > 0.5) {
                currentAngle += (targetAngle - currentAngle) * 0.15;
                settingsGear.style.transform = `rotate(${currentAngle}deg)`;
                requestAnimationFrame(animateGear);
            } else {
                currentAngle = targetAngle;
                settingsGear.style.transform = `rotate(${currentAngle}deg)`;
                isAnimating = false;
            }
        }
    }
});
