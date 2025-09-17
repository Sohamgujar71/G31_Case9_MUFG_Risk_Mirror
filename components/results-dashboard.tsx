"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts"

interface FormData {
  age: number
  incomeRange: string
  loanAmount: string
  monthlyExpenses: string
  smokes: boolean
  chronicIllness: boolean
  educationLevel: string
  investmentHorizon: string
}

interface ResultsData {
  overall_score: number
  financial_capacity: number
  health_score: number
  time_horizon_score: number
  advice: string
}

interface ResultsDashboardProps {
  formData: FormData
  onStartOver: () => void
}

export function ResultsDashboard({ formData, onStartOver }: ResultsDashboardProps) {
  const [showResults, setShowResults] = useState(false)
  const [results] = useState<ResultsData>({
    overall_score: 72,
    financial_capacity: 80,
    health_score: 65,
    time_horizon_score: 70,
    advice:
      "You have a good financial base, moderate health risks, and a reasonable investment horizon. Consider a balanced to moderately aggressive portfolio.",
  })

  // Simulate loading and fade-in animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResults(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "from-green-500/20 to-green-600/20"
    if (score >= 60) return "from-yellow-500/20 to-yellow-600/20"
    return "from-red-500/20 to-red-600/20"
  }

  const radarData = [
    {
      category: "Financial",
      score: results.financial_capacity,
    },
    {
      category: "Health",
      score: results.health_score,
    },
    {
      category: "Time Horizon",
      score: results.time_horizon_score,
    },
  ]

  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  }

  if (!showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Risk Profile</h2>
          <p className="text-blue-200">Processing your information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Your Risk Analysis</h1>
          <p className="text-blue-200 text-lg">Based on your profile, here are your personalized insights</p>
        </div>

        {/* Overall Score Gauge */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Overall Risk Score</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-8 border-gray-300/20 flex items-center justify-center">
                <div
                  className={`w-40 h-40 rounded-full bg-gradient-to-br ${getScoreBackground(results.overall_score)} flex items-center justify-center border-4 border-white/20`}
                >
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(results.overall_score)}`}>
                      {results.overall_score}
                    </div>
                    <div className="text-sm text-blue-200">out of 100</div>
                  </div>
                </div>
              </div>
              {/* Score indicator arc */}
              <div className="absolute inset-0 w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-300/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${(results.overall_score / 100) * 283} 283`}
                    className={getScoreColor(results.overall_score)}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Financial Capacity
                <span className={`text-2xl font-bold ${getScoreColor(results.financial_capacity)}`}>
                  {results.financial_capacity}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-300/20 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${getScoreBackground(results.financial_capacity).replace("/20", "")}`}
                  style={{ width: `${results.financial_capacity}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-200">Strong financial foundation with good income-to-expense ratio</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Health Score
                <span className={`text-2xl font-bold ${getScoreColor(results.health_score)}`}>
                  {results.health_score}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-300/20 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${getScoreBackground(results.health_score).replace("/20", "")}`}
                  style={{ width: `${results.health_score}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-200">Moderate health risks that may impact long-term planning</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Time Horizon
                <span className={`text-2xl font-bold ${getScoreColor(results.time_horizon_score)}`}>
                  {results.time_horizon_score}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-300/20 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${getScoreBackground(results.time_horizon_score).replace("/20", "")}`}
                  style={{ width: `${results.time_horizon_score}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-200">Good investment timeline allowing for balanced growth strategies</p>
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white mb-8">
          <CardHeader>
            <CardTitle className="text-center">Risk Profile Comparison</CardTitle>
            <CardDescription className="text-center text-blue-200">
              Visual breakdown of your risk factors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
              <RadarChart data={radarData}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <PolarAngleAxis dataKey="category" className="text-white" />
                <PolarGrid className="stroke-white/20" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} tickCount={6} className="text-white/60" />
                <Radar dataKey="score" fill="rgba(59, 130, 246, 0.3)" stroke="rgb(59, 130, 246)" strokeWidth={2} />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* AI Advice */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">AI</span>
              </div>
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-blue-100">{results.advice}</p>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="text-center">
          <Button onClick={onStartOver} size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3">
            Start New Assessment
          </Button>
        </div>
      </div>
    </div>
  )
}
