import * as THREE from "three"

/**
 * pluginUnit — a plugin faceplate as a piece of hardware: a dark chassis slab
 * with the faceplate texture as its skin and, for Chorale, the real raised
 * controls (plate, screen, knobs, caps…) so the light can catch them.
 *
 * Everything is built in the texture's design-pixel space, centred on the
 * origin, front face at z = 0 facing +z. Callers scale/orient the group:
 * PluginUnit3D spins it in front of a camera; DeskScene lays it on the desk.
 */

export const REF_W = 1562 // chorale design width — chassis depth/radius are relative to it

/* chorale-only raised-geometry table (design px, from faceplate.html) */
export const CHORALE = {
  plate: { x: 35, y: 178, w: 1490, h: 1235, r: 34 },
  screen: { x: 229, y: 455, w: 1060, h: 439, r: 26 },
  arrows: [305, 411].map((cx) => ({ cx, cy: 966, r: 33 })),
  faderCaps: [560, 920].map((x) => ({ x, y: 951, w: 52, h: 27, r: 4 })),
  knobs: [345, 620, 887, 1159].map((cx) => ({ cx, cy: 1213, r: 105 })),
  blackKnobs: [1233, 1416].map((cx) => ({ cx, cy: 1544, r: 45 })),
  bed: { x: 430, y: 1416, w: 639, h: 258, r: 19 },
  wheel: { x: 334, y: 1430, w: 62, h: 192, r: 28 },
}

export const PALETTE = {
  bodySide: "#17181a", bodyBack: "#121314",
  plateSide: "#d3d6dc", screenSide: "#b9bcc4",
  knobSide: "#c9cbce", blackKnobSide: "#141516",
  faderCapSide: "#95979a", arrowSide: "#232425",
  bedSide: "#0e0f10", wheelSide: "#0a0b0c",
}

export function roundedRect(w: number, h: number, r: number): THREE.Shape {
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

export type UnitOptions = {
  texture: THREE.Texture
  W: number
  H: number
  raised?: boolean
  /** multiplies the faceplate texture — a cool tint reads as a different material */
  faceTint?: string
  faceRoughness?: number
  /** side/chassis material tint (default neutral) */
  bodyTint?: string
  /** how strongly the chassis and raised parts pick up the environment */
  envIntensity?: number
}

export function buildPluginUnit({
  texture, W, H, raised = false, faceTint = "#ffffff", faceRoughness = 0.92, bodyTint, envIntensity = 1,
}: UnitOptions): THREE.Group {
  const unit = new THREE.Group()
  const k = W / REF_W // design px per chorale px — keeps chassis depth proportional

  const face = new THREE.MeshStandardMaterial({
    map: texture, color: faceTint, metalness: 0, roughness: faceRoughness, envMapIntensity: envIntensity,
  })
  const sideMat = (hex: string, metal = 0.15, rough = 0.6) => {
    const m = new THREE.MeshStandardMaterial({ color: hex, metalness: metal, roughness: rough, envMapIntensity: envIntensity })
    if (bodyTint) m.color.multiply(new THREE.Color(bodyTint))
    return m
  }

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

  /* chassis — front cap at z = 0; depth/radius scale with the design width so world stays ~60/20 */
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

  return unit
}

/** Frees every geometry and material under the group (textures are the caller's). */
export function disposeUnit(group: THREE.Object3D) {
  group.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.geometry.dispose()
    for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) m.dispose()
  })
}
