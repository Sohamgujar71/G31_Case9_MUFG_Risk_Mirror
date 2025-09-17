// src/components/MiroSuggestions.tsx
"use client"

import React from "react"
import Link from "next/link"
import { Shield, TrendingUp, Plus, Heart, Activity, FileText } from "lucide-react"

type Tip = {
  id: string
  text: string
}

/** Optional icon mapping — keep icons internal so parent only passes strings */
const iconForId = (id: string) => {
  switch (id) {
    case "emergency":
      return Shield
    case "reduce-debt":
      return TrendingUp
    case "credit":
      return Plus
    case "health-lifestyle":
      return Heart
    case "portfolio":
      return Activity
    case "growth":
      return TrendingUp
    default:
      return FileText
  }
}

interface MiroSuggestionsProps {
  tips: Tip[]
  className?: string
  learnMoreHref?: string
}

export default function MiroSuggestions({ tips, className = "", learnMoreHref = "/riskassessment/know-more" }: MiroSuggestionsProps) {
  if (!tips || tips.length === 0) return null

  return (
    <div className={`mt-4 rounded-lg border bg-white/3 p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-white mb-2">How to improve your score</h4>
      <ul className="space-y-2">
        {tips.map((tip) => {
          const Icon = iconForId(tip.id)
          return (
            <li key={tip.id} className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Icon className="h-5 w-5 text-blue-400 mt-0.5" />
              </div>
              <p className="text-xs text-blue-100">{tip.text}</p>
            </li>
          )
        })}
      </ul>

      <div className="mt-3 flex justify-end">
        <Link href={learnMoreHref} className="inline-flex items-center gap-2 text-xs font-medium text-blue-200 hover:underline">
          Learn more
        </Link>
      </div>
    </div>
  )
}
