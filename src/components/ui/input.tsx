import * as React from "react"
import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

function Input({
  className,
  type,
  icon,
  iconPosition = "right",
  ...props
}: InputProps) {
  const iconIsLeft = icon && iconPosition === "left"
  const iconIsRight = icon && iconPosition === "right"

  return (
    <div className="relative w-full">
      {icon && (
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
            iconIsLeft && "left-3",
            iconIsRight && "right-3"
          )}
        >
          {icon}
        </span>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          iconIsLeft && "pl-9",
          iconIsRight && "pr-9",
          "file:text-foreground placeholder:text-muted-foreground  selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }
