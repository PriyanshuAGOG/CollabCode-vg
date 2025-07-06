import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg border-2 border-charcoal-gray bg-midnight-blue/50 px-4 py-3 text-base text-platinum-white placeholder:text-charcoal-gray/60 transition-all duration-300 focus:border-vibrant-teal focus:bg-midnight-blue/70 focus:shadow-glow focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
