import{t as e}from"./rolldown-runtime.BO1CHSEM.mjs";import{D as t,I as n,M as r,P as i,R as a,S as o,c as s,l as c,o as l,s as u,w as d}from"./react.CHhn9jUD.mjs";import{E as f,S as p,V as m,r as h}from"./framer.WA_s6q6u.mjs";import{a as g,d as _,f as v,i as y,r as b,t as x,u as S}from"./default-utils.js@_0.45.BgAx4s3x.mjs";import{t as C}from"./default-utils.BRMUbJxg.mjs";function w({url:e,play:t,shouldMute:n,thumbnail:r,isRed:a,onClick:o,border:l,boxShadow:f,onMouseEnter:p,onMouseLeave:m,onMouseDown:h,onMouseUp:_,title:v,...b}){let x=g(),S=t!==`Off`,C=x||r!==`Off`&&!S,[w,E]=d(()=>!0,!1),[j,M]=d(()=>!0,!C),[N,F]=i(!1),L=y(b),R=L!==`0px 0px 0px 0px`&&L!==`0px`;if(e===``)return s(O,{});let z=T(e);if(z===void 0)return s(k,{message:`Invalid Youtube URL.`});let[B,V,H]=z,U=V.searchParams;if(H)for(let[e,t]of H)U.set(e,t),e===`t`&&U.set(`start`,t);U.set(`iv_load_policy`,`3`),U.set(`rel`,`0`),U.set(`modestbranding`,`1`),U.set(`playsinline`,`1`),j?(S||C&&j)&&U.set(`autoplay`,`1`):U.set(`autoplay`,`0`),S&&n&&U.set(`mute`,`1`),t===`Loop`&&(U.set(`loop`,`1`),U.set(`playlist`,B)),a||U.set(`color`,`white`);let W={title:v||`Youtube Video`,allow:`presentation; fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture`,src:V.href,frameBorder:`0`,onClick:o,onMouseEnter:p,onMouseLeave:m,onMouseDown:h,onMouseUp:_};return c(`article`,{onPointerEnter:()=>F(!0),onPointerLeave:()=>F(!1),onPointerOver:E,onKeyDown:M,onClick:M,style:{...P,borderRadius:L,boxShadow:f,transform:R&&(j||x)?`translateZ(0.000001px)`:`unset`,cursor:`pointer`,overflow:`hidden`},role:`presentation`,children:[C&&c(u,{children:[s(`link`,{rel:`preconnect`,href:`https://i.ytimg.com`}),s(`img`,{decoding:`async`,src:D(B,r),style:{...I,objectFit:`cover`}})]}),w&&c(u,{children:[s(`link`,{rel:`dns-prefetch`,href:`https://i.ytimg.com`}),s(`link`,{rel:`preconnect`,href:`https://www.youtube.com`}),s(`link`,{rel:`dns-prefetch`,href:`https://www.google.com`})]}),x?null:s(`iframe`,{loading:j?void 0:`lazy`,style:j?I:{...I,display:`none`},...W}),l&&s(`div`,{style:{position:`absolute`,inset:0,pointerEvents:`none`,boxSizing:`border-box`,borderRadius:L,...l}}),j?null:s(A,{onClick:M,isHovered:N,isRed:a})]})}function T(e){let t;try{t=new URL(e)}catch{return[e,E(e),null]}let n=t.searchParams;if(t.hostname===`youtube.com`||t.hostname===`www.youtube.com`||t.hostname===`youtube-nocookie.com`||t.hostname===`www.youtube-nocookie.com`){let e=t.pathname.slice(1).split(`/`),r=e[0];if(r===`watch`){let e=t.searchParams.get(`v`);return[e,E(e),n]}if(r===`embed`)return[e[1],t,n];if(r===`shorts`||r===`live`){let t=e[1];return[t,E(t),n]}}if(t.hostname===`youtu.be`){let e=t.pathname.slice(1);return[e,E(e),n]}}function E(e){return new URL(`https://www.youtube.com/embed/${e}`)}function D(e,t){let n=`https://i.ytimg.com/vi_webp/`,r=`webp`;switch(t){case`Low Quality`:return`${n}${e}/hqdefault.${r}`;case`Medium Quality`:return`${n}${e}/sddefault.${r}`;case`High Quality`:return`${n}${e}/maxresdefault.${r}`;default:return`${n}${e}/0.${r}`}}function O(){return s(`div`,{style:{...v,overflow:`hidden`},children:s(`div`,{style:F,children:`To embed a Youtube video, add the URL to the properties\xA0panel.`})})}function k({message:e}){return s(`div`,{className:`framerInternalUI-errorPlaceholder`,style:{...S,overflow:`hidden`},children:c(`div`,{style:F,children:[`Error: `,e]})})}function A({onClick:e,isHovered:t,isRed:n}){return s(`button`,{onClick:e,"aria-label":`Play`,style:N,children:c(`svg`,{height:`100%`,version:`1.1`,viewBox:`0 0 68 48`,width:`100%`,children:[s(`path`,{d:`M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z`,fill:t?n?`#f00`:`#000`:`#212121`,fillOpacity:t&&n?1:.8,style:{transition:`fill .1s cubic-bezier(0.4, 0, 1, 1), fill-opacity .1s cubic-bezier(0.4, 0, 1, 1)`}}),s(`path`,{d:`M 45,24 27,14 27,34`,fill:`#fff`})]})})}var j,M,N,P,F,I,L=e((()=>{l(),o(),m(),x(),(function(e){e.Normal=`Off`,e.Auto=`On`,e.Loop=`Loop`})(j||={}),(function(e){e.High=`High Quality`,e.Medium=`Medium Quality`,e.Low=`Low Quality`,e.Off=`Off`})(M||={}),w.displayName=`YouTube`,p(w,{url:{type:h.String,title:`Video`},play:{type:h.Enum,title:`Autoplay`,options:Object.values(j)},shouldMute:{title:`Mute`,type:h.Boolean,enabledTitle:`Yes`,disabledTitle:`No`,hidden(e){return e.play===`Off`}},thumbnail:{title:`Thumbnail`,description:`Showing a thumbnail improves performance.`,type:h.Enum,options:Object.values(M),hidden(e){return e.play!==`Off`}},isRed:{title:`Color`,type:h.Boolean,enabledTitle:`Red`,disabledTitle:`White`},...b,border:{type:h.Border,optional:!0},boxShadow:{type:h.BoxShadow,optional:!0,title:`Shadows`},..._}),w.defaultProps={url:`https://youtu.be/8AHPXm9Y6mI`,play:`Off`,shouldMute:!0,thumbnail:`Medium Quality`,isRed:!0,boxShadow:null,border:null},N={position:`absolute`,top:`50%`,left:`50%`,transform:`translate(-50%, -50%)`,width:68,height:48,padding:0,border:`none`,background:`transparent`,cursor:`pointer`},P={position:`relative`,width:`100%`,height:`100%`},F={textAlign:`center`,minWidth:140},I={position:`absolute`,top:0,left:0,height:`100%`,width:`100%`}}));function R({type:e,url:t,html:n,zoom:r,radius:i,border:a,style:o={}}){return e===`url`&&t?s(B,{url:t,zoom:r,radius:i,border:a,style:o}):e===`html`&&n?s(H,{html:n,style:o}):s(z,{style:o})}function z({style:e}){return s(`div`,{style:{minHeight:Y(e),...v,overflow:`hidden`,...e},children:s(`div`,{style:Q,children:`To embed a website or widget, add it to the properties\xA0panel.`})})}function B({url:e,zoom:t,radius:n,border:a,style:o}){let c=!o.height;/[a-z]+:\/\//.test(e)||(e=`https://`+e);let l=g(),[u,d]=i(l?void 0:!1);return r(()=>{if(!l)return;let t=!0;d(void 0);async function n(){let n=await fetch(`https://api.framer.com/functions/check-iframe-url?url=`+encodeURIComponent(e));if(n.status==200){let{isBlocked:e}=await n.json();t&&d(e)}else{let e=await n.text();console.error(e),d(Error(`This site can’t be reached.`))}}return n().catch(e=>{console.error(e),d(e)}),()=>{t=!1}},[e]),l&&c?s(J,{message:`URL embeds do not support auto height.`,style:o}):e.startsWith(`https://`)?u===void 0?s(q,{}):u instanceof Error?s(J,{message:u.message,style:o}):u===!0?s(J,{message:`Can’t embed ${e} due to its content security policy.`,style:o}):s(`iframe`,{src:e,style:{...X,...o,...a,zoom:t,borderRadius:n,transformOrigin:`top center`},loading:`lazy`,fetchPriority:l?`low`:`auto`,referrerPolicy:`no-referrer`,sandbox:V(l),allowFullScreen:!0,allow:`presentation; fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; clipboard-write`}):s(J,{message:`Unsupported protocol.`,style:o})}function V(e){let t=[`allow-same-origin`,`allow-scripts`];return e||t.push(`allow-downloads`,`allow-forms`,`allow-modals`,`allow-orientation-lock`,`allow-pointer-lock`,`allow-popups`,`allow-popups-to-escape-sandbox`,`allow-presentation`,`allow-storage-access-by-user-activation`,`allow-top-navigation-by-user-activation`),t.join(` `)}function H({html:e,...t}){if(e.includes(`<\/script>`)){let n=e.includes(`</spline-viewer>`),r=e.includes(`<!-- framer-direct-embed -->`);return s(n||r?W:U,{html:e,...t})}return s(G,{html:e,...t})}function U({html:e,style:n}){let o=t(),[c,l]=i(0);r(()=>{let e=o.current?.contentWindow;function t(t){if(t.source!==e)return;let n=t.data;if(typeof n!=`object`||!n)return;let r=n.embedHeight;typeof r==`number`&&l(r)}return a.addEventListener(`message`,t),e?.postMessage(`getEmbedHeight`,`*`),()=>{a.removeEventListener(`message`,t)}},[]);let u=`
<html>
    <head>
        <style>
            html, body {
                margin: 0;
                padding: 0;
            }

            body {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            :root {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            * {
                box-sizing: border-box;
                -webkit-font-smoothing: inherit;
            }

            h1, h2, h3, h4, h5, h6, p, figure {
                margin: 0;
            }

            body, input, textarea, select, button {
                font-size: 12px;
                font-family: sans-serif;
            }
        </style>
    </head>
    <body>
        ${e}
        <script type="module">
            let height = 0

            function sendEmbedHeight() {
                window.parent.postMessage({
                    embedHeight: height
                }, "*")
            }

            const observer = new ResizeObserver((entries) => {
                if (entries.length !== 1) return
                const entry = entries[0]
                if (entry.target !== document.body) return

                height = entry.contentRect.height
                sendEmbedHeight()
            })

            observer.observe(document.body)

            window.addEventListener("message", (event) => {
                if (event.source !== window.parent) return
                if (event.data !== "getEmbedHeight") return
                sendEmbedHeight()
            })
        <\/script>
    <body>
</html>
`,d={...X,...n};return n.height||(d.height=c+`px`),s(`iframe`,{ref:o,style:d,srcDoc:u})}function W({html:e,style:n}){let i=t();return r(()=>{let t=i.current;if(t)return t.innerHTML=e,K(t),()=>{t.innerHTML=``}},[e]),s(`div`,{ref:i,style:{...Z,...n}})}function G({html:e,style:t}){return s(`div`,{style:{...Z,...t},dangerouslySetInnerHTML:{__html:e}})}function K(e){if(e instanceof Element&&e.tagName===`SCRIPT`){let t=document.createElement(`script`);t.text=e.innerHTML;for(let{name:n,value:r}of e.attributes)t.setAttribute(n,r);e.parentElement.replaceChild(t,e)}else for(let t of e.childNodes)K(t)}function q(){return s(`div`,{className:`framerInternalUI-componentPlaceholder`,style:{...S,overflow:`hidden`},children:s(`div`,{style:Q,children:`Loading…`})})}function J({message:e,style:t}){return s(`div`,{className:`framerInternalUI-errorPlaceholder`,style:{minHeight:Y(t),...S,overflow:`hidden`,...t},children:s(`div`,{style:Q,children:e})})}function Y(e){if(!e.height)return 200}var X,Z,Q,ee=e((()=>{n(),l(),o(),m(),C(),p(R,{type:{type:h.Enum,defaultValue:`url`,displaySegmentedControl:!0,options:[`url`,`html`],optionTitles:[`URL`,`HTML`]},url:{title:`URL`,type:h.String,description:`Some websites don’t support embedding.`,hidden(e){return e.type!==`url`}},html:{title:`HTML`,type:h.String,displayTextArea:!0,hidden(e){return e.type!==`html`}},border:{title:`Border`,type:h.Border,optional:!0,hidden(e){return e.type!==`url`}},radius:{type:h.BorderRadius,title:`Radius`,hidden(e){return e.type!==`url`}},zoom:{title:`Zoom`,defaultValue:1,type:h.Number,hidden(e){return e.type!==`url`},min:.1,max:1,step:.1,displayStepper:!0}}),X={width:`100%`,height:`100%`,border:`none`},Z={width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`,justifyContent:`center`,alignItems:`center`},Q={textAlign:`center`,minWidth:140}})),$,te=e((()=>{m(),$=f({title:`Liquid Gradient`,resolutionScale:`consistent`,fragment:`
// === CONSTANTS ===
const float GOLDEN_ANGLE = 2.3999632;
const float TAU = 6.28318530;

// === PCG hash - https://www.jcgt.org/published/0009/03/02/
uvec3 hash3(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return v;
}

// Seed
vec3 seedRandom(float seedVal) {
    uvec3 s = uvec3(
        floatBitsToUint(seedVal),
        floatBitsToUint(seedVal * 1.5 + 7.31),
        floatBitsToUint(seedVal * 2.7 + 13.37)
    );
    s = hash3(s);
    return vec3(s) / float(0xFFFFFFFFu);
}

// === COLOR SPACE UTILITIES ===
vec3 toLinear(vec3 c) {
    return pow(c, vec3(2.2));
}

vec3 toSrgb(vec3 c) {
    return pow(clamp(c, 0.0, 1.0), vec3(0.4545));
}

vec3 linearToOklab(vec3 c) {
    float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
    float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
    float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
    
    l = pow(max(l, 0.0), 1.0/3.0);
    m = pow(max(m, 0.0), 1.0/3.0);
    s = pow(max(s, 0.0), 1.0/3.0);
    
    return vec3(
        0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    );
}

vec3 oklabToLinear(vec3 c) {
    float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
    float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
    float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
    
    l = l * l * l;
    m = m * m * m;
    s = s * s * s;
    
    return vec3(
        +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    );
}

vec3 oklabToLch(vec3 lab) {
    return vec3(lab.x, length(lab.yz), atan(lab.z, lab.y));
}

vec3 lchToOklab(vec3 lch) {
    return vec3(lch.x, lch.y * cos(lch.z), lch.y * sin(lch.z));
}

vec3 mixLch(vec3 lab0, vec3 lab1, float t) {
    vec3 lch0 = oklabToLch(lab0);
    vec3 lch1 = oklabToLch(lab1);
    
    if (lch0.y < 0.05) lch0.z = lch1.z;
    if (lch1.y < 0.05) lch1.z = lch0.z;
    
    float dh = lch1.z - lch0.z;
    if (dh > 3.14159265) dh -= 6.28318530;
    if (dh < -3.14159265) dh += 6.28318530;
    
    return lchToOklab(vec3(
        mix(lch0.x, lch1.x, t),
        mix(lch0.y, lch1.y, t),
        lch0.z + dh * t
    ));
}

// === PALETTE SAMPLING ===
vec3 getColor(int idx) {
    if (u_colors_length < 1) return vec3(0.0);
    int safeIdx = clamp(idx, 0, u_colors_length - 1);
    return u_colors[safeIdx].rgb;
}

vec3 paletteN(float t, int count) {
    if (count < 1) return vec3(0.0);
    if (count < 2) return toLinear(getColor(0));
    
    float segmentSize = 1.0 / float(count - 1);
    t = clamp(t, 0.0, 1.0);
    int idx = min(int(floor(t / segmentSize)), count - 2);
    float localT = clamp((t - float(idx) * segmentSize) / segmentSize, 0.0, 1.0);
    
    vec3 lab0 = linearToOklab(toLinear(getColor(idx)));
    vec3 lab1 = linearToOklab(toLinear(getColor(idx + 1)));
    
    return oklabToLinear(mixLch(lab0, lab1, localT));
}

// === DITHER ===
float IGN(vec2 uv) {
    return fract(52.9829189 * fract(dot(uv, vec2(0.06711056, 0.00583715))));
}

float quickNoise(vec2 I) {
    return fract(sin(dot(I, vec2(12.9898, 78.233))) * 43758.5453);
}

// Dither Mode: 0=Off, 1=IGN, 2=quickNoise
float getDither(vec2 I, float mode) {
    if (mode < 0.5) return 0.5;          // 0: Off
    if (mode < 1.5) return IGN(I);       // 1: Smooth
    return quickNoise(I);                // 2: Grain
}

// === POST-PROCESS ===
vec3 softGamutMap(vec3 linearRgb) {
    float maxC = max(linearRgb.r, max(linearRgb.g, linearRgb.b));
    float minC = min(linearRgb.r, min(linearRgb.g, linearRgb.b));
    
    if (minC >= 0.0 && maxC <= 1.0) return linearRgb;
    
    vec3 lab = linearToOklab(max(linearRgb, 0.0));
    float L = clamp(lab.x, 0.0, 1.0);
    float C = length(lab.yz);
    float h = atan(lab.z, lab.y);
    
    float maxChroma = 0.4 * (1.0 - pow(abs(2.0 * L - 1.0), 2.0));
    
    if (C > maxChroma * 0.7) {
        float knee = maxChroma * 0.7;
        C = knee + (maxChroma - knee) * tanh((C - knee) / (maxChroma - knee + 0.001));
    }
    
    return clamp(oklabToLinear(vec3(L, C * cos(h), C * sin(h))), 0.0, 1.0);
}

vec3 applyContrastSaturation(vec3 linearRgb, float contrast, float saturation) {
    vec3 lab = linearToOklab(linearRgb);
    float C = length(lab.yz);
    float h = atan(lab.z, lab.y);
    
    lab.x = clamp((lab.x - 0.5) * contrast + 0.5, 0.0, 1.0);
    C *= saturation;
    lab.y = C * cos(h);
    lab.z = C * sin(h);
    
    return oklabToLinear(lab);
}

// === MAIN ===
void main() {
    vec2 fragCoord = v_uv * u_resolution;
    vec2 r = u_resolution;
    vec2 p = (fragCoord * 2.0 - r) / r.y;
    
    int colorCount = u_colors_length;
    
    // Early out: no colors -> black
    if (colorCount < 1) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    float t = u_time * 0.3;
    
    // Map time onto a circle so animation seamlessly wraps.
    float looping = step(0.5, u_loop);
    float phase = TAU * u_time / max(u_loop, 0.01);
    float radius = u_loop * u_speed * 0.3 / TAU;
    float tA = sin(phase) * radius;
    float tB = (1.0 - cos(phase)) * radius;
    
    // Seed-based offsets
    vec3 seedOffset = seedRandom(u_seed);
    vec3 seedOffset2 = seedRandom(u_seed + 100.0);
    
    // Golden angle rotation
    float seedAngle = u_seed * GOLDEN_ANGLE;
    vec2 seedPhase = (seedOffset2.xy - 0.5) * TAU;
    
    // Seed-based rotation
    float cs = cos(seedAngle);
    float sn = sin(seedAngle);
    p = mat2(cs, -sn, sn, cs) * p;
    
    // Get dither value
    float dither = getDither(floor(fragCoord / u_pixelRatio), u_ditherMode);
    
    // === TURBULENCE ===
    float totalVal = 0.0;
    float totalWeight = 0.0;
    int turbIter = int(u_turbIter);
    
    float freq = 1.0 / max(u_turbFreq, 0.01);
    
    for (float i = 0.0; i < 4.0; i++) {
        float eph = i / 4.0;
       
        vec2 q = p * u_scale;
        float sq = eph * eph;
        
        if (u_jellify > 0.5) {
            q.yx *= mix(1.0, 0.5, 1.0 - exp(-sq));
        }
        
        float a = seedPhase.x;
        float d = seedPhase.y;
        
        for (int j = 2; j < 13; j++) {
            if (j >= turbIter) break;
            float fj = float(j);
            // When looping, use circular time. Otherwise original t.
            float t1 = mix(t * u_speed, tA, looping);
            float t2 = mix(t * u_speed, tB, looping);
            q += u_turbAmp * sin(q.yx / freq * fj + t1 + vec2(a, d) + seedOffset.xy * fj) / fj;
            a += cos(fj + d * 1.2 + q.x * 2.0 - t1 + seedOffset2.z + t2 * 0.3 * looping);
            d += sin(fj * q.y + a + seedOffset.z + t1 + seedOffset2.y + t2 * 0.3 * looping);
        }
        
        float v = 0.5 + 0.5 * sin(length(q.yx + vec2(a, d) * 0.2) * u_waveFreq + i * i + seedOffset.x);
        float weight = smoothstep(0.0, 0.5, eph) * smoothstep(1.0, 0.5, eph);
        totalVal += v * weight;
        totalWeight += weight;
    }
    
    float val = totalVal / totalWeight;
    val = clamp((val - 0.3) / 0.4, 0.0, 1.0);
    val = pow(val, exp(-u_distBias));
    val = clamp(val + (dither - 0.5) * u_dither, 0.0, 1.0);
    
    vec3 col = paletteN(val, colorCount);
    col *= u_exposure;
    col = applyContrastSaturation(col, u_contrast, u_saturation);
    col = softGamutMap(col);
    col = toSrgb(col);
    
    fragColor = vec4(col, 1.0);
}
`,propertyControls:{colors:{type:h.Array,title:`Colors`,control:{type:h.Color},maxCount:8,defaultValue:[`#00001A`,`#2962FF`,`#40BCFF`,`#FFB8B5`,`#FFC14F`]},seed:{type:h.Number,title:`Seed`,defaultValue:648,min:0,max:1e3,step:1},speed:{type:h.Number,title:`Speed`,defaultValue:.3,min:0,max:2,step:.01},loop:{type:h.Number,title:`Loop`,defaultValue:0,min:0,max:60,step:.5,hiddenWhenUnset:!0,displayStepper:!0},scale:{type:h.Number,title:`Scale`,defaultValue:.42,min:.1,max:2,step:.01},turbAmp:{type:h.Number,title:`Amplitude`,defaultValue:.6,min:0,max:1,step:.01},turbFreq:{type:h.Number,title:`Frequency`,defaultValue:.1,min:.1,max:2,step:.01},turbIter:{type:h.Number,title:`Definition`,defaultValue:7,min:3,max:10,step:1,displayStepper:!0},waveFreq:{type:h.Number,title:`Bands`,defaultValue:3.8,min:.1,max:5,step:.1},distBias:{type:h.Number,title:`Bias`,defaultValue:0,min:-1,max:1,step:.1,hiddenWhenUnset:!0},jellify:{type:h.Boolean,title:`Jellify`,defaultValue:!1,hiddenWhenUnset:!0},ditherMode:{type:h.Enum,title:`Noise`,options:[0,1,2],optionTitles:[`Off`,`Smooth`,`Grain`],defaultValue:0},dither:{type:h.Number,title:`Amount`,defaultValue:.05,min:0,max:.2,step:.01,hidden:e=>e.ditherMode===0},exposure:{type:h.Number,title:`Exposure`,defaultValue:1.1,min:.5,max:2,step:.1,section:`Filters`,displayStepper:!0,hiddenWhenUnset:!0},contrast:{type:h.Number,title:`Contrast`,defaultValue:1.1,min:.5,max:2,step:.1,section:`Filters`,displayStepper:!0,hiddenWhenUnset:!0},saturation:{type:h.Number,title:`Saturation`,defaultValue:1,min:0,max:2,step:.1,section:`Filters`,displayStepper:!0,hiddenWhenUnset:!0}}})}));export{w as a,ee as i,te as n,L as o,R as r,$ as t};
//# sourceMappingURL=LiquidGradient.qTkz5-jI.mjs.map