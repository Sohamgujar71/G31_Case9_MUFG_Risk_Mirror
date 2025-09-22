/*<-*/ "use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Leaf, Sparkles, ArrowRight, ArrowLeft } from "lucide-react"

interface ESGAnswer {
  questionId: string
  answer: string | number
}

interface ESGQuestions {
  environmental: Array<{
    id: string
    question: string
    type: 'select' | 'slider' | 'boolean'
    options?: string[]
    min?: number
    max?: number
    unit?: string
  }>
  social: Array<{
    id: string
    question: string
    type: 'select' | 'slider' | 'boolean'
    options?: string[]
    min?: number
    max?: number
    unit?: string
  }>
  governance: Array<{
    id: string
    question: string
    type: 'select' | 'slider' | 'boolean'
    options?: string[]
    min?: number
    max?: number
    unit?: string
  }>
}

interface ESGScores {
  environmental: number
  social: number
  governance: number
  overall: number
}

const ESGQuestions: ESGQuestions = {
  environmental: [
    {
      id: 'commute_mode',
      question: 'What is your main commute mode?',
      type: 'select',
      options: ['Car', 'Bike/E-bike', 'Public Transport', 'Walk/WFH']
    },
    {
      id: 'commute_distance',
      question: 'How many km do you commute per weekday?',
      type: 'slider',
      min: 0,
      max: 200,
      unit: 'km'
    },
    {
      id: 'esg_investments',
      question: 'What % of your investments are in ESG-labelled funds?',
      type: 'slider',
      min: 0,
      max: 100,
      unit: '%'
    },
    {
      id: 'electricity_tracking',
      question: 'Do you track your home electricity usage?',
      type: 'boolean'
    },
    {
      id: 'recycling',
      question: 'Do you recycle or use reusable items?',
      type: 'select',
      options: ['Often', 'Sometimes', 'Rarely']
    },
    {
      id: 'flight_frequency',
      question: 'How often do you fly per year?',
      type: 'select',
      options: ['Never', '1-2 times', '3-6 times', '7+ times']
    }
  ],
  social: [
    {
      id: 'donation_frequency',
      question: 'How often do you donate or volunteer?',
      type: 'select',
      options: ['Monthly', 'Yearly', 'Rarely', 'Never']
    },
    {
      id: 'diversity_preference',
      question: 'Do you prefer companies with diversity & inclusion policies?',
      type: 'select',
      options: ['Yes', 'Sometimes', 'No']
    },
    {
      id: 'healthcare_checks',
      question: 'How often do you take preventive healthcare checks?',
      type: 'select',
      options: ['Annually', 'Every 2-3 years', 'Rarely', 'Never']
    },
    {
      id: 'wellbeing_rating',
      question: 'Rate your overall wellbeing (sleep/fitness/diet)',
      type: 'slider',
      min: 0,
      max: 10,
      unit: '/10'
    }
  ],
  governance: [
    {
      id: 'terms_reading',
      question: 'Do you read T&Cs before signing financial products?',
      type: 'select',
      options: ['Always', 'Sometimes', 'Never']
    },
    {
      id: 'transparent_governance',
      question: 'Do you invest in companies with transparent governance?',
      type: 'select',
      options: ['Yes', 'Sometimes', 'Not sure']
    },
    {
      id: 'sustainability_reports',
      question: 'Do you prefer financial institutions that publish sustainability reports?',
      type: 'boolean'
    },
    {
      id: 'fee_transparency',
      question: 'How important is fee transparency in financial products?',
      type: 'slider',
      min: 0,
      max: 10,
      unit: '/10'
    }
  ]
}

interface ESGScoreProps {
  onComplete: (scores: ESGScores) => void
  onClose: () => void
}

