import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: number
}

export default function Logo({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-blue-500", className)}
    >
      {/* Círculo de fondo */}
      <circle cx="16" cy="16" r="16" className="fill-blue-100" />

      {/* Cursor (click) */}
      <path
        d="M10 8L14.5 19L17 15.5L22 20.5L24 11L10 8Z"
        className="fill-white stroke-blue-500 stroke-[1.5]"
        strokeLinejoin="round"
      />

      {/* Rayo (velocidad) */}
      <path d="M17 15L22 7L19 14.5L24 11L17 22L19.5 15.5L17 15Z" className="fill-current" fillRule="evenodd" />

      {/* Puntos de navegación (smart) */}
      <circle cx="10" cy="8" r="1.5" className="fill-current" />
      <circle cx="24" cy="11" r="1.5" className="fill-current" />
      <circle cx="17" cy="22" r="1.5" className="fill-current" />
    </svg>
  )
}
