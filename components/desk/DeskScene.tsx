"use client"

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"
import { buildPluginUnit, disposeUnit } from "./pluginUnit"

/**
 * DeskScene — the things on the desk, shot flat-lay from directly above:
 * the plugin units lying on the wood (each a real 3D chassis, see
 * ./pluginUnit), a plant in the corner, and the shadows they all cast.
 *
 * The canvas is transparent: the wood is CSS (components/desk/WoodTable) and
 * shadows fall onto it through a shadow-only catcher plane. One warm key
 * light from the top-left is the sun; a unit can additionally ask for the
 * "cool" rig — white overhead light with violet grazing lights at the edges
 * — which is confined to it by point-light falloff (Chorale's industrial
 * look next to Resonator's sunlit one).
 *
 * World is metres, Y up, desk in the XZ plane. The orthographic camera looks
 * straight down with screen-up = -Z and zoom PX_PER_M, so 1 m of desk =
 * PX_PER_M CSS px: DOM px ↔ world m is a plain division. The scene reports
 * where each unit landed (px, canvas-relative) so the DOM can put captions and
 * links exactly on top.
 *
 * Models: CC0 from Poly Haven (scripts/fetch-desk-assets.mjs).
 */

export const PX_PER_M = 1300

/** CSS px, relative to the canvas centre, y down. */
export type Footprint = { x: number; y: number; w: number; h: number }

export type UnitSpec = {
  slug: string
  texture: string
  designW: number
  designH: number
  raised?: boolean
  /** physical width on the desk, metres */
  width: number
  light?: "sun" | "cool"
  /** resting yaw on the desk, radians (a little askew reads as placed by hand) */
  yaw?: number
  /** powers on when focused: accent graphics glow and light the desk (needs a GLOW entry) */
  powers?: boolean
}

/** Where a unit ended up: px, relative to the canvas top-left. */
export type UnitRect = { slug: string; left: number; top: number; width: number; height: number }

/**
 * Focus — the clicked unit, in the moment it was clicked. While a unit is
 * focused it powers on (its accent graphics glow and spill light onto the
 * desk) and the camera dollies in on it until it fills the viewport. Clearing
 * the focus powers it down and pulls the camera back out.
 */
export type Focus = { slug: string; startedAt: number }
export const DOLLY_MS = 1000
export const POWER_MS = 850

/** accent glow per unit: which faceplate colours light up, and the colour that spills onto the desk */
const GLOW: Record<string, { hue: [number, number]; sat: number; val: number; spill: string }> = {
  chorale: { hue: [225, 300], sat: 0.28, val: 0.35, spill: "#7c5cff" },
  resonator: { hue: [70, 160], sat: 0.12, val: 0.4, spill: "#8fbf7a" },
}

const ASSETS = "/assets/desk"
const PLANT = `${ASSETS}/plant/potted_plant_04_1k.gltf`

// Key light from the top-left, like the sun through the window.
const KEY_DIR: [number, number, number] = [-1.1, 2.2, -1.3]

const GAP = 0.07            // between units, metres
const MARGIN = 0.08         // fraction of the canvas kept clear on each side
const COLUMN_BELOW = 720    // px: narrower canvases stack the units
const CAPTION_PX = 150      // px kept under each unit for its caption in the column layout

/* ------------------------------------------------------------------ */

function RoomEnv({ intensity }: { intensity: number }) {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04)
    scene.environment = env.texture
    scene.environmentIntensity = intensity
    return () => {
      scene.environment = null
      env.texture.dispose()
      pmrem.dispose()
    }
  }, [gl, scene, intensity])
  return null
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Straight-down orthographic camera with a whisper of parallax on the pointer.
 * Given a `focus`, it dollies in: the look-at slides to the unit and the zoom
 * grows until the unit fills the viewport, with a small tilt so the raised
 * parts get some parallax on the way in.
 */
