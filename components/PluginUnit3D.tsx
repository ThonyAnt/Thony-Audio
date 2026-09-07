"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"
import { REF_W, buildPluginUnit, disposeUnit } from "@/components/desk/pluginUnit"

/**
 * PluginUnit3D — a plugin faceplate as a slowly spinning 3D hardware unit
 * (the cassette hero's screen content). Geometry comes from
 * components/desk/pluginUnit; the whole unit is scaled to Chorale's width
 * (1562) so camera, lights and shadows stay tuned.
 * three r185 notes: PCFShadowMap + shadow.radius (PCFSoft is gone), THREE.Timer.
 */
export default function PluginUnit3D({
  texture, designW, designH, raised = false,
}: { texture: string; designW: number; designH: number; raised?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const W = designW, H = designH
    const NORM = REF_W / W          // unit group scale into chorale-tuned world

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

    let disposed = false
    let loaded: THREE.Texture | null = null
    new THREE.TextureLoader().load(texture, (tex) => {
      if (disposed) { tex.dispose(); return }
      loaded = tex
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
      unit.add(buildPluginUnit({ texture: tex, W, H, raised }))
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
      disposeUnit(scene)
      loaded?.dispose()
      env.texture.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [texture, designW, designH, raised])

  return <div ref={hostRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
}
