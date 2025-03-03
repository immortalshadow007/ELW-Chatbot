"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, value, ...props }, ref) => {
    // Ensure value is stable during hydration
    const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => {
      setHydrated(true);
    }, []);

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={hydrated ? (value ?? "") : ""} // Default to empty until hydrated
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
