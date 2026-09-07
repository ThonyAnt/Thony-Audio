/**
 * PaperTag — a paper swing tag on a string, slightly cartoonish: heavy ink
 * outline, a hard offset shadow, a punched hole with a reinforcing ring, and
 * the price in the display serif.
 *
 * The viewBox is 160×110. The string is tied at the anchor — (10,10) for a
 * right-hanging tag, (150,10) mirrored for a left-hanging one — so place the
 * svg with that point on whatever the tag hangs from. The body hangs from
 * the hole and swings around it (`.paper-tag-body`, see globals.css); `rot`
 * is the resting angle in degrees, measured the same way for both sides.
 */
export const TAG_VIEW = { w: 160, h: 110, anchor: 10 }

export default function PaperTag({
  label, side = "right", rot = 28, swing = false, className = "", style,
}: {
  label: string
  side?: "left" | "right"
  rot?: number
  swing?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  const left = side === "left"
  // mirror x for the left-hanging tag; the text is drawn upright in either case
  const mx = (x: number) => (left ? TAG_VIEW.w - x : x)
  const hole = { x: mx(36), y: 74 }
  // body outline, with the hole end at x≈16..46 and the far end at 137, in unmirrored coords
  const body = (o: number) => [
    `M${mx(16 + o)} ${74 + o * 1.2}`, `L${mx(38 + o)} ${52 + o * 1.2}`,
    `Q${mx(41 + o)} ${49 + o * 1.2} ${mx(46 + o)} ${49 + o * 1.2}`,
    `L${mx(130 + o)} ${47 + o * 1.2}`, `Q${mx(137 + o)} ${47 + o * 1.2} ${mx(137 + o)} ${54 + o * 1.2}`,
    `L${mx(137 + o)} ${92 + o * 1.2}`, `Q${mx(137 + o)} ${98 + o * 1.2} ${mx(131 + o)} ${98 + o * 1.2}`,
    `L${mx(46 + o)} ${98 + o * 1.2}`, `Q${mx(41 + o)} ${98 + o * 1.2} ${mx(38 + o)} ${95 + o * 1.2}`, "Z",
  ].join(" ")
  const rule = [
    `M${mx(52)} 56`, `L${mx(128)} 54.5`, `Q${mx(131)} 54.5 ${mx(131)} 57.5`,
    `L${mx(131)} 88`, `Q${mx(131)} 91 ${mx(128)} 91`, `L${mx(52)} 91`,
  ].join(" ")
  const string = `M${mx(10)} 10 C ${mx(14)} 34, ${mx(24)} 52, ${hole.x} ${hole.y}`

  return (
    <svg
      viewBox={`0 0 ${TAG_VIEW.w} ${TAG_VIEW.h}`}
      className={`paper-tag ${swing ? "paper-tag--swing" : ""} ${className}`}
      style={{
        ...style,
        ["--tag-rot" as string]: `${left ? -rot : rot}deg`,
        ["--tag-hole" as string]: `${hole.x}px ${hole.y}px`,
      }}
      aria-hidden
      focusable="false"
    >
      {/* the string: tied at the anchor, runs down to the hole */}
      <path d={string} fill="none" stroke="#8a6a3f" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx={mx(10)} cy="10" r="2.6" fill="#8a6a3f" />

      <g className="paper-tag-body">
        {/* hard offset shadow, in the desk's shadow colour, cast toward the bottom-right like the key light */}
        <path d={body(2.2)} fill="rgba(26,14,6,.42)" />
        {/* the paper */}
        <path d={body(0)} fill="#f3e9d3" stroke="#2a1a0c" strokeWidth="2.6" strokeLinejoin="round" />
        {/* printed inner rule */}
        <path d={rule} fill="none" stroke="#2a1a0c" strokeWidth="1" strokeDasharray="3 2.5" opacity=".5" />
        {/* punched hole with its ring */}
        <circle cx={hole.x} cy={hole.y} r="7.5" fill="none" stroke="#2a1a0c" strokeWidth="2" />
        <circle cx={hole.x} cy={hole.y} r="3.4" fill="#b27a48" stroke="#2a1a0c" strokeWidth="1.6" />
        {/* the price */}
        <text
          x={mx(90)} y="83"
          textAnchor="middle"
          fill="#2a1a0c"
          style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 30, letterSpacing: "-0.01em" }}
        >
          {label}
        </text>
      </g>
    </svg>
  )
}
