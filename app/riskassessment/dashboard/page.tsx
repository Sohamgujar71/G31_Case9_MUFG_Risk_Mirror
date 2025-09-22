"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Brain, TrendingUp, Clock, Shield, Coins, Download, Leaf } from "lucide-react"
import MiroMoodWidget from "@/components/MiroMoodWidget"
import ESGScore from "@/components/ESGScore"
import ESGWidget from "@/components/ESGWidget"

// Finance Form Interface
interface FinanceFormData {
  Age: number
  Gender: string
  Education_Level: string
  Marital_Status: string
  Income: number
  Credit_Score: number
  Loan_Amount: number
  Loan_Purpose: string
  Employment_Status: string
  Years_at_Current_Job: number
  Payment_History: string
  Debt_to_Income_Ratio: number
  Assets_Value: number
  Number_of_Dependents: number
  Previous_Defaults: number
  Marital_Status_Change: number
}

// Health Form Interface
interface HealthFormData {
  male: number
  age: number
  education: number
  currentSmoker: number
  cigsPerDay: number
  BPMeds: number
  prevalentStroke: number
  prevalentHyp: number
  diabetes: number
  totChol: number
  sysBP: number
  diaBP: number
  BMI: number
  heartRate: number
  glucose: number
}

interface DashboardData {
  financeResult: any
  healthResult: any
  financeForm: FinanceFormData
  healthForm: HealthFormData
  basicDetails?: { /*<-*/
    age: string | number
    gender: string
    education: string
  } /*<-*/
}

interface ScoreData {
  healthScore: number
  financeScore: number
  timeHorizonScore: number
  overallRiskScore: number
  healthClassification: string
  financeClassification: string
  timeHorizonInterpretation: string
  overallRiskInterpretation: string
}

