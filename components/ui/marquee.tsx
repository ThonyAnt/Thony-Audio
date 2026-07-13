import { type ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

/**
 * Marquee — infinite horizontal/vertical scroller.
 * Ported from Magic UI (MIT). Requires the marquee keyframes in globals.css.
 *
 * Usage:
 *   <Marquee pauseOnHover className="[--duration:30s]">
 *     {reviews.map((r) => <ReviewCard key={r.id} {...r} />)}
 *   </Marquee>
 */
interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
  /** Reverse the scroll direction. @default false */
  reverse?: boolean
  /** Pause while hovered. @default false */
  pauseOnHover?: boolean
  children: React.ReactNode
  /** Scroll vertically instead of horizontally. @default false */
  vertical?: boolean
  /** How many times to repeat the content for a seamless loop. @default 4 */
  repeat?: number
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around gap-(--gap)", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  )
}