export default function ESGScore({ onComplete, onClose }: ESGScoreProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<ESGAnswer[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [startScreen, setStartScreen] = useState(true)
  
  const pillars = ['environmental', 'social', 'governance'] as const
  const pillarNames = ['Environmental', 'Social', 'Governance']
  const pillarIcons = ['🌱', '🤝', '⚖️']
  const currentPillar = pillars[currentStep]
  const currentQuestions = ESGQuestions[currentPillar]
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const currentQuestion = currentQuestions[currentQuestionIndex]

  const handleAnswer = (questionId: string, answer: string | number) => {
    const newAnswers = answers.filter(a => a.questionId !== questionId)
    newAnswers.push({ questionId, answer })
    setAnswers(newAnswers)
  }

  const getCurrentAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.answer
  }

  const canProceed = () => {
    return getCurrentAnswer(currentQuestion.id) !== undefined
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentStep < pillars.length - 1) {
      setCurrentStep(currentStep + 1)
      setCurrentQuestionIndex(0)
    } else {
      calculateESGScores()
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setCurrentQuestionIndex(ESGQuestions[pillars[currentStep - 1]].length - 1)
    }
  }

  const calculateESGScores = async () => {
    setIsCalculating(true)
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Calculate scores based on answers
    const scores = computeESGScores(answers)
    
    onComplete(scores)
  }

  const computeESGScores = (answers: ESGAnswer[]): ESGScores => {
    // Environmental scoring
    let eScore = 50 // Base score
    
    answers.forEach(answer => {
      switch (answer.questionId) {
        case 'commute_mode':
          if (answer.answer === 'Walk/WFH') eScore += 20
          else if (answer.answer === 'Public Transport') eScore += 15
          else if (answer.answer === 'Bike/E-bike') eScore += 18
          else eScore -= 10
          break
        case 'commute_distance':
          const distance = answer.answer as number
          if (distance < 10) eScore += 15
          else if (distance < 30) eScore += 5
          else if (distance > 50) eScore -= 15
          break
        case 'esg_investments':
          const esgPercent = answer.answer as number
          eScore += Math.floor(esgPercent / 5) // 0-20 points
          break
        case 'electricity_tracking':
          if (answer.answer === true) eScore += 10
          break
        case 'recycling':
          if (answer.answer === 'Often') eScore += 15
          else if (answer.answer === 'Sometimes') eScore += 8
          break
        case 'flight_frequency':
          if (answer.answer === 'Never') eScore += 15
          else if (answer.answer === '1-2 times') eScore += 5
          else if (answer.answer === '7+ times') eScore -= 20
          break
      }
    })

    // Social scoring
    let sScore = 50
    
    answers.forEach(answer => {
      switch (answer.questionId) {
        case 'donation_frequency':
          if (answer.answer === 'Monthly') sScore += 20
          else if (answer.answer === 'Yearly') sScore += 15
          else if (answer.answer === 'Rarely') sScore += 5
          break
        case 'diversity_preference':
          if (answer.answer === 'Yes') sScore += 15
          else if (answer.answer === 'Sometimes') sScore += 8
          break
        case 'healthcare_checks':
          if (answer.answer === 'Annually') sScore += 15
          else if (answer.answer === 'Every 2-3 years') sScore += 10
          else if (answer.answer === 'Rarely') sScore += 3
          break
        case 'wellbeing_rating':
          const wellbeing = answer.answer as number
          sScore += Math.floor(wellbeing * 2) // 0-20 points
          break
      }
    })

    // Governance scoring
    let gScore = 50
    
    answers.forEach(answer => {
      switch (answer.questionId) {
        case 'terms_reading':
          if (answer.answer === 'Always') gScore += 20
          else if (answer.answer === 'Sometimes') gScore += 10
          break
        case 'transparent_governance':
          if (answer.answer === 'Yes') gScore += 15
          else if (answer.answer === 'Sometimes') gScore += 8
          break
        case 'sustainability_reports':
          if (answer.answer === true) gScore += 10
          break
        case 'fee_transparency':
          const importance = answer.answer as number
          gScore += Math.floor(importance * 1.5) // 0-15 points
          break
      }
    })

    // Normalize scores to 0-100 range
    eScore = Math.max(0, Math.min(100, eScore))
    sScore = Math.max(0, Math.min(100, sScore))
    gScore = Math.max(0, Math.min(100, gScore))

    // Calculate overall ESG score (weighted average)
    const overall = Math.round(0.4 * eScore + 0.3 * sScore + 0.3 * gScore)

    return {
      environmental: eScore,
      social: sScore,
      governance: gScore,
      overall
    }
  }

  const renderQuestionInput = () => {
    const currentAnswer = getCurrentAnswer(currentQuestion.id)

    if (currentQuestion.type === 'select') {
      return (
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options?.map((option, index) => (
            <motion.button
              key={option}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleAnswer(currentQuestion.id, option)}
              className={`p-4 text-left border-2 rounded-xl transition-all duration-300 ${
                currentAnswer === option
                  ? 'bg-gradient-to-r from-slate-700 to-slate-600 border-green-400 shadow-md text-white'
                  : 'bg-slate-800 border-gray-600 hover:border-green-300 hover:bg-slate-700 text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">{option}</span>
                {currentAnswer === option && (
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )
    }

    if (currentQuestion.type === 'boolean') {
      return (
        <div className="grid grid-cols-2 gap-4">
          {['Yes', 'No'].map((option, index) => (
            <motion.button
              key={option}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleAnswer(currentQuestion.id, option === 'Yes')}
              className={`p-6 text-center border-2 rounded-xl transition-all duration-300 ${
                (currentAnswer === true && option === 'Yes') || (currentAnswer === false && option === 'No')
                  ? 'bg-gradient-to-r from-slate-700 to-slate-600 border-green-400 shadow-md text-white'
                  : 'bg-slate-800 border-gray-600 hover:border-green-300 hover:bg-slate-700 text-white'
              }`}
            >
              <div className="text-2xl mb-2">{option === 'Yes' ? '👍' : '👎'}</div>
              <div className="font-medium text-white">{option}</div>
            </motion.button>
          ))}
        </div>
      )
    }

    if (currentQuestion.type === 'slider') {
      const value = (currentAnswer as number) || currentQuestion.min || 0
      
      return (
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-3xl font-bold text-green-600">
              {value}{currentQuestion.unit}
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min={currentQuestion.min}
              max={currentQuestion.max}
              value={value}
              onChange={(e) => handleAnswer(currentQuestion.id, parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${((value - (currentQuestion.min || 0)) / ((currentQuestion.max || 100) - (currentQuestion.min || 0))) * 100}%, #e5e7eb ${((value - (currentQuestion.min || 0)) / ((currentQuestion.max || 100) - (currentQuestion.min || 0))) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>{currentQuestion.min}{currentQuestion.unit}</span>
              <span>{currentQuestion.max}{currentQuestion.unit}</span>
            </div>
          </div>
        </div>
      )
    }
  }

  const totalQuestions = pillars.reduce((sum, pillar) => sum + ESGQuestions[pillar].length, 0)
  const currentQuestionNumber = pillars.slice(0, currentStep).reduce((sum, pillar) => sum + ESGQuestions[pillar].length, 0) + currentQuestionIndex + 1
  const progress = (currentQuestionNumber / totalQuestions) * 100

  if (isCalculating) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
          <CardContent className="p-8 text-center">
            <div className="relative mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mx-auto"
              />
              <Leaf className="w-8 h-8 text-green-600 absolute inset-0 m-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Calculating Your ESG Score...</h3>
            <p className="text-gray-600">Analyzing your sustainability impact</p>
            <div className="mt-4">
              <div className="flex items-center justify-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-green-600 rounded-full"
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
          {startScreen ? (
            <CardContent className="p-10 text-center">
              <div className="mb-4 text-3xl">🌱</div>
              <h3 className="text-2xl font-bold mb-2">Take the ESG Impact Test?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Answer a few quick questions to compute your Environmental, Social, and Governance impact score.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setStartScreen(false)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">Yes, start</Button>
                <Button variant="outline" onClick={onClose}>Skip for now</Button>
              </div>
            </CardContent>
          ) : (
          <>
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="text-2xl">{pillarIcons[currentStep]}</span>
                  {pillarNames[currentStep]} Impact
                </CardTitle>
                <p className="text-sm text-slate-200/90 mt-1">
                  Question {currentQuestionIndex + 1} of {currentQuestions.length} • {currentQuestionNumber} of {totalQuestions} total
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-300 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-slate-200/90 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-6 text-slate-900 dark:text-slate-100">
                {currentQuestion.question}
              </h3>
              
              {renderQuestionInput()}
            </motion.div>

            <div className="flex justify-between mt-8">
              <div className="flex gap-2">
                <Button
                  onClick={prevQuestion}
                  variant="outline"
                  disabled={currentStep === 0 && currentQuestionIndex === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button variant="ghost" onClick={nextQuestion} className="text-slate-500 dark:text-slate-300">Skip</Button>
              </div>
              
              <Button
                onClick={nextQuestion}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
              >
                {currentStep === pillars.length - 1 && currentQuestionIndex === currentQuestions.length - 1 ? 'Calculate Score' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
          </>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

// CSS for custom slider
const styles = `
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
  border: 2px solid white;
}

.slider::-moz-range-thumb {
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style")
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}
/*<-*/