function Rig({ focus }: { focus: { x: number; z: number; w: number; d: number; startedAt: number } | null }) {
  const { camera, size } = useThree()
  const target = useRef(new THREE.Vector3(0, 3, 0))
  const look = useRef(new THREE.Vector3())
  const lookTarget = useRef(new THREE.Vector3())
  const zoomRef = useRef(PX_PER_M)
  useFrame((state, dt) => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    const px = reduced ? 0 : state.pointer.x
    const py = reduced ? 0 : state.pointer.y

    let zoom = PX_PER_M
    lookTarget.current.set(0, 0, 0)
    target.current.set(px * 0.09, 3, -py * 0.09)
    if (focus) {
      const t = easeInOut(Math.min(1, (performance.now() - focus.startedAt) / DOLLY_MS))
      const fill = Math.min(size.width / (focus.w * PX_PER_M), size.height / (focus.d * PX_PER_M)) * 0.9
      zoom = PX_PER_M * (1 + (fill - 1) * t)
      lookTarget.current.set(focus.x * t, 0, focus.z * t)
      // drift the eye a touch past the unit so the top-left key side tilts toward us
      target.current.set(focus.x * t - 0.12 * t, 3, focus.z * t + 0.16 * t)
    }
    // pointer parallax is lazy; the dolly tracks its eased curve tightly; the return is in between
    const k = 1 - Math.exp(-dt * (focus ? 12 : 4))
    camera.position.lerp(target.current, k)
    look.current.lerp(lookTarget.current, k)
    zoomRef.current += (zoom - zoomRef.current) * k
    if (Math.abs(camera.zoom - zoomRef.current) > 0.01) {
      camera.zoom = zoomRef.current
      camera.updateProjectionMatrix()
    }
    camera.up.set(0, 0, -1)
    camera.lookAt(look.current)
  })
  return null
}

/** Catches shadows for the CSS wood underneath; otherwise invisible. */
function ShadowCatcher() {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[6, 4]} />
      <shadowMaterial transparent opacity={0.52} color="#1a0e06" />
    </mesh>
  )
}

function Model({
  url, position, rotationY,
}: { url: string; position: readonly [number, number, number]; rotationY: number }) {
  const { scene } = useGLTF(url)
  useEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) m.castShadow = m.receiveShadow = true
    })
  }, [scene])
  return (
    <group position={[position[0], position[1], position[2]]} rotation-y={rotationY}>
      <primitive object={scene} />
    </group>
  )
}

/** The plant breathes: a slow, tiny sway so the scene isn't a still photo. */
function Plant({ position }: { position: readonly [number, number, number] }) {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!g.current) return
    const t = clock.elapsedTime
    g.current.rotation.z = Math.sin(t * 0.6) * 0.012
    g.current.rotation.x = Math.sin(t * 0.43 + 1.3) * 0.009
  })
  return (
    <group ref={g}>
      <Model url={PLANT} position={position} rotationY={0.4} />
    </group>
  )
}

