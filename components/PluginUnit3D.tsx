"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"

/**
 * PluginUnit3D — a plugin faceplate as a slowly spinning 3D hardware unit.
 * Generalisation of the original Chorale3D hero unit for the cassette screen:
 *  - any faceplate texture/size (Resonator renders as a clean chassis slab)
 *  - `raised` adds Chorale's true control geometry (knobs, plate, caps…)
 *  - non-interactive: display only (the cassette's PREV/NEXT do the pressing)
 *
 * Geometry is built in the texture's design-pixel space and the whole unit is
 * scaled to Chorale's width (1562) so camera, lights and shadows stay tuned.
 * three r185 notes: PCFShadowMap + shadow.radius (PCFSoft is gone), THREE.Timer.
 */

const REF_W = 1562 // chorale design width — the world scale everything is tuned to

/* chorale-only raised-geometry table (design px, from faceplate.html) */
const CHORALE = {
  plate: { x: 35, y: 178, w: 1490, h: 1235, r: 34 },
  screen: { x: 229, y: 455, w: 1060, h: 439, r: 26 },
  arrows: [305, 411].map((cx) => ({ cx, cy: 966, r: 33 })),
  faderCaps: [560, 920].map((x) => ({ x, y: 951, w: 52, h: 27, r: 4 })),
  knobs: [345, 620, 887, 1159].map((cx) => ({ cx, cy: 1213, r: 105 })),
  blackKnobs: [1233, 1416].map((cx) => ({ cx, cy: 1544, r: 45 })),
  bed: { x: 430, y: 1416, w: 639, h: 258, r: 19 },
  wheel: { x: 334, y: 1430, w: 62, h: 192, r: 28 },
}

const PALETTE = {
  bodySide: "#17181a", bodyBack: "#121314",
  plateSide: "#d3d6dc", screenSide: "#b9bcc4",
  knobSide: "#c9cbce", blackKnobSide: "#141516",
  faderCapSide: "#95979a", arrowSide: "#232425",
  bedSide: "#0e0f10", wheelSide: "#0a0b0c",
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

export default function PluginUnit3D({
  texture, designW, designH, raised = false,
}: { texture: string; designW: number; designH: number; raised?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const W = designW, H = designH
    const NORM = REF_W / W          // unit group scale into chorale-tuned world
    const k = 1 / NORM              // world px → design px

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio * 1.5, 3)) // supersample: mip sharpness
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NoToneMapping
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .5s ease-out"
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
    key.shadow.camera.left = key.shadow.camera.bottom = -2100
    key.shadow.camera.right = key.shadow.camera.top = 2100
    key.shadow.camera.near = 200
    key.shadow.camera.far = 7000
    key.shadow.bias = -0.0004
    key.shadow.normalBias = 3
    key.shadow.radius = 4
    scene.add(key, new THREE.AmbientLight(0xffffff, 0.42))

    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(9000, 9000),
      new THREE.ShadowMaterial({ opacity: 0.14 })
    )
    backdrop.position.z = -320
    backdrop.receiveShadow = true
    scene.add(backdrop)

    const unit = new THREE.Group()
    unit.scale.setScalar(NORM)
    scene.add(unit)

    const sideMat = (hex: string, metal = 0.15, rough = 0.6) =>
      new THREE.MeshStandardMaterial({ color: hex, metalness: metal, roughness: rough })

    const faceplateUVs = (geo: THREE.BufferGeometry) => {
      const pos = geo.attributes.position as THREE.BufferAttribute
      const uv = geo.attributes.uv as THREE.BufferAttribute
      for (let i = 0; i < pos.count; i++)
        uv.setXY(i, (pos.getX(i) + W / 2) / W, (pos.getY(i) + H / 2) / H)
      uv.needsUpdate = true
    }
    const wx = (x: number, w: number) => x + w / 2 - W / 2
    const wy = (y: number, h: number) => H / 2 - (y + h / 2)

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
      geo.translate(o.cx - W / 2, H / 2 - o.cy, o.z + o.h / 2)
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

      /* chassis — front cap at z = 0; depth/radius in design px so world stays ~60/20 */
      const D = 60 * k, BV = 3 * k, R = 20 * k
      const bodyGeo = new THREE.ExtrudeGeometry(roundedRect(W, H, R), {
        depth: D, curveSegments: 24,
        bevelEnabled: true, bevelThickness: BV, bevelSize: BV, bevelSegments: 2,
      })
      bodyGeo.translate(0, 0, -(D + BV))
      const body = new THREE.Mesh(bodyGeo, [
        sideMat(PALETTE.bodyBack, 0.3, 0.55),
        sideMat(PALETTE.bodySide, 0.4, 0.5),
      ])
      body.castShadow = body.receiveShadow = true
      unit.add(body)

      const skinGeo = new THREE.ShapeGeometry(roundedRect(W, H, R), 24)
      skinGeo.translate(0, 0, 1.5 * k)
      faceplateUVs(skinGeo)
      const skin = new THREE.Mesh(skinGeo, face)
      skin.receiveShadow = true
      unit.add(skin)

      if (raised) {
        const C = CHORALE, SKIN = 1.6, PLATE = 18
        panel({ ...C.plate, z: 2, depth: 12, bevel: 2 }, face, sideMat(PALETTE.plateSide, 0.15, 0.55))
        panel({ ...C.screen, z: PLATE, depth: 3 }, face, sideMat(PALETTE.screenSide, 0.2, 0.35))
        for (const a of C.arrows) knob({ ...a, z: PLATE, h: 8 }, face, sideMat(PALETTE.arrowSide, 0.15, 0.5))
        for (const f of C.faderCaps) panel({ ...f, z: PLATE + 0.5, depth: 10, bevel: 1 }, face, sideMat(PALETTE.faderCapSide, 0.55, 0.4))
        const nickel = sideMat(PALETTE.knobSide, 0.9, 0.32)
        for (const kn of C.knobs) knob({ ...kn, z: PLATE, h: 34 }, face, nickel)
        const blackWall = sideMat(PALETTE.blackKnobSide, 0.6, 0.45)
        for (const kn of C.blackKnobs) knob({ ...kn, z: SKIN, h: 20 }, face, blackWall)
        panel({ ...C.bed, z: SKIN, depth: 12, bevel: 1.5 }, face, sideMat(PALETTE.bedSide, 0.15, 0.6))
        panel({ ...C.wheel, z: SKIN, depth: 14, bevel: 2 }, face, sideMat(PALETTE.wheelSide, 0.15, 0.55))
      }

      renderer.domElement.style.opacity = "1"
    })

    /* fit the spinning unit's bounding sphere into the host */
    const FIT_RADIUS = Math.hypot(REF_W / 2, (H * NORM) / 2) * 0.97
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

    /* slow showcase spin; static ¾ pose for prefers-reduced-motion */
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = new THREE.Timer()
    unit.rotation.x = -0.1
    if (reduced) unit.rotation.y = -0.45
    renderer.setAnimationLoop(() => {
      timer.update()
      if (!reduced) unit.rotation.y += timer.getDelta() * 0.35
      renderer.render(scene, camera)
    })

    return () => {
      disposed = true
      ro.disconnect()
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
  }, [texture, designW, designH, raised])

  return <div ref={hostRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
}