export default function Dashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [scores, setScores] = useState<ScoreData | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<{
    health: string
    finance: string
    timeHorizon: string
    overall: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showESGTest, setShowESGTest] = useState(false)
  const [esgScores, setESGScores] = useState<{
    environmental: number
    social: number
    governance: number
    overall: number
  } | null>(null)
  const [showESGWidget, setShowESGWidget] = useState(false)
  const [esgSkipped, setEsgSkipped] = useState(false)

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("dashboardData")
      if (data) {
        try {
          const parsedData = JSON.parse(data)
          console.log("Dashboard data loaded:", parsedData)
          setDashboardData(parsedData)
          calculateScores(parsedData)
          
          // Restore skip flag for this session (do not persist permanently)
          const skipped = sessionStorage.getItem("esgSkipped") === "true"
          if (skipped) {
            setEsgSkipped(true)
          }

          // Show ESG test popup after dashboard loads
          setTimeout(() => {
            setShowESGTest(true)
          }, 2000)
          
          // Check for existing ESG scores
          const savedESGScores = localStorage.getItem("esgScores")
          if (savedESGScores) {
            try {
              const parsedESGScores = JSON.parse(savedESGScores)
              setESGScores(parsedESGScores)
              // Only show the widget if not skipped in this session
              if (!skipped) {
                setShowESGWidget(true)
              }
            } catch (error) {
              console.error("Error parsing ESG scores:", error)
            }
          }
        } catch (error) {
          console.error("Error parsing dashboard data:", error)
          router.push("/")
        }
      } else {
        console.warn("No dashboard data found in localStorage")
        router.push("/")
      }
    } else {
      // If not in browser, redirect
      router.push("/")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ----------- Financial and Health Risk calculations (copied & preserved) -----------
  const calculateFinancialRiskScore = (financeForm: FinanceFormData) => {
    try {
      if (!financeForm) {
        console.warn("No finance form data available")
        return 0.5
      }

      let riskScore = 0
      let totalWeight = 0

      // Credit Score (25%)
      if (typeof financeForm.Credit_Score === "number" && financeForm.Credit_Score > 0) {
        const creditWeight = 0.25
        let creditRisk = 0
        if (financeForm.Credit_Score >= 750) creditRisk = 0.1
        else if (financeForm.Credit_Score >= 700) creditRisk = 0.2
        else if (financeForm.Credit_Score >= 650) creditRisk = 0.4
        else if (financeForm.Credit_Score >= 600) creditRisk = 0.6
        else creditRisk = 0.8

        riskScore += creditRisk * creditWeight
        totalWeight += creditWeight
      }

      // Debt-to-Income Ratio (20%)
      if (typeof financeForm.Debt_to_Income_Ratio === "number" && financeForm.Debt_to_Income_Ratio >= 0) {
        const dtiWeight = 0.2
        let dtiRisk = 0
        // Treat DTI as a ratio (e.g., 0.25 for 25%), not a percentage. Previously dividing by 100 made it 0.0025. /*<-*/
        const dti = financeForm.Debt_to_Income_Ratio /*<-*/
        if (dti <= 0.2) dtiRisk = 0.1
        else if (dti <= 0.36) dtiRisk = 0.3
        else if (dti <= 0.5) dtiRisk = 0.6
        else dtiRisk = 0.9

        riskScore += dtiRisk * dtiWeight
        totalWeight += dtiWeight
      }

      // Payment History (20%)
      if (financeForm.Payment_History && typeof financeForm.Payment_History === "string") {
        const paymentWeight = 0.2
        let paymentRisk = 0
        const history = financeForm.Payment_History.toLowerCase()
        if (history.includes("excellent") || history.includes("perfect")) paymentRisk = 0.1
        else if (history.includes("good") || history.includes("very good")) paymentRisk = 0.2
        else if (history.includes("average") || history.includes("fair") || history.includes("satisfactory")) paymentRisk = 0.5
        else if (history.includes("poor") || history.includes("bad")) paymentRisk = 0.8
        else paymentRisk = 0.4

        riskScore += paymentRisk * paymentWeight
        totalWeight += paymentWeight
      }

      // Previous Defaults (15%)
      if (typeof financeForm.Previous_Defaults === "number" && financeForm.Previous_Defaults >= 0) {
        const defaultWeight = 0.15
        let defaultRisk = 0
        if (financeForm.Previous_Defaults === 0) defaultRisk = 0.1
        else if (financeForm.Previous_Defaults === 1) defaultRisk = 0.4
        else if (financeForm.Previous_Defaults === 2) defaultRisk = 0.7
        else defaultRisk = 0.9

        riskScore += defaultRisk * defaultWeight
        totalWeight += defaultWeight
      }

      // Employment Status (10%)
      if (financeForm.Employment_Status && typeof financeForm.Employment_Status === "string") {
        const empWeight = 0.1
        let empRisk = 0
        const status = financeForm.Employment_Status.toLowerCase()
        if (status.includes("full-time") || status.includes("permanent") || status.includes("employed")) empRisk = 0.1
        else if (status.includes("part-time")) empRisk = 0.3
        else if (status.includes("contract") || status.includes("freelance") || status.includes("self-employed")) empRisk = 0.5
        else if (status.includes("unemployed") || status.includes("retired")) empRisk = 0.9
        else empRisk = 0.4

        riskScore += empRisk * empWeight
        totalWeight += empWeight
      }

      // Years at Current Job (5%)
      if (typeof financeForm.Years_at_Current_Job === "number" && financeForm.Years_at_Current_Job >= 0) {
        const jobWeight = 0.05
        let jobRisk = 0
        if (financeForm.Years_at_Current_Job >= 5) jobRisk = 0.1
        else if (financeForm.Years_at_Current_Job >= 2) jobRisk = 0.3
        else if (financeForm.Years_at_Current_Job >= 1) jobRisk = 0.5
        else jobRisk = 0.8

        riskScore += jobRisk * jobWeight
        totalWeight += jobWeight
      }

      // Income vs Loan Amount Ratio (5%)
      if (
        typeof financeForm.Income === "number" &&
        typeof financeForm.Loan_Amount === "number" &&
        financeForm.Income > 0 &&
        financeForm.Loan_Amount > 0
      ) {
        const loanWeight = 0.05
        const loanToIncomeRatio = financeForm.Loan_Amount / financeForm.Income
        let loanRisk = 0
        if (loanToIncomeRatio <= 2) loanRisk = 0.1
        else if (loanToIncomeRatio <= 4) loanRisk = 0.3
        else if (loanToIncomeRatio <= 6) loanRisk = 0.6
        else loanRisk = 0.9

        riskScore += loanRisk * loanWeight
        totalWeight += loanWeight
      }

      // Assets Value bonus (reduce risk)
      if (
        typeof financeForm.Assets_Value === "number" &&
        financeForm.Assets_Value > 0 &&
        typeof financeForm.Income === "number" &&
        financeForm.Income > 0
      ) {
        const assetsToIncomeRatio = financeForm.Assets_Value / financeForm.Income
        if (assetsToIncomeRatio > 1) {
          const riskReduction = Math.min(0.1, assetsToIncomeRatio * 0.02)
          riskScore = Math.max(0, riskScore - riskReduction)
        }
      }

      if (totalWeight > 0) {
        riskScore = riskScore / totalWeight
      } else {
        return 0.5
      }

      const finalScore = Math.max(0, Math.min(1, riskScore))
      return finalScore
    } catch (error) {
      console.error("Error in financial risk calculation:", error)
      return 0.5
    }
  }

  const calculateFraminghamRisk = (healthForm: HealthFormData) => {
    try {
      if (!healthForm || typeof healthForm.age !== "number" || typeof healthForm.BMI !== "number" || typeof healthForm.sysBP !== "number") {
        console.warn("Invalid health form data")
        return 0.1
      }

      // Framingham constants (with intercept) and corrected male L_mean for stability /*<-*/
      const coefficients = {
        male: {
          beta0: -29.799,
          betaLnAge: 4.884,
          betaLnBMI: 0.645,
          betaLnSBP_treated: 2.019,
          betaLnSBP_untreated: 1.957,
          betaSmoker: 0.549,
          betaDiabetes: 0.645,
          // Calibrated L_mean for this feature set (baseline: age 50, BMI 26, SBP 125, non-smoker, non-diabetic) /*<-*/
          L_mean: 0.865, /*<-*/
          S0: 0.88431,
        },
        female: {
          beta0: -29.067,
          betaLnAge: 4.276,
          betaLnBMI: 0.302,
          betaLnSBP_treated: 2.469,
          betaLnSBP_untreated: 2.323,
          betaSmoker: 0.691,
          betaDiabetes: 0.874,
          // Calibrated L_mean for female baseline (same baseline as above) /*<-*/
          L_mean: -0.131, /*<-*/
          S0: 0.95012,
        },
      }

      const isMale = healthForm.male === 1
      const coeff = isMale ? coefficients.male : coefficients.female
      const age = Math.max(20, Math.min(100, healthForm.age))
      const BMI = Math.max(15, Math.min(50, healthForm.BMI))
      const sysBP = Math.max(80, Math.min(200, healthForm.sysBP))

      const lnAge = Math.log(age)
      const lnBMI = Math.log(BMI)
      const lnSBP = Math.log(sysBP)
      const betaLnSBP = healthForm.BPMeds === 1 ? coeff.betaLnSBP_treated : coeff.betaLnSBP_untreated

      const currentSmoker = healthForm.currentSmoker === 1 ? 1 : 0
      const diabetes = healthForm.diabetes === 1 ? 1 : 0

      // Apply the formula strictly: L = β0 + βlnAge*ln(age) + βlnBMI*ln(BMI) + βlnSBP*ln(SBP) + βsmoker*smoker + βdiabetes*diabetes /*<-*/
      const L =
        coeff.beta0 +
        coeff.betaLnAge * lnAge +
        coeff.betaLnBMI * lnBMI +
        betaLnSBP * lnSBP +
        coeff.betaSmoker * currentSmoker +
        coeff.betaDiabetes * diabetes

      // Add safety bounds to prevent memory overflow from extreme exp() values /*<-*/
      const exponent = L - coeff.L_mean
      // Clamp exponent to prevent overflow: exp(700) ≈ 10^304, exp(-700) ≈ 0 /*<-*/
      const safeExponent = Math.max(-50, Math.min(50, exponent)) /*<-*/
      const expTerm = Math.exp(safeExponent) /*<-*/
      
      // Additional safety: clamp the power term to prevent S0^(huge number) /*<-*/
      const safePowerTerm = Math.max(0.001, Math.min(1000, expTerm)) /*<-*/
      const p10 = Math.max(0, Math.min(1, 1 - Math.pow(coeff.S0, safePowerTerm))) /*<-*/
      
      const finalResult = isNaN(p10) || !isFinite(p10) ? 0.1 : p10 /*<-*/
      return finalResult
    } catch (error) {
      console.error("Error in Framingham calculation:", error)
      return 0.1
    }
  }

  const calculateScores = async (data: DashboardData) => {
    try {
      let healthScore = 0
      let financeScore = 0
      let healthClassification = "No Data"
      let financeClassification = "No Data"
      let enhancedHealthForm = null /*<-*/

      if (data.healthForm) {
        // Merge basic details with health form for accurate calculation /*<-*/
        enhancedHealthForm = { /*<-*/
          ...data.healthForm, /*<-*/
          age: data.basicDetails?.age ? Number(data.basicDetails.age) : data.healthForm.age, /*<-*/
          male: data.basicDetails?.gender ? (data.basicDetails.gender === "Male" ? 1 : 0) : data.healthForm.male, /*<-*/
          education: data.basicDetails?.education ? Number.parseInt(data.basicDetails.education) : data.healthForm.education /*<-*/
        } /*<-*/
        const p10 = calculateFraminghamRisk(enhancedHealthForm)
        if (!isNaN(p10) && isFinite(p10)) {
          healthScore = Math.round(100 * (1 - p10))
          healthClassification = getHealthClassification(p10)
        }
      } else if (data.healthResult?.probability) {
        const p10 = data.healthResult.probability
        if (!isNaN(p10) && isFinite(p10)) {
          healthScore = Math.round(100 * (1 - p10))
          healthClassification = getHealthClassification(p10)
        }
      }

      let FSI = 0.5
      if (data.financeForm) {
        FSI = calculateFinancialRiskScore(data.financeForm)
        if (!isNaN(FSI) && isFinite(FSI)) {
          financeScore = Math.round(100 * (1 - FSI))
          financeClassification = getFinanceClassification(FSI)
        }
      } else if (data.financeResult?.RiskRating) {
        if (data.financeResult.RiskRating === "Low") FSI = 0.2
        else if (data.financeResult.RiskRating === "Medium") FSI = 0.5
        else if (data.financeResult.RiskRating === "High") FSI = 0.8

        financeScore = Math.round(100 * (1 - FSI))
        financeClassification = getFinanceClassification(FSI)
      } else if (data.financeResult && typeof data.financeResult.FSI === "number") {
        FSI = data.financeResult.FSI
        if (!isNaN(FSI) && isFinite(FSI)) {
          financeScore = Math.round(100 * (1 - FSI))
          financeClassification = getFinanceClassification(FSI)
        }
      }

      const healthRiskProb = data.healthForm ? calculateFraminghamRisk(enhancedHealthForm || data.healthForm) : 0.1 /*<-*/
      const validHealthRisk = isNaN(healthRiskProb) || !isFinite(healthRiskProb) ? 0.1 : healthRiskProb
      const validFinanceRisk = isNaN(FSI) || !isFinite(FSI) ? 0.5 : FSI

      const avgRiskProb = (validHealthRisk + validFinanceRisk) / 2
      const timeHorizonScore = Math.round(100 * (1 - avgRiskProb))
      const timeHorizonInterpretation = getTimeHorizonInterpretation(timeHorizonScore)

      const validHealthScore = isNaN(healthScore) || !isFinite(healthScore) ? 0 : healthScore
      const validFinanceScore = isNaN(financeScore) || !isFinite(financeScore) ? 0 : financeScore
      const validTimeScore = isNaN(timeHorizonScore) || !isFinite(timeHorizonScore) ? 0 : timeHorizonScore

      const overallRiskScore = Math.round(0.4 * validHealthScore + 0.4 * validFinanceScore + 0.2 * validTimeScore)
      const overallRiskInterpretation = getOverallRiskInterpretation(overallRiskScore)

      const calculatedScores = {
        healthScore: validHealthScore,
        financeScore: validFinanceScore,
        timeHorizonScore: validTimeScore,
        overallRiskScore,
        healthClassification,
        financeClassification,
        timeHorizonInterpretation,
        overallRiskInterpretation,
      }

      setScores(calculatedScores)
      // Save calculated scores for AI assistant access /*<-*/
      if (typeof window !== "undefined") { /*<-*/
        localStorage.setItem("dashboardCalculatedScores", JSON.stringify(calculatedScores)) /*<-*/
      } /*<-*/
      await generateAIAnalysis(calculatedScores)
    } catch (error) {
      console.error("Error calculating scores:", error)
      setScores({
        healthScore: 0,
        financeScore: 0,
        timeHorizonScore: 0,
        overallRiskScore: 0,
        healthClassification: "Error",
        financeClassification: "Error",
        timeHorizonInterpretation: "Error",
        overallRiskInterpretation: "Error",
      })
    } finally {
      setLoading(false)
    }
  }

  const getHealthClassification = (p10: number) => {
    if (isNaN(p10) || !isFinite(p10)) return "No Data"
    if (p10 < 0.05) return "Low Risk"
    if (p10 < 0.15) return "Medium Risk"
    return "High Risk"
  }

  const getFinanceClassification = (fsi: number) => {
    if (isNaN(fsi) || !isFinite(fsi)) return "No Data"
    if (fsi < 0.3) return "Low Risk"
    if (fsi < 0.7) return "Medium Risk"
    return "High Risk"
  }

  const getTimeHorizonInterpretation = (score: number) => {
    if (isNaN(score) || !isFinite(score)) return "No Data"
    if (score >= 70) return "Long-term safe"
    if (score >= 40) return "Moderate horizon"
    return "Short horizon"
  }

  const getOverallRiskInterpretation = (score: number) => {
    if (isNaN(score) || !isFinite(score)) return "No Data"
    if (score >= 80) return "Low Risk (Safe)"
    if (score >= 50) return "Medium Risk"
    return "High Risk"
  }

  const generateAIAnalysis = async (scores: ScoreData) => {
    try {
      const analyses = await Promise.all([
        generateSingleAnalysis(`health score of ${scores.healthScore} (classification: ${scores.healthClassification})`),
        generateSingleAnalysis(`finance score of ${scores.financeScore} (classification: ${scores.financeClassification})`),
        generateSingleAnalysis(`time horizon score of ${scores.timeHorizonScore} (${scores.timeHorizonInterpretation})`),
        generateSingleAnalysis(`overall risk score of ${scores.overallRiskScore} (${scores.overallRiskInterpretation})`),
      ])

      setAiAnalysis({
        health: analyses[0],
        finance: analyses[1],
        timeHorizon: analyses[2],
        overall: analyses[3],
      })
    } catch (error) {
      console.error("Error generating AI analysis:", error)
      setAiAnalysis({
        health: "Analysis unavailable",
        finance: "Analysis unavailable",
        timeHorizon: "Analysis unavailable",
        overall: "Analysis unavailable",
      })
    }
  }

  const generateSingleAnalysis = async (scoreDescription: string) => {
    try {
      const response = await fetch("/riskassessment/api/gemini-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Provide a short analysis (1-2 lines) of a ${scoreDescription}. Be concise and actionable.`,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate analysis")
      const data = await response.json()
      return data.analysis || "Analysis unavailable"
    } catch (error) {
      return "Analysis unavailable"
    }
  }

  const getScoreColor = (score: number) => {
    if (isNaN(score) || !isFinite(score)) return "text-gray-500"
    if (score >= 80) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number) => {
    if (isNaN(score) || !isFinite(score)) return "bg-gray-500"
    if (score >= 80) return "bg-green-500"
    if (score >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const generatePDFReport = async () => {
    if (isGeneratingPDF) return

    setIsGeneratingPDF(true)

    try {
      const { default: jsPDF } = await import('jspdf')

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 16
      const now = new Date()
      const dateStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

      // Helper: color by score
      const colorFor = (score: number): [number, number, number] =>
        score >= 80 ? [34, 197, 94] : score >= 50 ? [234, 179, 8] : [239, 68, 68]

      // Header banner
      pdf.setFillColor(79, 70, 229) // indigo-600
      pdf.rect(0, 0, pageWidth, 26, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(14)
      pdf.text('MIRO Risk Snapshot', margin, 16)
      pdf.setFontSize(10)
      pdf.text(dateStr, pageWidth - margin, 16, { align: 'right' })

      // Card background
      const cardX = margin
      const cardY = 34
      const cardW = pageWidth - margin * 2
      const cardH = pageHeight - cardY - 18
      pdf.setFillColor(248, 250, 252) // slate-50
      pdf.rect(cardX, cardY, cardW, cardH, 'F')
      pdf.setDrawColor(226, 232, 240) // slate-200
      pdf.rect(cardX, cardY, cardW, cardH)

      // Overall section
      const overall = scores?.overallRiskScore ?? 0
      const health = scores?.healthScore ?? 0
      const finance = scores?.financeScore ?? 0
      const timeH = scores?.timeHorizonScore ?? 0

      let y = cardY + 12
      pdf.setTextColor(15, 23, 42) // slate-900
      pdf.setFontSize(12)
      pdf.text('Overall Risk Score', cardX + 8, y)

      // Big score
      y += 10
      const overallColor = colorFor(overall)
      pdf.setTextColor(overallColor[0], overallColor[1], overallColor[2])
      pdf.setFontSize(32)
      pdf.text(String(overall), cardX + 8, y)
      pdf.setFontSize(10)
      pdf.setTextColor(100, 116, 139)
      pdf.text('/100', cardX + 8 + 22, y)

      // Overall bar
      const barX = cardX + 60
      const barW = cardW - 68
      const barY = y - 6
      pdf.setFillColor(229, 231, 235) // gray-200
      pdf.rect(barX, barY, barW, 5, 'F')
      const filled = Math.max(0, Math.min(barW, (overall / 100) * barW))
      pdf.setFillColor(overallColor[0], overallColor[1], overallColor[2])
      pdf.rect(barX, barY, filled, 5, 'F')

      // Mini score chips row
      y += 12
      const chipW = (cardW - 8 - 8) / 3
      const chips = [
        { label: 'Health', value: health },
        { label: 'Finance', value: finance },
        { label: 'Time Horizon', value: timeH },
      ]
      chips.forEach((c, i) => {
        const cx = cardX + 8 + i * chipW
        const cy = y
        pdf.setFillColor(255, 255, 255)
        pdf.rect(cx, cy, chipW - 6, 22, 'F')
        pdf.setDrawColor(226, 232, 240)
        pdf.rect(cx, cy, chipW - 6, 22)
        pdf.setTextColor(71, 85, 105)
        pdf.setFontSize(10)
        pdf.text(c.label, cx + 6, cy + 8)
        const cColor = colorFor(c.value)
        pdf.setTextColor(cColor[0], cColor[1], cColor[2])
        pdf.setFontSize(14)
        pdf.text(String(c.value), cx + 6, cy + 18)
        // small bar
        const sbx = cx + 36
        const sbw = chipW - 6 - 42
        pdf.setFillColor(229, 231, 235)
        pdf.rect(sbx, cy + 14, sbw, 3, 'F')
        const sfill = Math.max(0, Math.min(sbw, (c.value / 100) * sbw))
        pdf.setFillColor(cColor[0], cColor[1], cColor[2])
        pdf.rect(sbx, cy + 14, sfill, 3, 'F')
      })

      // Divider
      y += 30
      pdf.setDrawColor(226, 232, 240)
      pdf.line(cardX + 8, y, cardX + cardW - 8, y)

      // General comments (short and positive/neutral tone)
      y += 12
      pdf.setTextColor(15, 23, 42)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(14)
      pdf.text('General Comments', cardX + 8, y)
      pdf.setFont('helvetica', 'normal')
      y += 9
      pdf.setTextColor(71, 85, 105)
      pdf.setFontSize(11)
      const comments = `Your overall profile indicates a ${overall >= 80 ? 'strong' : overall >= 50 ? 'moderate' : 'high'} risk posture. Health and financial scores are summarised above. Focus on steady, incremental improvements rather than drastic changes.`
      pdf.splitTextToSize(comments, cardW - 24).forEach((line: string) => {
        pdf.text(line, cardX + 8, y)
        y += 6
      })

      // Recommendations (hardcoded, concise)
      y += 8
      pdf.setTextColor(15, 23, 42)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(14)
      pdf.text('Recommended Next Steps', cardX + 8, y)
      pdf.setFont('helvetica', 'normal')
      y += 9
      pdf.setTextColor(71, 85, 105)
      pdf.setFontSize(11)
      const recs = [
        'Build a 3–6 month emergency fund and track monthly expenses.',
        'Automate bill payments to protect credit and reduce missed dues.',
        'Target DTI below 36% by prioritizing high-interest debt.',
        'Adopt a simple weekly routine: 150 mins activity + balanced meals.',
        'Schedule a quarterly check-in to review scores and progress.'
      ]
      recs.forEach((r) => {
        const lines = pdf.splitTextToSize(`• ${r}`, cardW - 24)
        lines.forEach((line: string, idx: number) => {
          pdf.text(line, cardX + 8, y)
          y += 6
        })
        y += 2
      })

      // Footer note
      pdf.setFontSize(8)
      pdf.setTextColor(100, 116, 139)
      pdf.text('This 1-page report is a high-level snapshot for personal guidance only.', pageWidth / 2, pageHeight - 8, { align: 'center' })

      pdf.save(`MIRO_Risk_Snapshot_${now.toISOString().slice(0,10)}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF report. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleESGComplete = (scores: { environmental: number; social: number; governance: number; overall: number }) => {
    setESGScores(scores)
    setShowESGTest(false)
    setEsgSkipped(false)
    setShowESGWidget(true)
    
    // Persist choices
    if (typeof window !== "undefined") {
      localStorage.setItem("esgScores", JSON.stringify(scores))
      sessionStorage.setItem("esgSkipped", "false")
    }
  }

  const handleESGClose = () => {
    setShowESGTest(false)
    setShowESGWidget(false)
    setESGScores(null)
    setEsgSkipped(true)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("esgSkipped", "true")
    }
  }

  if (loading || !scores) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Calculating your risk scores...</p>
        </div>
      </div>
    )
  }

  // monthlyExpenses for Miro: prefer finance form Income (monthly) if available, fallback to 50000
  const monthlyExpensesForMiro = dashboardData?.financeForm?.Income ?? 50000

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="grid grid-cols-3 items-center mb-10">
          {/* left: back button */}
          <div className="justify-self-start">
            <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2 hover:bg-white/10 transition-colors duration-200 rounded-lg px-3 py-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Assessment</span>
            </Button>
          </div>

          {/* center: title (perfectly centered) */}
          <div className="justify-self-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Risk Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Your comprehensive risk analysis
            </p>
          </div>

          {/* right: download button */}
          <div className="justify-self-end">
            <Button 
              onClick={generatePDFReport} 
              disabled={isGeneratingPDF}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download Report</span>
                </>
              )}
            </Button>
          </div>
        </div>


        {/* MAIN: left (scores) + right (Miro widget) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Left: Scores (spans 2 columns on large screens) */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 items-stretch">
              {/* Health Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="group">
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-900/10 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-800 dark:text-gray-200">Health Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`text-4xl font-bold ${getScoreColor(scores.healthScore)} tracking-tight`}>
                      {scores.healthScore}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 font-medium text-xs px-2 py-0.5 rounded-md leading-tight whitespace-nowrap shrink-0">
                      {scores.healthClassification}
                    </Badge>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div 
className="h-full bg-green-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${scores.healthScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {aiAnalysis?.health &&
                  !aiAnalysis.health.toLowerCase().includes("unknown") &&
                  !aiAnalysis.health.toLowerCase().includes("unavailable") &&
                  !aiAnalysis.health.toLowerCase().includes("n/a") && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-green-50/50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/20">
                      {aiAnalysis.health}
                    </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

              {/* Finance Score */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="group">
                <Card className="relative overflow-hidden h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/10 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-gray-800 dark:text-gray-200">Financial Score</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className={`text-4xl font-bold ${getScoreColor(scores.financeScore)} tracking-tight`}>
                            {scores.financeScore}
                          </span>
                          <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 font-medium text-xs px-2 py-0.5 rounded-md leading-tight whitespace-nowrap shrink-0">
                            {scores.financeClassification}
                          </Badge>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div 
className="h-full bg-green-600 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${scores.financeScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {aiAnalysis?.finance &&
                        !aiAnalysis.finance.toLowerCase().includes("unknown") &&
                        !aiAnalysis.finance.toLowerCase().includes("unavailable") &&
                        !aiAnalysis.finance.toLowerCase().includes("n/a") && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/20">
                            {aiAnalysis.finance}
                          </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Time Horizon */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="group">
                <Card className="relative overflow-hidden h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/10 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-gray-800 dark:text-gray-200">Time Horizon</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className={`text-4xl font-bold ${getScoreColor(scores.timeHorizonScore)} tracking-tight`}>
                            {scores.timeHorizonScore}
                          </span>
<Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 font-medium text-[10px] px-1.5 py-0.5 rounded-md whitespace-normal break-words text-center leading-tight max-w-[88px]">
                            {scores.timeHorizonInterpretation}
                          </Badge>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div 
className="h-full bg-green-600 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${scores.timeHorizonScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {aiAnalysis?.timeHorizon &&
                        !aiAnalysis.timeHorizon.toLowerCase().includes("unknown") &&
                        !aiAnalysis.timeHorizon.toLowerCase().includes("unavailable") && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-lg border border-purple-100 dark:border-purple-900/20">
                            {aiAnalysis.timeHorizon}
                          </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Overall Risk */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="group">
                <Card className="relative overflow-hidden h-full border-2 border-primary/60 shadow-lg hover:shadow-xl hover:border-primary/80 transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/50 dark:from-gray-800 dark:to-indigo-900/10 hover:-translate-y-1">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                      <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-gray-800 dark:text-gray-200">Overall Risk</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className={`text-4xl font-bold ${getScoreColor(scores.overallRiskScore)} tracking-tight`}>
                            {scores.overallRiskScore}
                          </span>
                          <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 font-medium text-xs px-2 py-0.5 rounded-md leading-tight whitespace-nowrap shrink-0">
                            {scores.overallRiskInterpretation}
                          </Badge>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div 
className="h-full bg-green-600 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${scores.overallRiskScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {aiAnalysis?.overall &&
                        !aiAnalysis.overall.toLowerCase().includes("unknown") &&
                        !aiAnalysis.overall.toLowerCase().includes("unavailable") &&
                        !aiAnalysis.overall.toLowerCase().includes("n/a") && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-indigo-50/50 dark:bg-indigo-900/10 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/20">
                            {aiAnalysis.overall}
                          </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Detailed Information Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Health Details */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Health Score Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Risk Assessment</span>
                        <span className={`text-sm font-bold ${getScoreColor(scores.healthScore)}`}>{scores.healthScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Classification</span>
                        <Badge variant="outline">{scores.healthClassification}</Badge>
                      </div>

                      {dashboardData?.healthForm && (
                        <div className="text-xs text-gray-500 border-t pt-3">
                          <p><strong>Based on:</strong></p>
                          <ul className="mt-1 space-y-1">
                            <li>• Age: {dashboardData.basicDetails?.age || dashboardData.healthForm.age || "N/A"} years</li> {/*<-*/}
                            <li>• Gender: {dashboardData.basicDetails?.gender || (dashboardData.healthForm.male === 1 ? "Male" : "Female") || "N/A"}</li> {/*<-*/}
                            <li>• BMI: {dashboardData.healthForm.BMI}</li>
                            <li>• Blood Pressure: {dashboardData.healthForm.sysBP}/{dashboardData.healthForm.diaBP}</li>
                            <li>• Smoking: {dashboardData.healthForm.currentSmoker ? "Yes" : "No"}</li>
                            <li>• Diabetes: {dashboardData.healthForm.diabetes ? "Yes" : "No"}</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Finance Details */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Financial Score Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Risk Assessment</span>
                        <span className={`text-sm font-bold ${getScoreColor(scores.financeScore)}`}>{scores.financeScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Classification</span>
                        <Badge variant="outline">{scores.financeClassification}</Badge>
                      </div>

                      {dashboardData?.financeForm && (
                        <div className="text-xs text-gray-500 border-t pt-3">
                          <p><strong>Based on:</strong></p>
                          <ul className="mt-1 space-y-1">
                            <li>• Age: {dashboardData.basicDetails?.age || "N/A"} years</li> {/*<-*/}
                            <li>• Gender: {dashboardData.basicDetails?.gender || "N/A"}</li> {/*<-*/}
                            <li>• Credit Score: {dashboardData.financeForm.Credit_Score}</li>
                            <li>• DTI Ratio: {dashboardData.financeForm.Debt_to_Income_Ratio}%</li>
                            <li>• Employment: {dashboardData.financeForm.Employment_Status}</li>
                            <li>• Payment History: {dashboardData.financeForm.Payment_History}</li>
                            <li>• Previous Defaults: {dashboardData.financeForm.Previous_Defaults}</li>
                            <li>• Years at Job: {dashboardData.financeForm.Years_at_Current_Job}</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Risk Factors Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Risk Assessment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(scores.healthScore)}`}>{scores.healthScore}%</div>
                      <p className="text-sm text-gray-600">Health Safety Score</p>
                      <p className="text-xs text-gray-500 mt-1">Based on cardiovascular risk factors</p>
                    </div>

                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(scores.financeScore)}`}>{scores.financeScore}%</div>
                      <p className="text-sm text-gray-600">Financial Stability Score</p>
                      <p className="text-xs text-gray-500 mt-1">Based on creditworthiness and income stability</p>
                    </div>

                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(scores.overallRiskScore)}`}>{scores.overallRiskScore}%</div>
                      <p className="text-sm text-gray-600">Overall Risk Score</p>
                      <p className="text-xs text-gray-500 mt-1">Combined health and financial assessment</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Understanding Your Scores:</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>• <span className="text-green-600 font-medium">80-100:</span> Low risk - Excellent financial and health profile</p>
                      <p>• <span className="text-yellow-600 font-medium">50-79:</span> Medium risk - Some areas need attention</p>
                      <p>• <span className="text-red-600 font-medium">0-49:</span> High risk - Consider immediate improvements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
<div className="text-center space-y-4 mt-10">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={() => router.push("/riskassessment/know-more")} 
                  variant="outline" 
                  size="lg" 
                  className="bg-white/60 dark:bg-white/10 backdrop-blur-sm border-gray-300 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-white/20 transition-all duration-300 rounded-xl px-8 py-3 font-medium shadow-sm hover:shadow-md hover:scale-105"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Learn About Calculations
                </Button>
                <Button 
                  onClick={() => router.push("/riskassessment/dashboard/what-if")} 
                  variant="default" 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 rounded-xl px-8 py-3 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  What-If Simulator
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Miro Widget (sidebar) */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Miro AI Assistant Widget */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <Card className="sticky top-20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-900/10">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20">
                  <CardTitle className="text-lg font-semibold flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl">
                      <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-slate-800 dark:text-slate-200">
                      Miro: AI Risk Assistant
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Pass numeric values to MiroMoodWidget */}
                  <MiroMoodWidget
                    overallScore={scores.overallRiskScore}
                    financialCapacity={scores.financeScore}
                    healthScore={scores.healthScore}
                    monthlyExpenses={monthlyExpensesForMiro}
                  />
                </CardContent>
              </Card>
            </motion.div>
            
            {/* ESG Widget or Prompt to Take Test */}
            {!esgSkipped && esgScores ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: showESGWidget ? 1 : 0, x: showESGWidget ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <ESGWidget scores={esgScores} isVisible={showESGWidget} />
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-900/10">
                  <CardHeader className="border-b border-green-100 dark:border-green-900/20 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 p-4">
                    <CardTitle className="text-base font-semibold flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                        <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-800 dark:text-gray-200">ESG Impact Test</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-6 text-center">
                    <div className="space-y-4">
                      {/* Plant Image */}
                      <div className="w-full flex items-center justify-center">
                        <img src="/plant.svg" alt="Growing plant" className="h-20 object-contain opacity-60" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          Take the ESG Test
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          Discover your Environmental, Social & Governance impact score. It hardly takes a minute!
                        </p>
                      </div>

                      <Button 
                        onClick={() => { setEsgSkipped(false); sessionStorage.setItem("esgSkipped", "false"); setShowESGTest(true) }}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <Leaf className="h-4 w-4 mr-2" />
                        Take Test Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </aside>
        </div>
      </div>
      
      {/* ESG Test Popup */}
      {showESGTest && (
        <ESGScore onComplete={handleESGComplete} onClose={handleESGClose} />
      )}
    </div>
  )
}