/** Invisible box at a DOM device's footprint so it casts a real shadow. */
function CassetteShadow({ footprint }: { footprint: Footprint | null }) {
  if (!footprint) return null
  const w = footprint.w / PX_PER_M
  const d = footprint.h / PX_PER_M
  const h = 0.048 // device thickness
  return (
    <mesh position={[footprint.x / PX_PER_M, h / 2, footprint.y / PX_PER_M]} castShadow>
      <boxGeometry args={[w, h, d]} />
      <meshBasicMaterial colorWrite={false} depthWrite={false} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */

type Placed = UnitSpec & { x: number; z: number; w: number; d: number; scale: number }

/**
 * Lays the units out for the canvas size: a row, centred, scaled down together
 * when the canvas is narrower than they are; a column on narrow screens.
 * Returns metres, +x right, +z down-screen.
 */
function layoutUnits(units: UnitSpec[], widthPx: number, heightPx: number): Placed[] {
  const availW = (widthPx * (1 - 2 * MARGIN)) / PX_PER_M
  const availH = (heightPx * (1 - 2 * MARGIN)) / PX_PER_M
  const dims = units.map((u) => ({ w: u.width, d: u.width * (u.designH / u.designW) }))
  const column = widthPx < COLUMN_BELOW

  if (!column) {
    const total = dims.reduce((s, m) => s + m.w, 0) + GAP * (units.length - 1)
    const tallest = Math.max(...dims.map((m) => m.d))
    const s = Math.min(1, availW / total, (availH * 0.8) / tallest)
    let x = (-total * s) / 2
    return units.map((u, i) => {
      const w = dims[i].w * s, d = dims[i].d * s
      const p = { ...u, x: x + w / 2, z: 0.015, w, d, scale: s }
      x += w + GAP * s
      return p
    })
  }

  // column: the gap is fixed (px), not scaled — each unit's caption hangs in it
  const gap = CAPTION_PX / PX_PER_M
  const sumD = dims.reduce((s, m) => s + m.d, 0)
  const widest = Math.max(...dims.map((m) => m.w))
  const s = Math.max(0.2, Math.min(1, availW / widest, (availH * 0.9 - gap * (units.length - 1) - gap * 0.5) / sumD))
  const total = sumD * s + gap * (units.length - 1)
  let z = -total / 2 - gap * 0.25
  return units.map((u, i) => {
    const w = dims[i].w * s, d = dims[i].d * s
    const p = { ...u, x: 0, z: z + d / 2, w, d, scale: s }
    z += d + gap
    return p
  })
}

/**
 * Builds the emissive map for a unit's power-on: a copy of the faceplate that
 * keeps only its accent-coloured pixels (knob rings, lit keys, highlight bars),
 * so those and nothing else glow when the unit wakes.
 */
function glowMap(tex: THREE.Texture, slug: string): THREE.Texture | null {
  const g = GLOW[slug]
  const img = tex.image as HTMLImageElement | ImageBitmap | undefined
  if (!g || !img || !("width" in img)) return null
  const c = document.createElement("canvas")
  c.width = img.width; c.height = img.height
  const ctx = c.getContext("2d", { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(img, 0, 0)
  const id = ctx.getImageData(0, 0, c.width, c.height)
  const d = id.data
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i] / 255, gg = d[i + 1] / 255, b = d[i + 2] / 255
    const max = Math.max(r, gg, b), min = Math.min(r, gg, b), delta = max - min
    const sat = max === 0 ? 0 : delta / max
    let hue = 0
    if (delta > 0) {
      if (max === r) hue = 60 * (((gg - b) / delta) % 6)
      else if (max === gg) hue = 60 * ((b - r) / delta + 2)
      else hue = 60 * ((r - gg) / delta + 4)
      if (hue < 0) hue += 360
    }
    const inHue = hue >= g.hue[0] && hue <= g.hue[1]
    // soft edge on saturation so anti-aliased rims don't crumble
    const w = inHue && max >= g.val ? Math.min(1, Math.max(0, (sat - g.sat) / 0.12)) : 0
    d[i] = d[i] * w; d[i + 1] = d[i + 1] * w; d[i + 2] = d[i + 2] * w
  }
  ctx.putImageData(id, 0, 0)
  const out = new THREE.CanvasTexture(c)
  out.colorSpace = THREE.SRGBColorSpace
  out.flipY = tex.flipY
  out.anisotropy = tex.anisotropy
  return out
}

/** power-on envelope: a lamp-like flicker, then a settle — 0..1 over POWER_MS */
function powerCurve(ms: number): number {
  const t = ms / POWER_MS
  if (t <= 0) return 0
  if (t < 0.1) return (t / 0.1) * 0.7
  if (t < 0.18) return 0.7 - ((t - 0.1) / 0.08) * 0.55
  if (t < 0.6) { const u = (t - 0.18) / 0.42; return 0.15 + (1 - Math.pow(1 - u, 3)) * 0.85 }
  return 1
}

/** One plugin unit lying on the desk, lifting a touch when its DOM link is hovered. */
function Unit({ unit, hovered, powered }: { unit: Placed; hovered: boolean; powered: number | null }) {
  const tex = useLoader(THREE.TextureLoader, unit.texture)
  const { gl } = useThree()
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = gl.capabilities.getMaxAnisotropy()
    tex.needsUpdate = true
  }, [tex, gl])

  const cool = unit.light === "cool"
  const group = useMemo(() => {
    const g = buildPluginUnit({
      texture: tex, W: unit.designW, H: unit.designH, raised: unit.raised,
      // Chorale: a cool-white cast on the faceplate and stronger environment
      // reflections on the metal — it reads as machined, not sun-warmed.
      faceTint: cool ? "#f4f4fc" : "#ffffff",
      faceRoughness: cool ? 0.8 : 0.92,
      envIntensity: cool ? 1.6 : 1,
    })
    // design px → metres, then lay it face-up: design +y → screen-up (-z),
    // design +z (out of the face) → world +y
    const s = unit.w / unit.designW
    g.scale.setScalar(s)
    g.rotation.x = -Math.PI / 2
    // rest the chassis back on the desk
    const box = new THREE.Box3().setFromObject(g)
    g.position.y = -box.min.y
    return g
  }, [tex, unit.designW, unit.designH, unit.raised, unit.w, cool])
  useEffect(() => () => disposeUnit(group), [group])

  // the faceplate material (shared by the skin and every raised cap) gets its
  // glow map after first paint, so building it never delays the scene
  const faceMat = useRef<THREE.MeshStandardMaterial | null>(null)
  useEffect(() => {
    if (!unit.powers) return
    let glow: THREE.Texture | null = null
    const id = requestAnimationFrame(() => {
      group.traverse((o) => {
        const m = o as THREE.Mesh
        if (!m.isMesh) return
        for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
          const sm = mat as THREE.MeshStandardMaterial
          if (sm.map === tex && !faceMat.current) faceMat.current = sm
        }
      })
      const fm = faceMat.current
      if (!fm) return
      glow = glowMap(tex, unit.slug)
      if (!glow) return
      fm.emissiveMap = glow
      fm.emissive.set("#ffffff")
      fm.emissiveIntensity = 0
      fm.needsUpdate = true
    })
    return () => {
      cancelAnimationFrame(id)
      glow?.dispose()
      faceMat.current = null
    }
  }, [group, tex, unit.slug, unit.powers])

  const outer = useRef<THREE.Group>(null)
  const spill = useRef<THREE.PointLight>(null)
  const lift = useRef(0)
  const glow = useRef(0)
  useFrame((_, dt) => {
    const o = outer.current
    if (!o) return
    const k = 1 - Math.exp(-dt * 9)
    // powering on follows the flicker curve exactly; powering off just fades
    if (powered !== null) glow.current = powerCurve(performance.now() - powered)
    else glow.current += (0 - glow.current) * (1 - Math.exp(-dt * 6))
    const on = glow.current
    lift.current += ((hovered || on > 0.02 ? 1 : 0) - lift.current) * k
    o.position.y = lift.current * 0.02
    const sc = 1 + lift.current * 0.02
    o.scale.setScalar(sc)
    if (faceMat.current) faceMat.current.emissiveIntensity = on * 1.6
    if (spill.current) spill.current.intensity = on * 0.42
  })

  const hw = unit.w / 2, hd = unit.d / 2
  // the cool rig's overhead lamp is a spot aimed at the unit: its cone, not
  // distance falloff, is what keeps the white light off the neighbours
  const lampTarget = useMemo(() => new THREE.Object3D(), [])
  const lampH = 1.1
  const lampAngle = Math.atan(Math.hypot(hw, hd) * 1.15 / lampH)
  return (
    <group position={[unit.x, 0, unit.z]}>
      <group ref={outer} rotation-y={unit.yaw ?? 0}>
        <primitive object={group} />
      </group>
      {/* power-on: the unit's own light on the desk around it */}
      <pointLight ref={spill} position={[0, 0.16, 0]} color={GLOW[unit.slug]?.spill ?? "#ffffff"} intensity={0} distance={0.8} decay={2} />
      {cool && (
        <>
          <primitive object={lampTarget} position={[0, 0, 0]} />
          {/* white overhead: a work lamp, not the sun */}
          <spotLight
            position={[hw * 0.3, lampH, -hd * 0.25]}
            target={lampTarget}
            color="#eef2ff"
            intensity={0.95}
            angle={lampAngle}
            penumbra={0.55}
            decay={2}
            distance={lampH * 1.6}
          />
          {/* violet grazing lights at the desk, catching the chassis walls and knob rims */}
          <pointLight position={[-hw * 1.05, 0.05, hd * 0.55]} color="#7c5cff" intensity={0.09} distance={0.34} decay={2} />
          <pointLight position={[hw * 0.85, 0.045, -hd * 0.95]} color="#b7a6ff" intensity={0.06} distance={0.3} decay={2} />
        </>
      )}
    </group>
  )
}

