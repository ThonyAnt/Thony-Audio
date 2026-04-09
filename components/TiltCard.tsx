"use client"

import { useRef } from "react"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"

interface TiltCardProps {
  children: React.ReactNode
  maxRotation?: number
  className?: string
}

export default function TiltCard({ children, maxRotation = 7, className }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [maxRotation, -maxRotation]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-maxRotation, maxRotation]), {
    stiffness: 300,
    damping: 30,
  })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function onMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div style={{ perspective: 900 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`cursor-pointer ${className ?? ""}`}
      >
        {children}
      </motion.div>
    </div>
  )
}
