// src/components/MiroMoodWidget.tsx
"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  Shield,
  TrendingUp,
  PiggyBank,
  Sparkles,
  ArrowRight,
  Activity,
  Brain,
  AlertCircle,
} from "lucide-react"
import MiroSuggestions from "@/components/MiroSuggestions"

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>

type MoodType = "calm" | "neutral" | "concerned" | "alert"

type SuggestedAction = {
  type: string
  label: string
  description: string
  icon: IconType
  amount?: number
  percentage?: number
}

interface MiroMoodWidgetProps {
  overallScore: number
  financialCapacity: number
  healthScore: number
  monthlyExpenses: number
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

/** Build a few short improvement tips (id + text) */
function buildImprovementTips(
  overall: number,
  finance: number,
  health: number,
  monthlyExpenses: number,
  mood: MoodType
) {
  const tips: { id: string; text: string }[] = []
  const o = clamp(overall)
  const f = clamp(finance)
  const h = clamp(health)

  // Weakest-first ordering
  const sorted = [
    { id: "finance", value: f },
    { id: "health", value: h },
    { id: "overall", value: o },
  ].sort((a, b) => a.value - b.value)

  // Emergency fund tip when finance or overall is low
  if (f < 60 || o < 50 || mood === "alert") {
    const monthly = Math.max(0, Number(monthlyExpenses || 50000))
    const severity = Math.max(0, Math.min(1, (60 - f) / 60))
    const months = Math.round(1 + severity * 2) // 1..3
    const amount = Math.round(monthly * months)
    tips.push({
      id: "emergency",
      text: `Build an emergency fund of ≈ ₹${amount.toLocaleString()} (~${months} month${months > 1 ? "s" : ""} of your monthly expenses).`,
    })
  }

  // Debt reduction tip
  if (f < 70) {
    tips.push({
      id: "reduce-debt",
      text: "Reduce high-interest debt — target the smallest or highest-rate balances first to lower DTI quickly.",
    })
  }

  // Credit improvement
  if (f < 80) {
    tips.push({
      id: "credit",
      text: "Improve credit score: pay on time, keep utilization <30%, and avoid opening new credit lines.",
    })
  }

  // Health lifestyle
  if (h < 75) {
    tips.push({
      id: "health-lifestyle",
      text: "Small health changes matter: aim for regular exercise, balanced diet, and check blood pressure/BMI monthly.",
    })
  }

  // Portfolio advice
  if (o < 70) {
    tips.push({
      id: "portfolio",
      text: "Consider rebalancing: add some stable assets (bonds/cash) and diversify across sectors to reduce volatility.",
    })
  } else {
    tips.push({
      id: "growth",
      text: "Your profile is healthy — consider raising SIPs gradually (e.g., +5-10%) to accelerate goals.",
    })
  }

  // ensure uniqueness and keep up to 5 tips
  const unique = Array.from(new Map(tips.map((t) => [t.id, t])).values())
  return unique.slice(0, 5)
}

export default function MiroMoodWidget({
  overallScore,
  financialCapacity,
  healthScore,
  monthlyExpenses,
}: MiroMoodWidgetProps) {
  const [currentMood, setCurrentMood] = useState<MoodType>("neutral")
  const [suggestedAction, setSuggestedAction] = useState<SuggestedAction | null>(null)
  const [showActionConfirm, setShowActionConfirm] = useState(false)
  const [pulseAnimation, setPulseAnimation] = useState(false)
  const [improvementTips, setImprovementTips] = useState<{ id: string; text: string }[]>([])
  const prevWeightedRef = useRef<number | null>(null)

  const moods: Record<MoodType, { emoji: string; icon: IconType; color: string; bgColor: string; borderColor: string; description: string }> = {
    calm: { emoji: "😊", icon: Smile, color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-400/30", description: "Your portfolio is well-balanced" },
    neutral: { emoji: "😐", icon: Meh, color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-400/30", description: "Everything looks stable" },
    concerned: { emoji: "😟", icon: Frown, color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-400/30", description: "Minor adjustments recommended" },
    alert: { emoji: "🚨", icon: AlertTriangle, color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-400/30", description: "Immediate action required" },
  }

  useEffect(() => {
    // Compute weighted score (overall 50%, finance 30%, health 20%)
    const wOverall = 0.5
    const wFinance = 0.3
    const wHealth = 0.2

    const o = clamp(Number(overallScore ?? 0))
    const f = clamp(Number(financialCapacity ?? 0))
    const h = clamp(Number(healthScore ?? 0))

    const weighted = Math.round(wOverall * o + wFinance * f + wHealth * h)

    // thresholds + small hysteresis gap
    const TH_ALERT = 40
    const TH_CONCERNED = 60
    const TH_NEUTRAL = 80
    const GAP = 4
    const prev = prevWeightedRef.current

    let mood: MoodType = "neutral"
    if (prev === null) {
      if (weighted < TH_ALERT) mood = "alert"
      else if (weighted < TH_CONCERNED) mood = "concerned"
      else if (weighted < TH_NEUTRAL) mood = "neutral"
      else mood = "calm"
    } else {
      if (weighted < TH_ALERT - GAP) mood = "alert"
      else if (weighted < TH_CONCERNED - GAP) mood = "concerned"
      else if (weighted < TH_NEUTRAL - GAP) mood = "neutral"
      else mood = "calm"
    }
    prevWeightedRef.current = weighted

    // build suggestedAction dynamically
    const monthly = Math.max(0, Number(monthlyExpenses || 50000))
    let action: SuggestedAction | null = null

    if (mood === "alert") {
      const severityRatio = Math.min(1, Math.max(0, (TH_ALERT - weighted) / TH_ALERT))
      const months = Math.round(1 + severityRatio * 2) // 1..3
      const amount = Math.round(monthly * months)
      action = {
        type: "emergency_fund",
        label: `Build ~${months} month${months > 1 ? "s" : ""} emergency fund`,
        description: `Aim for ≈ ₹${amount.toLocaleString()} (≈ ${months}× monthly expenses).`,
        icon: Shield,
        amount,
      }
    } else if (mood === "concerned") {
      action = {
        type: "risk_reduction",
        label: "Reduce Risk Exposure",
        description: "Shift to a more balanced allocation and reduce volatile holdings.",
        icon: TrendingUp,
        percentage: 15,
      }
    } else if (mood === "neutral") {
      action = {
        type: "optimize",
        label: "Optimize Portfolio",
        description: "Review allocation and rebalance if needed.",
        icon: PiggyBank,
      }
    } else {
      action = {
        type: "growth",
        label: "Consider Increasing SIPs",
        description: "You may increase contributions to accelerate growth (e.g., +5-10%).",
        icon: TrendingUp,
        percentage: 10,
      }
    }

    setSuggestedAction(action)
    setCurrentMood((prevM) => (prevM === mood ? prevM : mood))
    setPulseAnimation(mood === "alert")

    // generate improvement tips and set them
    const tips = buildImprovementTips(o, f, h, monthly, mood)
    setImprovementTips(tips)
  }, [overallScore, financialCapacity, healthScore, monthlyExpenses])

  const handleActionClick = () => {
    setShowActionConfirm(true)
    setTimeout(() => setShowActionConfirm(false), 3000)
  }

  const MoodIcon = moods[currentMood].icon
  const ActionIcon = (suggestedAction?.icon ?? Shield) as IconType

  return (
    <div className="space-y-4">
      {/* Main Miro Card */}
      <Card className={`bg-white/6 backdrop-blur-md ${moods[currentMood].borderColor} border-2 transition-all duration-500 ${pulseAnimation ? "animate-pulse" : ""}`}>
        <CardHeader className={`${moods[currentMood].bgColor} pb-3`}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-3 text-white">
              <div className="relative">
                <span className="text-3xl animate-bounce">{moods[currentMood].emoji}</span>
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold">Miro Says</span>
                <p className="text-xs text-blue-200 font-normal">Your AI Risk Assistant</p>
              </div>
            </CardTitle>
            <MoodIcon className={`h-7 w-7 ${moods[currentMood].color}`} />
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <p className={`text-sm font-medium ${moods[currentMood].color} mb-4`}>{moods[currentMood].description}</p>

          {suggestedAction && (
            <Button
              onClick={handleActionClick}
              className={`w-full relative overflow-hidden group ${
                currentMood === "alert"
                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  : currentMood === "concerned"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                  : currentMood === "neutral"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              } text-white transition-all duration-300 transform hover:scale-105 shadow-lg`}
            >
              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <ActionIcon className="mr-2 h-4 w-4 relative z-10" />
              <span className="relative z-10 font-semibold">{suggestedAction.label}</span>
              <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}

          {suggestedAction?.description && (
            <p className="text-xs text-blue-200 mt-3 text-center flex items-center justify-center gap-1">
              <Activity className="h-3 w-3" />
              {suggestedAction.description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation */}
      {showActionConfirm && (
        <Alert className="bg-green-500/10 border-green-400/30 text-white animate-slide-in">
          <AlertCircle className="h-4 w-4 text-green-400" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-200">✅ Action queued for execution</span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Insights */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-blue-200">Safety</span>
          </div>
          <p className="text-lg font-bold text-white">{overallScore > 70 ? "High" : overallScore > 40 ? "Medium" : "Low"}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-xs text-green-200">Growth</span>
          </div>
          <p className="text-lg font-bold text-white">{financialCapacity > 70 ? "Ready" : "Build"}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <Brain className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-purple-200">Action</span>
          </div>
          <p className="text-lg font-bold text-white">{currentMood === "alert" ? "Now" : "Soon"}</p>
        </div>
      </div>

      {/* Improvement Tips (separate component) */}
      <MiroSuggestions tips={improvementTips} learnMoreHref="/riskassessment/know-more" />
    </div>
  )
}
