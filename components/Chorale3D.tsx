"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"

/**
 * Chorale3D — the CHORALE plugin as a real, slowly spinning 3D hardware unit.
 *
 * The faceplate art is a texture baked from the plugin's actual UI
 * (Chorale/assets/faceplate.html → chorale-3d-bake.png; rebake after 2D changes).
 * Raised parts (plate, knobs, fader caps, screen, keyboard bed…) are true
 * geometry whose UVs are computed from world position against the full bake,
 * so every surface samples exactly the pixels it covers in the 2D design.
 *
 * Transparent canvas — the bento cell's paper backing shows through; a
 * ShadowMaterial plane behind the unit catches a soft real-time drop shadow
 * (cheaper than re-running the CSS drop-shadow filter chain on every frame).
 * Pointer events pass through, so the parent <Link> cell stays clickable.
 */

/* ── design-space constants (must match Chorale/assets/faceplate.html) ── */
const DESIGN_W = 1562
const DESIGN_H = 1680
const FIT_RADIUS = 1140 // bounding-sphere radius incl. spin sweep + shadow air

/* 3D material palette — hardware walls; the faces come from the bake */
const PALETTE = {
  bodySide: "#17181a",
  bodyBack: "#121314",
  plateSide: "#d3d6dc",
  screenSide: "#b9bcc4",
  knobSide: "#c9cbce",
  blackKnobSide: "#141516",
  faderCapSide: "#95979a",
  arrowSide: "#232425",
  bedSide: "#0e0f10",
  wheelSide: "#0a0b0c",
}

function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape()
  const hw = w / 2, hh = h / 2
  s.moveTo(-hw + r, -hh)
  s.lineTo(hw - r, -hh); s.absarc(hw - r, -hh + r, r, -Math.PI / 2, 0, false)
  s.lineTo(hw, hh - r); s.absarc(hw - r, hh - r, r, 0, Math.PI / 2, false)
  s.lineTo(-hw + r, hh); s.absarc(-hw + r, hh - r, r, Math.PI / 2, Math.PI, false)
  s.lineTo(-hw, -hh + r); s.absarc(-hw + r, -hh + r, r, Math.PI, 1.5 * Math.PI, false)
  s.closePath()
  return s
}

/* map UVs from (already world-translated) vertex XY onto the full bake */
function faceplateUVs(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position as THREE.BufferAttribute
  const uv = geo.attributes.uv as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++)
    uv.setXY(i, (pos.getX(i) + DESIGN_W / 2) / DESIGN_W, (pos.getY(i) + DESIGN_H / 2) / DESIGN_H)
  uv.needsUpdate = true
}

const wx = (x: number, w: number) => x + w / 2 - DESIGN_W / 2
const wy = (y: number, h: number) => DESIGN_H / 2 - (y + h / 2)

