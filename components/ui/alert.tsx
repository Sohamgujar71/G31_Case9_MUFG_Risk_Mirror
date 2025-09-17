"use client"

import * as React from "react"

interface AlertProps {
  children: React.ReactNode
  className?: string
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-lg border p-4 shadow-sm ${className}`}
      >
        {children}
      </div>
    )
  }
)
Alert.displayName = "Alert"

export const AlertDescription = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={`text-sm text-muted-foreground ${className}`}
      >
        {children}
      </div>
    )
  }
)
AlertDescription.displayName = "AlertDescription"
