/*<-*/ "use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Leaf, Sparkles, TrendingUp } from "lucide-react"

interface ESGScores {
  environmental: number
  social: number
  governance: number
  overall: number
}

interface ESGWidgetProps {
  scores: ESGScores
  isVisible?: boolean
}


export default function ESGWidget({ scores, isVisible = false }: ESGWidgetProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return "bg-green-100 dark:bg-green-900/30"
    if (score >= 40) return "bg-yellow-100 dark:bg-yellow-900/30"
    return "bg-red-100 dark:bg-red-900/30"
  }

  const getBadgeVariant = (score: number) => {
    if (score >= 70) return "default"
    if (score >= 40) return "secondary"
    return "destructive"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    if (score >= 40) return "Needs Work"
    return "Poor"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full"
    >
      <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-900/10">
        <CardHeader className="border-b border-green-100 dark:border-green-900/20 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 p-4">
          <CardTitle className="text-base font-semibold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
              <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-gray-800 dark:text-gray-200">ESG Impact Score</span>
            <Badge variant={getBadgeVariant(scores.overall)} className="ml-auto text-xs">
              {getScoreLabel(scores.overall)}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Plant Image */}
            <div className="w-full flex items-center justify-center">
              <img src="/plant.svg" alt="Growing plant" className="h-24 object-contain" />
            </div>

            {/* Overall score */}
            <div className="text-center -mt-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`text-3xl font-bold ${getScoreColor(scores.overall)} mb-0`}
              >
                {scores.overall}
              </motion.div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Overall ESG Score</p>
            </div>

            {/* Score Breakdown (compact) */}
            <div className="space-y-3">
              {[
                { label: 'Environmental', value: scores.environmental, icon: '🌍' },
                { label: 'Social', value: scores.social, icon: '🤝' },
                { label: 'Governance', value: scores.governance, icon: '⚖️' }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {item.label}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${getScoreBgColor(item.value)} border-0 font-semibold text-[10px]`}
                    >
                      {item.value}
                    </Badge>
                  </div>
                  <Progress value={item.value} className="h-1.5" />
                </motion.div>
              ))}
            </div>

            {/* Insights (small) */}
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-medium text-green-800 dark:text-green-300">
                  Impact Insights
                </span>
              </div>
              <p className="text-[11px] text-green-700 dark:text-green-400 leading-relaxed">
                {scores.overall >= 80 
                  ? "Excellent sustainability practices! You're making a positive impact."
                  : scores.overall >= 60 
                  ? "Good progress. Consider increasing ESG investments and reducing footprint."
                  : "Focus on sustainable transport, ESG investing, and community engagement."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
/*<-*/