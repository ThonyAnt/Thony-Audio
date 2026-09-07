"use client"

import { Suspense, useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"

/**
 * DeskScene — what sits on the desk around the cassette (a plant, for now),
 * shot flat-lay from directly above so it shares the cassette's projection.
 *
 * The canvas is transparent: the wood is CSS (components/desk/WoodTable) and
 * the props' shadows fall onto it through a shadow-only catcher plane. One key
 * light from the top-left matches the highlights baked into the cassette art,
 * and an invisible box at the cassette's footprint casts its shadow too, so
 * device and props sit on the same desk under the same light.
 *
 * World is metres, Y up, desk in the XZ plane. The orthographic camera looks
 * straight down with screen-up = -Z and zoom PX_PER_M, so 1 m of desk =
 * PX_PER_M CSS px: DOM px ↔ world m is a plain division.
 *
 * Models: CC0 from Poly Haven (scripts/fetch-desk-assets.mjs).
 */

export const PX_PER_M = 1300

/** CSS px, relative to the canvas centre, y down. */
export type Footprint = { x: number; y: number; w: number; h: number }

const ASSETS = "/assets/desk"
const PLANT = `${ASSETS}/plant/potted_plant_04_1k.gltf`

// Where things sit on the desk (metres from the centre; +x right, +z down-screen).
const LAYOUT = {
  plant: { position: [0.45, 0, -0.235] as const, rotationY: 0.4 }, // top-right corner
}
// Key light from the top-left, like the cassette's own shading.
const KEY_DIR: [number, number, number] = [-1.1, 2.2, -1.3]

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

/** Straight-down orthographic camera with a whisper of parallax on the pointer. */
function Rig() {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 3, 0))
  useFrame((state, dt) => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    const px = reduced ? 0 : state.pointer.x
    const py = reduced ? 0 : state.pointer.y
    target.current.set(px * 0.09, 3, -py * 0.09)
    camera.position.lerp(target.current, 1 - Math.exp(-dt * 3))
    camera.up.set(0, 0, -1)
    camera.lookAt(0, 0, 0)
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
function Plant() {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!g.current) return
    const t = clock.elapsedTime
    g.current.rotation.z = Math.sin(t * 0.6) * 0.012
    g.current.rotation.x = Math.sin(t * 0.43 + 1.3) * 0.009
  })
  return (
    <group ref={g}>
      <Model url={PLANT} position={LAYOUT.plant.position} rotationY={LAYOUT.plant.rotationY} />
    </group>
  )
}

/** Invisible box at the cassette's footprint so the DOM cassette casts a real shadow. */
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
  footprint,
  onReady,
}: {
  footprint: Footprint | null
  onReady?: () => void
}) {
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
      <Rig />
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
        <Plant />
        <Ready onReady={onReady} />
      </Suspense>
      <CassetteShadow footprint={footprint} />
    </Canvas>
  )
}

useGLTF.preload(PLANT)
