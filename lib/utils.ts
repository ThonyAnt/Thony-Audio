/**
 * cn — minimal classnames joiner (clsx-style, zero deps).
 * Accepts strings, numbers, arrays, and { "class": boolean } maps; drops falsy.
 * Ported components expect this at "@/lib/utils".
 */
type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]
  | Record<string, boolean | null | undefined>

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []
  for (const input of inputs) {
    if (!input) continue
    if (typeof input === "string" || typeof input === "number") {
      out.push(String(input))
    } else if (Array.isArray(input)) {
      const inner = cn(...input)
      if (inner) out.push(inner)
    } else if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) out.push(key)
      }
    }
  }
  return out.join(" ")
}