export default function Chorale3D({ texture }: { texture: string }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    // 1.5× supersampling over the device ratio: the canvas is small, so this is cheap, and the
    // tighter screen-space derivatives make the GPU sample sharper mip levels of the bake —
    // without it the minified faceplate reads noticeably soft next to the 2D original
    renderer.setPixelRatio(Math.min(devicePixelRatio * 1.5, 3))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NoToneMapping // keep the designed colours exact
    // width/height:100% is required — an absolutely-positioned <canvas> (replaced element)
    // keeps its intrinsic buffer size despite inset:0, which at devicePixelRatio > 1 showed a
    // DPR×-zoomed top-left crop anchored down-right
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .5s ease-out"
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04)
    scene.environment = env.texture
    scene.environmentIntensity = 0.45

    const camera = new THREE.PerspectiveCamera(30, 1, 100, 30000)

    const key = new THREE.DirectionalLight(0xffffff, 0.9)
    key.position.set(-1200, 1600, 1900)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.radius = 4 // r185 dropped PCFSoftShadowMap; radius-blurred PCF restores the soft look
    key.shadow.camera.left = key.shadow.camera.bottom = -2100
    key.shadow.camera.right = key.shadow.camera.top = 2100
    key.shadow.camera.near = 200
    key.shadow.camera.far = 7000
    key.shadow.bias = -0.0004
    key.shadow.normalBias = 3
    scene.add(key, new THREE.AmbientLight(0xffffff, 0.42))

    /* invisible shadow catcher — the cell's paper shows through everywhere else */
    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(9000, 9000),
      new THREE.ShadowMaterial({ opacity: 0.14 })
    )
    backdrop.position.z = -320
    backdrop.receiveShadow = true
    scene.add(backdrop)

    const unit = new THREE.Group()
    scene.add(unit)

    const sideMat = (hex: string, metal = 0.15, rough = 0.6) =>
      new THREE.MeshStandardMaterial({ color: hex, metalness: metal, roughness: rough })

    const panel = (
      o: { x: number; y: number; w: number; h: number; r: number; z: number; depth: number; bevel?: number },
      cap: THREE.Material, side: THREE.Material
    ) => {
      const bevel = o.bevel ?? 0
      const geo = new THREE.ExtrudeGeometry(roundedRect(o.w, o.h, o.r), {
        depth: o.depth, curveSegments: 24,
        bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2,
      })
      geo.translate(wx(o.x, o.w), wy(o.y, o.h), o.z + bevel)
      faceplateUVs(geo)
      const m = new THREE.Mesh(geo, [cap, side])
      m.castShadow = m.receiveShadow = true
      unit.add(m)
    }

    const knob = (
      o: { cx: number; cy: number; r: number; z: number; h: number },
      cap: THREE.Material, side: THREE.Material
    ) => {
      const geo = new THREE.CylinderGeometry(o.r, o.r, o.h, 72)
      geo.rotateX(Math.PI / 2)
      geo.translate(o.cx - DESIGN_W / 2, DESIGN_H / 2 - o.cy, o.z + o.h / 2)
      faceplateUVs(geo)
      const m = new THREE.Mesh(geo, [side, cap, side])
      m.castShadow = m.receiveShadow = true
      unit.add(m)
    }

    let disposed = false
    new THREE.TextureLoader().load(texture, (tex) => {
      if (disposed) { tex.dispose(); return }
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy()

      const face = new THREE.MeshStandardMaterial({ map: tex, metalness: 0, roughness: 0.92 })

      /* chassis — front cap lands exactly at z = 0 */
      const bodyGeo = new THREE.ExtrudeGeometry(roundedRect(DESIGN_W, DESIGN_H, 20), {
        depth: 60, curveSegments: 24,
        bevelEnabled: true, bevelThickness: 3, bevelSize: 3, bevelSegments: 2,
      })
      bodyGeo.translate(0, 0, -63)
      const body = new THREE.Mesh(bodyGeo, [
        sideMat(PALETTE.bodyBack, 0.3, 0.55),
        sideMat(PALETTE.bodySide, 0.4, 0.5),
      ])
      body.castShadow = body.receiveShadow = true
      unit.add(body)

      /* front skin — the full baked faceplate, a hair proud of the chassis */
      const skinGeo = new THREE.ShapeGeometry(roundedRect(DESIGN_W, DESIGN_H, 20), 24)
      skinGeo.translate(0, 0, 1.5)
      faceplateUVs(skinGeo)
      const skin = new THREE.Mesh(skinGeo, face)
      skin.receiveShadow = true
      unit.add(skin)

      const SKIN = 1.6, PLATE = 18
      /* light plate (35,178) 1490×1235 r34 — top lands at z = 18 */
      panel({ x: 35, y: 178, w: 1490, h: 1235, r: 34, z: 2, depth: 12, bevel: 2 }, face, sideMat(PALETTE.plateSide, 0.15, 0.55))
      /* IR screen glass slab */
      panel({ x: 229, y: 455, w: 1060, h: 439, r: 26, z: PLATE, depth: 3 }, face, sideMat(PALETTE.screenSide, 0.2, 0.35))
      /* preset step buttons ‹ › */
      for (const cx of [305, 411]) knob({ cx, cy: 966, r: 33, z: PLATE, h: 8 }, face, sideMat(PALETTE.arrowSide, 0.15, 0.5))
      /* fader caps (both faders at value 0) */
      for (const x of [560, 920]) panel({ x, y: 951, w: 52, h: 27, r: 4, z: PLATE + 0.5, depth: 10, bevel: 1 }, face, sideMat(PALETTE.faderCapSide, 0.55, 0.4))
      /* the 4 Nest knobs — TRANSP · PRE-DLY · PITCH · GAIN */
      const nickel = sideMat(PALETTE.knobSide, 0.9, 0.32)
      for (const cx of [345, 620, 887, 1159]) knob({ cx, cy: 1213, r: 105, z: PLATE, h: 34 }, face, nickel)
      /* DRY / WET small black knobs */
      const blackWall = sideMat(PALETTE.blackKnobSide, 0.6, 0.45)
      for (const cx of [1233, 1416]) knob({ cx, cy: 1544, r: 45, z: SKIN, h: 20 }, face, blackWall)
      /* keyboard bed + pitch-wheel housing */
      panel({ x: 430, y: 1416, w: 639, h: 258, r: 19, z: SKIN, depth: 12, bevel: 1.5 }, face, sideMat(PALETTE.bedSide, 0.15, 0.6))
      panel({ x: 334, y: 1430, w: 62, h: 192, r: 28, z: SKIN, depth: 14, bevel: 2 }, face, sideMat(PALETTE.wheelSide, 0.15, 0.55))

      renderer.domElement.style.opacity = "1"
    })

    /* fit the spinning unit's bounding sphere into the cell */
    const fit = () => {
      const w = host.clientWidth || 1, h = host.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      const vFov = THREE.MathUtils.degToRad(camera.fov)
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect)
      const dist = FIT_RADIUS / Math.sin(Math.min(vFov, hFov) / 2)
      camera.position.set(0, 0, dist)
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(host)

    /* slow showcase spin + drag-to-rotate; the spin resumes on release.
       prefers-reduced-motion: no idle spin (static ¾ pose), drag still works. */
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    const SPIN = reduced ? 0 : 0.35
    const TILT = -0.1
    const timer = new THREE.Timer()
    unit.rotation.x = TILT
    if (reduced) unit.rotation.y = -0.45

    let dragging = false
    let moved = 0
    let px = 0, py = 0
    const onDown = (e: PointerEvent) => {
      dragging = true; moved = 0; px = e.clientX; py = e.clientY
      host.style.cursor = "grabbing"
      try { host.setPointerCapture(e.pointerId) } catch { /* pointer may already be gone */ }
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - px, dy = e.clientY - py
      px = e.clientX; py = e.clientY
      moved += Math.abs(dx) + Math.abs(dy)
      unit.rotation.y += dx * 0.006
      unit.rotation.x = THREE.MathUtils.clamp(unit.rotation.x + dy * 0.004, -0.65, 0.5)
    }
    const onUp = () => { dragging = false; host.style.cursor = "grab" }
    /* a real drag must not fall through as a click that navigates the parent <Link> */
    const onClick = (e: MouseEvent) => {
      if (moved > 8) { e.preventDefault(); e.stopPropagation() }
    }
    host.addEventListener("pointerdown", onDown)
    host.addEventListener("pointermove", onMove)
    host.addEventListener("pointerup", onUp)
    host.addEventListener("pointercancel", onUp)
    host.addEventListener("click", onClick)

    renderer.setAnimationLoop(() => {
      timer.update()
      const dt = timer.getDelta()
      if (!dragging && !reduced) {
        unit.rotation.y += dt * SPIN
        unit.rotation.x += (TILT - unit.rotation.x) * Math.min(1, dt * 3) // tilt eases back home
      }
      renderer.render(scene, camera)
    })

    return () => {
      disposed = true
      ro.disconnect()
      host.removeEventListener("pointerdown", onDown)
      host.removeEventListener("pointermove", onMove)
      host.removeEventListener("pointerup", onUp)
      host.removeEventListener("pointercancel", onUp)
      host.removeEventListener("click", onClick)
      renderer.setAnimationLoop(null)
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.isMesh) {
          mesh.geometry.dispose()
          for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
            (m as THREE.MeshStandardMaterial).map?.dispose()
            m.dispose()
          }
        }
      })
      env.texture.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [texture])

  return <div ref={hostRef} className="absolute inset-0" style={{ cursor: "grab", touchAction: "none" }} aria-hidden="true" />
}
