// components/ui/card.tsx
"use client"

import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className }: CardProps) => (
  
  <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-md">
  {children}
</div>

)

export const CardHeader = ({ children, className }: CardProps) => (
  <div className={`mb-4 ${className}`}>{children}</div>
)

export const CardTitle = ({ children, className }: CardProps) => (
  <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
)

export const CardContent = ({ children, className }: CardProps) => (
  <div className={`mt-2 ${className}`}>{children}</div>
)

// Optional default export for backward compatibility
export default Card
