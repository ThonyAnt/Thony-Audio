import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * BentoGrid / BentoCard — feature showcase grid.
 * Ported from Magic UI (MIT). Recolored to cream/terracotta, dark-mode and
 * shadcn/radix deps removed; the CTA arrow is an inline SVG.
 *
 * Usage:
 *   <BentoGrid>
 *     <BentoCard
 *       name="Pitch-track reverb"
 *       className="col-span-3 lg:col-span-2"
 *       description="One IR tunes to follow your MIDI — the tail resonates in key."
 *       href="/plugins/chorale"
 *       cta="Learn more"
 *       Icon={SomeIcon}                 // optional
 *       background={<div className="..." />}  // optional visual
 *     />
 *   </BentoGrid>
 */
interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className?: string
  background?: ReactNode
  Icon?: React.ComponentType<{ className?: string }>
  description: string
  href: string
  cta: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl",
      "bg-surface border border-line transition-colors hover:bg-surface-hover",
      "[box-shadow:0_1px_2px_rgba(36,29,22,0.04),0_12px_24px_rgba(36,29,22,0.05)]",
      className
    )}
    {...props}
  >
    {background ? <div className="absolute inset-0">{background}</div> : null}

    <div className="pointer-events-none relative z-10 mt-auto flex transform-gpu flex-col gap-1 p-6 transition-transform duration-300 group-hover:-translate-y-10">
      {Icon ? (
        <Icon className="mb-2 h-10 w-10 origin-left transform-gpu text-accent transition-transform duration-300 ease-out group-hover:scale-90" />
      ) : null}
      <h3 className="font-display text-2xl leading-tight text-ink">{name}</h3>
      <p className="max-w-lg text-sm leading-relaxed text-muted">{description}</p>
    </div>

    <div className="pointer-events-none absolute bottom-0 z-10 flex w-full translate-y-8 transform-gpu items-center p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
      <a
        href={href}
        className="pointer-events-auto inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
      >
        {cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>

    <div className="pointer-events-none absolute inset-0 transition-colors duration-300 group-hover:bg-ink/[0.02]" />
  </div>
)

export { BentoCard, BentoGrid }
