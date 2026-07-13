/**
 * Price pill — "free" or "$N" in the display serif (matching the site's price typography in the
 * bento and on product pages) on a solid dark chip. Reusable wherever a compact price tag is shown;
 * pass `className` to position it (e.g. as an absolute card corner).
 */
export default function PriceTag({
  price,
  className = "",
}: {
  price: number
  className?: string
}) {
  const label = price === 0 ? "free" : `$${price}`
  return (
    <span
      className={`inline-block rounded-md bg-dark px-2.5 py-1 font-display text-[15px] leading-none text-cream ${className}`}
    >
      {label}
    </span>
  )
}
