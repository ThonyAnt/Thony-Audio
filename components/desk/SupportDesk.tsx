"use client"

import { ViewTransition, useEffect, useRef, useState } from "react"
import { Pen } from "@/components/desk/Notepad"

/**
 * SupportDesk — what the support page puts on the desk (design-refs/mockups/
 * support-playground.html, letter from B + stickies from A):
 *
 *   Mail      an airmail envelope with a letter pulled out of it. The letter is
 *             the contact form; "seal & send" slides it into the envelope, the
 *             envelope leaves the desk, and the message opens in your mail app
 *             addressed to hello@thony.audio (no backend yet).
 *   Stickies  the FAQ as a fan of sticky notes: a question on each, click one
 *             and it flips over to the answer.
 *
 * Both sit in a fixed 1180×720 composition that scales down to fit smaller
 * windows, so the arrangement is the same everywhere. Like the account
 * notepad, the objects and the pen are <ViewTransition> boundaries at the
 * page root so the route change slides them in from the right.
 */

const SUPPORT_EMAIL = "hello@thony.audio"

const FAQ = [
  { c: "#fff3a3", x: 20, y: 0, rot: -6, tag: "formats", q: "which formats do i get?", a: "VST3, AU and AAX, mac + windows, in one installer." },
  { c: "#ffd1dc", x: 196, y: 40, rot: 4, tag: "daws", q: "does it work in my DAW?", a: "anything that loads VST3 or AU. tested in ableton, logic, bitwig and reaper." },
  { c: "#c9f0d9", x: 40, y: 200, rot: 2, tag: "license", q: "lost my license key", a: "sign in to your account, it's on the notepad. no account? write us with the email you bought with." },
  { c: "#cfe6ff", x: 214, y: 236, rot: -3, tag: "commercial", q: "can i use it on a paid release?", a: "yes. every plugin is royalty-free for personal and commercial work." },
]

const STAGE = { w: 1180, h: 720 }

export default function SupportDesk() {
  const host = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // fit the composition into whatever room the desk has
  useEffect(() => {
    const el = host.current
    if (!el) return
    const fit = () => {
      const cs = getComputedStyle(el)
      const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const h = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      setScale(Math.min(1, w / STAGE.w, h / STAGE.h))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <>
      <ViewTransition enter="pad-in" exit="pad-out" default="none">
        <div ref={host} className="absolute inset-0 z-[2] grid place-items-center px-4 pt-20 pb-12">
          {/* the fit box takes the scaled size in layout; the composition scales from its corner */}
          <div style={{ width: STAGE.w * scale, height: STAGE.h * scale }}>
            <div className="support-desk" style={{ width: STAGE.w, height: STAGE.h, transform: `scale(${scale.toFixed(3)})` }}>
              <Mail />
              <Stickies />
              {/* the pen, lying between the two */}
              <div className="notepad-pen-slot support-pen" aria-hidden>
                <Pen />
              </div>
            </div>
          </div>
        </div>
      </ViewTransition>
    </>
  )
}

/* ------------------------------------------------------------------ */

function Mail() {
  const [from, setFrom] = useState("")
  const [message, setMessage] = useState("")
  const [state, setState] = useState<"open" | "sealed" | "sent" | "gone">("open")
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (state !== "open") return
    const subject = encodeURIComponent("support")
    const body = encodeURIComponent(`${message}\n\n— ${from}`)
    const href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      window.location.href = href
      return
    }
    // the letter slides into the envelope, the envelope leaves, the mail app opens
    setState("sealed")
    timers.current.push(
      window.setTimeout(() => setState("sent"), 650),
      window.setTimeout(() => { window.location.href = href }, 1100),
      window.setTimeout(() => setState("gone"), 1500),
      window.setTimeout(() => { setState("open"); setMessage("") }, 2600),
    )
  }

  return (
    <form className={`mail is-${state}`} onSubmit={send} aria-label="write to us">
      <div className="mail-env-flap" aria-hidden />
      <div className="mail-env-back" aria-hidden />
      <div className="mail-letter">
        <div className="mail-head"><b>thony audio</b><span>{SUPPORT_EMAIL}</span></div>
        <div className="mail-body">
          <label htmlFor="support-message">dear thony,</label>
          <textarea
            id="support-message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="i installed chorale but logic doesn't see it…"
          />
          <div className="mail-from">
            <label htmlFor="support-from" className="mail-lbl">from</label>
            <input id="support-from" type="email" required value={from} onChange={(e) => setFrom(e.target.value)} placeholder="your@email.com" />
          </div>
          <div className="mail-sign">— thanks!</div>
        </div>
      </div>
      <div className="mail-env-front" aria-hidden><i>par avion<b>thony audio · support</b></i></div>
      <button type="submit" className="desk-circled mail-send" disabled={state !== "open"}>
        seal &amp; send
        <svg viewBox="0 0 120 50" preserveAspectRatio="none" aria-hidden>
          <path d="M58 4 C 90 2, 118 10, 116 25 C 114 42, 82 48, 52 46 C 22 44, 2 36, 5 22 C 8 8, 40 5, 64 5" />
        </svg>
      </button>
      <p className="mail-sent" aria-live="polite">{state === "gone" ? "on its way — your mail app has it." : ""}</p>
    </form>
  )
}

/* ------------------------------------------------------------------ */

function Stickies() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <ul className="stickies" aria-label="common questions">
      {FAQ.map((n, i) => (
        <li key={n.tag} className={`sticky${open === i ? " is-open" : ""}`} style={{ left: n.x, top: n.y, ["--c" as string]: n.c, ["--rot" as string]: `${n.rot}deg` }}>
          <button type="button" className="sticky-inner" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            <span className="sticky-face"><span className="sticky-tag">faq</span>{n.q}</span>
            <span className="sticky-face sticky-back"><b>{n.tag}</b>{n.a}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
