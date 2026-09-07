import { ViewTransition } from "react"

/**
 * DeskStage — what the account page puts on the desk: whatever you hand it,
 * centred (the Notepad, or nothing while a member's session resolves), plus a
 * pen lying to one side. The wood and the leaf shadows are the (desk) layout's.
 *
 * Both are <ViewTransition> boundaries at the page's root, so a route change
 * can animate them: in from the right on the way to the account desk, out to
 * the right on the way home ("view transitions" in globals.css). The boundary
 * must be the page's root — React can't see one nested inside an unmounting
 * DOM element.
 */
export function DeskStage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ViewTransition enter="pad-in" exit="pad-out" default="none">
        <div className="absolute inset-0 z-[2] grid place-items-center px-4 pt-20 pb-12">
          {children}
        </div>
      </ViewTransition>
      <ViewTransition enter="pad-in" exit="pad-out" default="none">
        {/* the slot is axis-aligned so the transition slides it straight across the
            screen; the pen is rotated inside it */}
        <div className="notepad-pen-slot" aria-hidden>
          <Pen />
        </div>
      </ViewTransition>
    </>
  )
}

/**
 * Pen — a capped ballpoint in black lacquer, lying on the desk: cap with a
 * gold band and a side clip, barrel, a matte grip section and a conical metal
 * tip. Pure CSS (.pen-* in globals.css); the shadow is a drop-shadow so it
 * follows the taper.
 */
export function Pen() {
  return (
    <div className="pen">
      <div className="pen-cap">
        <i className="pen-clip" />
        <i className="pen-band" />
      </div>
      <div className="pen-barrel" />
      <div className="pen-grip" />
      <div className="pen-tip" />
    </div>
  )
}

/**
 * Notepad — a top-bound spiral memo pad: wire coil through punched holes,
 * the torn stubs of the last page caught under the wire, two more sheets
 * fanned underneath, cream ruled paper with a red margin. Whatever you put
 * inside is written on the top sheet (see .notepad-* in globals.css).
 */
export default function Notepad({ children }: { children: React.ReactNode }) {
  return (
    <div className="notepad">
      <div className="notepad-coil" aria-hidden>
        {Array.from({ length: 15 }, (_, i) => <i key={i} />)}
      </div>
      <div className="notepad-sheet">{children}</div>
    </div>
  )
}
