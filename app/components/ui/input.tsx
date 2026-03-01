import * as React from "react"

import { cn } from "../../../lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-xl border border-brand-04 bg-transparent px-4 py-3 text-p1 font-sans text-brand-08 transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-brand-05 hover:border-brand-05 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-06 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