function Units({
  units, hovered, focus, onLayout, onPlantSpot,
}: {
  units: UnitSpec[]
  hovered: string | null
  focus: Focus | null
  onLayout?: (rects: UnitRect[]) => void
  onPlantSpot: (p: readonly [number, number, number] | null) => void
}) {
  const { size } = useThree()
  const placed = useMemo(() => layoutUnits(units, size.width, size.height), [units, size.width, size.height])

  useEffect(() => {
    onLayout?.(placed.map((p) => ({
      slug: p.slug,
      left: size.width / 2 + (p.x - p.w / 2) * PX_PER_M,
      top: size.height / 2 + (p.z - p.d / 2) * PX_PER_M,
      width: p.w * PX_PER_M,
      height: p.d * PX_PER_M,
    })))
    // the plant takes the top-right corner if the units leave it free
    const halfW = size.width / 2 / PX_PER_M, halfH = size.height / 2 / PX_PER_M
    const right = Math.max(...placed.map((p) => p.x + p.w / 2))
    const px = Math.min(0.62, halfW - 0.13), pz = Math.max(-0.42, -halfH + 0.2)
    onPlantSpot(px - 0.17 > right && size.width >= COLUMN_BELOW ? [px, 0, pz] : null)
  }, [placed, size.width, size.height, onLayout, onPlantSpot])

  const focusUnit = focus ? placed.find((p) => p.slug === focus.slug) : undefined
  const rigFocus = useMemo(
    () => (focusUnit && focus ? { x: focusUnit.x, z: focusUnit.z, w: focusUnit.w, d: focusUnit.d, startedAt: focus.startedAt } : null),
    [focusUnit, focus]
  )
  return (
    <>
      <Rig focus={rigFocus} />
      {placed.map((p) => (
        <Unit key={p.slug} unit={p} hovered={hovered === p.slug} powered={p.powers && focus?.slug === p.slug ? focus.startedAt : null} />
      ))}
    </>
  )
}

function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.()
  }, [onReady])
  return null
}

/** Dev only: expose the scene as window.__desk for poking at in the console. */
function DevHook() {
  const state = useThree()
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    ;(window as unknown as { __desk?: unknown }).__desk = state
  }, [state])
  return null
}

/* ------------------------------------------------------------------ */


export default function DeskScene({
  units = [],
  hovered = null,
  focus = null,
  onLayout,
  footprint = null,
  onReady,
}: {
  units?: UnitSpec[]
  hovered?: string | null
  focus?: Focus | null
  onLayout?: (rects: UnitRect[]) => void
  /** legacy: a DOM device to cast a shadow for (the cassette hero) */
  footprint?: Footprint | null
  onReady?: () => void
}) {
  // the plant's spot is decided by the layout; null hides it
  const [plant, setPlant] = useState<readonly [number, number, number] | null>(
    units.length ? null : [0.45, 0, -0.235]
  )
  const onPlantSpot = useCallback((p: readonly [number, number, number] | null) => {
    setPlant((prev) => (prev && p && prev[0] === p[0] && prev[2] === p[2]) ? prev : p)
  }, [])

  return (
    <Canvas
      orthographic
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 1.75]}
      camera={{ position: [0, 3, 0], up: [0, 0, -1], zoom: PX_PER_M, near: 0.01, far: 20 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
      style={{ position: "absolute", inset: 0, background: "transparent" }}
      aria-hidden
    >
      <RoomEnv intensity={0.35} />
      {units.length === 0 && <Rig focus={null} />}
      <DevHook />
      <hemisphereLight args={["#f3ead8", "#3a2416", 0.5]} />
      {/* warm key from the top-left, kept gentle */}
      <directionalLight
        position={KEY_DIR}
        intensity={1.6}
        color="#ffe9cf"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.0015}
        shadow-radius={4}
        shadow-camera-near={0.1}
        shadow-camera-far={8}
        shadow-camera-left={-1.2}
        shadow-camera-right={1.2}
        shadow-camera-top={1}
        shadow-camera-bottom={-1}
      />
      <ShadowCatcher />
      <Suspense fallback={null}>
        {units.length > 0 && (
          <Units units={units} hovered={hovered} focus={focus} onLayout={onLayout} onPlantSpot={onPlantSpot} />
        )}
        {plant && <Plant position={plant} />}
        <Ready onReady={onReady} />
      </Suspense>
      <CassetteShadow footprint={footprint} />
    </Canvas>
  )
}

useGLTF.preload(PLANT)
