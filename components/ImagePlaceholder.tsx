interface ImagePlaceholderProps {
  label: string
  aspectRatio?: string
  className?: string
}

export default function ImagePlaceholder({
  label,
  aspectRatio = "aspect-[16/9]",
  className = "",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`${aspectRatio} bg-[#edeae4] rounded-2xl flex flex-col items-center justify-center border border-dashed border-[#d8d4ce] ${className}`}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-[#8a837c]/40 mb-3"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-xs tracking-widest uppercase text-[#8a837c]/60">{label}</p>
    </div>
  )
}
