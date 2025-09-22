"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import Image from "next/image"

// Finance Form Interface
interface FinanceFormData {
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

const educationOptions = [
  { label: "High School", value: "4" },
  { label: "Bachelor's", value: "1" },
  { label: "Master's", value: "2" },
  { label: "PhD", value: "3" },
]

export default function Page() {
  const router = useRouter()
  const [resetKey, setResetKey] = useState(0)
  const [riskScore] = useState(75) // Mock risk score for AI Assist button
  const [subScores] = useState({ financial: 25, health: 30, time: 20 }) // Mock sub-scores

  // Basic Details State
  const [basicDetails, setBasicDetails] = useState({
    age: "",
    gender: "",
    education: "", // education value as string
  })

  // Finance Form State
  const [financeForm, setFinanceForm] = useState<Partial<FinanceFormData>>({
    Marital_Status: "",
    Income: undefined,
    Credit_Score: undefined,
    Loan_Amount: undefined,
    Loan_Purpose: "",
    Employment_Status: "",
    Years_at_Current_Job: undefined,
    Payment_History: "",
    Debt_to_Income_Ratio: undefined,
    Assets_Value: undefined,
    Number_of_Dependents: undefined,
    Previous_Defaults: undefined,
    Marital_Status_Change: undefined,
  })

  // Health Form State
  const [healthForm, setHealthForm] = useState<Partial<HealthFormData>>({
    currentSmoker: undefined,
    cigsPerDay: undefined,
    BPMeds: undefined,
    prevalentStroke: undefined,
    prevalentHyp: undefined,
    diabetes: undefined,
    totChol: undefined,
    sysBP: undefined,
    diaBP: undefined,
    BMI: undefined,
    heartRate: undefined,
    glucose: undefined,
  })

  // Results State
  const [financeResult, setFinanceResult] = useState<any>(null)
  const [healthResult, setHealthResult] = useState<any>(null)
  const [financeError, setFinanceError] = useState<string | null>(null)
  const [healthError, setHealthError] = useState<string | null>(null)
  const [financeLoading, setFinanceLoading] = useState(false)
  const [healthLoading, setHealthLoading] = useState(false)

  // Auto-calculate Debt-to-Income Ratio
  useEffect(() => {
    if (
      financeForm.Loan_Amount !== undefined &&
      financeForm.Income !== undefined &&
      financeForm.Income !== 0
    ) {
      setFinanceForm((prev) => ({
        ...prev,
        Debt_to_Income_Ratio: prev.Loan_Amount! / prev.Income!,
      }))
    }
  }, [financeForm.Loan_Amount, financeForm.Income])

  // Basic Details Handler
  const updateBasicDetails = (field: "age" | "gender" | "education", value: any) => {
    setBasicDetails((prev) => ({ ...prev, [field]: value }))
  }

  // Finance Form Handlers
  const updateFinanceForm = (field: keyof FinanceFormData, value: any) => {
    setFinanceForm((prev) => ({ ...prev, [field]: value }))
  }

  // Health Form Handlers
  const updateHealthForm = (field: keyof HealthFormData, value: any) => {
    setHealthForm((prev) => ({ ...prev, [field]: value }))
  }

  // Finance Submit
  const handleFinanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFinanceLoading(true)
    setFinanceError(null)
    try {
      let maritalStatusChange = 0
      if (financeForm.Marital_Status === "Married") maritalStatusChange = 1
      else if (financeForm.Marital_Status === "Divorced") maritalStatusChange = 2

      const payload = {
        ...financeForm,
        Age: basicDetails.age,
        Gender: basicDetails.gender,
        Education_Level: educationOptions.find(opt => opt.value === basicDetails.education)?.label || "",
        Marital_Status_Change: maritalStatusChange,
      }

      const response = await fetch("http://localhost:8000/finance/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to get finance prediction")
      }
      setFinanceResult(data)
    } catch (err: any) {
      setFinanceError(err.message || "An error occurred")
    } finally {
      setFinanceLoading(false)
    }
  }

  // Health Submit
  const handleHealthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHealthLoading(true)
    setHealthError(null)
    try {
      const payload = {
        ...healthForm,
        age: basicDetails.age,
        male: basicDetails.gender === "Male" ? 1 : 0,
        education: Number.parseInt(basicDetails.education),
      }
      const response = await fetch("http://127.0.0.1:8000/health/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to get health prediction")
      }
      setHealthResult(data)
    } catch (err: any) {
      setHealthError(err.message || "An error occurred")
    } finally {
      setHealthLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-gray-100 pb-16">
      {/* Animated Blobs Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[28rem] h-[28rem] bg-purple-500/30 rounded-full blur-3xl left-[-8rem] top-[-8rem]"
          animate={{ x: [0, 100, -100, 0], y: [0, -50, 50, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 20 }}
        />
        <motion.div
          className="absolute w-[24rem] h-[24rem] bg-blue-400/30 rounded-full blur-3xl top-[18rem] right-[-6rem]"
          animate={{ x: [0, -80, 80, 0], y: [0, 60, -60, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 25 }}
        />
        <motion.div
          className="absolute w-[20rem] h-[20rem] bg-green-400/20 rounded-full blur-3xl bottom-[-8rem] left-[40%]"
          animate={{ x: [0, 60, -60, 0], y: [0, -40, 40, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 30 }}
        />
      </div>

      {/* Mascot Section */}
      <div className="max-w-4xl mx-auto flex flex-col items-center pt-10 pb-6">
        <div className="relative">
          <Image
            src="/mascot-question.png"
            alt="Mascot"
            width={130}
            height={130}
            className="rounded-full shadow-xl border-4 border-purple-400/80 bg-white transition-transform duration-300 hover:scale-105"
            priority
          />
          <div className="absolute -inset-2 bg-purple-400/20 rounded-full blur-lg opacity-50" />
        </div>
        <div className="mt-6 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-purple-300 drop-shadow-lg mb-3 tracking-tight">Welcome to Risk Mirror!</h2>
          <p className="text-lg text-gray-200 leading-relaxed px-4">
            Fill out your details below and let our Miro guide you through your risk assessment journey.
          </p>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto py-8 space-y-8">
        {/* Basic Details */}
        <Card className="shadow-2xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-gray-100 relative z-10 mb-8 transition-all duration-300 hover:shadow-3xl hover:bg-white/[0.12]">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full" />
              Basic Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-200">Age *</Label>
                <Input
                  type="number"
                  value={basicDetails.age}
                  onChange={(e) =>
                    updateBasicDetails(
                      "age",
                      e.target.value === "" ? undefined : Number.parseInt(e.target.value)
                    )
                  }
                  required
                  className="bg-gray-900/60 border-gray-600 text-gray-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-colors"
                  placeholder="Enter your age"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-200">Gender *</Label>
                <Select
                  value={basicDetails.gender}
                  onValueChange={(value) => updateBasicDetails("gender", value)}
                >
                  <SelectTrigger className="bg-gray-900/60 border-gray-600 text-gray-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-colors">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-200">Education *</Label>
                <Select
                  value={basicDetails.education}
                  onValueChange={(value) => updateBasicDetails("education", value)}
                >
                  <SelectTrigger className="bg-gray-900/60 border-gray-600 text-gray-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-colors">
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Finance Risk Form */}
          <Card className="shadow-xl rounded-2xl bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-blue-800/30 backdrop-blur-md border border-purple-400/40 text-gray-100 relative z-10 transition-all duration-300 hover:shadow-2xl hover:border-purple-400/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-blue-600 bg-clip-text text-transparent tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-blue-600 rounded-full" />
                Finance Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFinanceSubmit} className="space-y-5">
                {/* Marital Status */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-200">Marital Status *</Label>
                  <Select
                    value={financeForm.Marital_Status}
                    onValueChange={(value) => updateFinanceForm("Marital_Status", value)}
                  >
                    <SelectTrigger className="bg-gray-900/60 border-gray-600 text-gray-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-colors">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Income and Loan Amount */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-200">Income (₹) *</Label>
                    <Input
                      type="number"
                      value={financeForm.Income !== undefined ? financeForm.Income : ""}
                      onChange={(e) =>
                        updateFinanceForm(
                          "Income",
                          e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                        )
                      }
                      required
                      className="bg-gray-900/60 border-gray-600 text-gray-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-200">Loan Amount (₹) *</Label>
                    <Input
                      type="number"
                      value={financeForm.Loan_Amount !== undefined ? financeForm.Loan_Amount : ""}
                      onChange={(e) =>
                        updateFinanceForm(
                          "Loan_Amount",
                          e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                        )
                      }
                      required
                      className="bg-gray-900/60 border-gray-600 text-gray-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-colors"
                    />
                  </div>
                </div>

                {/* Debt to Income Ratio (Read-only) */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-200">Debt-to-Income Ratio (Auto-calculated)</Label>
                  <Input
                    type="number"
                    value={
                      financeForm.Debt_to_Income_Ratio !== undefined
                        ? financeForm.Debt_to_Income_Ratio.toFixed(4)
                        : "0"
                    }
                    readOnly
                    className="bg-gray-800/80 border-gray-600 text-gray-300 cursor-not-allowed"
                  />
                </div>

                {/* Credit Score */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-200">Credit Score *</Label>
                  <Input
                    type="number"
                    value={financeForm.Credit_Score !== undefined ? financeForm.Credit_Score : ""}
                    onChange={(e) =>
                      updateFinanceForm(
                        "Credit_Score",
                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                      )
                    }
                    required
                    className="bg-gray-900/60 border-gray-600 text-gray-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-colors"
                    placeholder="e.g., 720"
                  />
                </div>

                {/* Loan Purpose */}
                <div className="space-y-2">
                  <Label>Loan Purpose *</Label>
                  <Select
                    value={financeForm.Loan_Purpose}
                    onValueChange={(value) => updateFinanceForm("Loan_Purpose", value)}
                  >
                    <SelectTrigger className="bg-gray-900/60 border-gray-700 text-gray-100">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Auto">Auto</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Employment Status */}
                <div className="space-y-2">
                  <Label>Employment Status *</Label>
                  <Select
                    value={financeForm.Employment_Status}
                    onValueChange={(value) => updateFinanceForm("Employment_Status", value)}
                  >
                    <SelectTrigger className="bg-gray-900/60 border-gray-700 text-gray-100">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Employed">Employed</SelectItem>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                      <SelectItem value="Self-employed">Self-employed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Years at Current Job */}
                <div className="space-y-2">
                  <Label>Years at Current Job *</Label>
                  <Input
                    type="number"
                    value={
                      financeForm.Years_at_Current_Job !== undefined
                        ? financeForm.Years_at_Current_Job
                        : ""
                    }
                    onChange={(e) =>
                      updateFinanceForm(
                        "Years_at_Current_Job",
                        e.target.value === "" ? undefined : Number.parseInt(e.target.value)
                      )
                    }
                    required
                    className="bg-gray-900/60 border-gray-700 text-gray-100"
                  />
                </div>

                {/* Payment History */}
                <div className="space-y-2">
                  <Label>Payment History *</Label>
                  <Select
                    value={financeForm.Payment_History}
                    onValueChange={(value) => updateFinanceForm("Payment_History", value)}
                  >
                    <SelectTrigger className="bg-gray-900/60 border-gray-700 text-gray-100">
                      <SelectValue placeholder="Select history" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Poor">Poor</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Assets Value */}
                <div className="space-y-2">
                  <Label>Assets Value (₹) *</Label>
                  <Input
                    type="number"
                    value={financeForm.Assets_Value !== undefined ? financeForm.Assets_Value : ""}
                    onChange={(e) =>
                      updateFinanceForm(
                        "Assets_Value",
                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                      )
                    }
                    required
                    className="bg-gray-900/60 border-gray-700 text-gray-100"
                  />
                </div>

                {/* Number of Dependents */}
                <div className="space-y-2">
                  <Label>Number of Dependents *</Label>
                  <Input
                    type="number"
                    value={
                      financeForm.Number_of_Dependents !== undefined
                        ? financeForm.Number_of_Dependents
                        : ""
                    }
                    onChange={(e) =>
                      updateFinanceForm(
                        "Number_of_Dependents",
                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                      )
                    }
                    required
                    className="bg-gray-900/60 border-gray-700 text-gray-100"
                  />
                </div>

                {/* Previous Defaults */}
                <div className="space-y-2">
                  <Label>Previous Defaults *</Label>
                  <Input
                    type="number"
                    value={
                      financeForm.Previous_Defaults !== undefined
                        ? financeForm.Previous_Defaults
                        : ""
                    }
                    onChange={(e) =>
                      updateFinanceForm(
                        "Previous_Defaults",
                        e.target.value === "" ? undefined : Number.parseInt(e.target.value)
                      )
                    }
                    required
                    className="bg-gray-900/60 border-gray-700 text-gray-100"
                  />
                </div>

                {financeError && (
                  <p className="text-red-400 text-sm">{financeError}</p>
                )}

                <motion.div whileHover={{ scale: 1.02 }} className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300" 
                    disabled={financeLoading}
                  >
                    {financeLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </div>
                    ) : (
                      "Submit Finance Assessment"
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Finance Results */}
              {financeResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-5 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl border border-blue-400/40 backdrop-blur-sm shadow-lg"
                >
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    Finance Risk Rating
                  </h3>
                  <div className="text-sm space-y-2">
                    <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                      <span className="text-gray-300">Risk Rating:</span>
                      <span className="font-semibold text-blue-300">{financeResult["Risk Rating"]}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Health Risk Form */}
          <Card className="shadow-xl rounded-2xl bg-gradient-to-br from-green-900/30 via-teal-900/30 to-blue-800/30 backdrop-blur-md border border-green-400/40 text-gray-100 relative z-10 transition-all duration-300 hover:shadow-2xl hover:border-green-400/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 bg-clip-text text-transparent tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-teal-400 rounded-full" />
                Health Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleHealthSubmit} className="space-y-5">
                {/* Current Smoker */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-200">Current Smoker *</Label>
                  <Select
                    value={
                      healthForm.currentSmoker !== undefined
                        ? healthForm.currentSmoker.toString()
                        : ""
                    }
                    onValueChange={(value) => updateHealthForm("currentSmoker", Number.parseInt(value))}
                  >
                    <SelectTrigger className="bg-gray-900/60 border-gray-600 text-gray-100 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-colors">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Yes</SelectItem>
                      <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Cigarettes Per Day */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-200">Cigarettes Per Day *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={healthForm.cigsPerDay !== undefined ? healthForm.cigsPerDay : ""}
                    onChange={(e) =>
                      updateHealthForm(
                        "cigsPerDay",
                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                      )
                    }
                    required
                    className="bg-gray-900/60 border-gray-600 text-gray-100 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-colors"
                    placeholder="e.g., 0"
                  />
                </div>

                {/* Blood Pressure Medicines */}
                <div className="space-y-2">
                  <Label>Blood Pressure Medicines *</Label>
                  <Select
                    value={healthForm.BPMeds !== undefined ? healthForm.BPMeds.toString() : ""}
                    onValueChange={(value) => updateHealthForm("BPMeds", Number.parseInt(value))}
                  >
                    <SelectTrigger className="bg-gray-900/60 border-gray-700 text-gray-100">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Yes</SelectItem>
                      <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Prevalent Stroke */}
                <div className="space-y-2">
                  <Label>Prevalent Stroke *</Label>
                  <Select
                    value={
                      healthForm.prevalentStroke !== undefined
                        ? healthForm.prevalentStroke.toString()
                        : ""
                    }
                    onValueChange={(value) =>
                      updateHealthForm("prevalentStroke", Number.parseInt(value))
                    }
                  >
                    <SelectTrigger className="bg-gray-900/60 border-gray-700 text-gray-100">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Yes</SelectItem>
                      <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Prevalent Hypertension */}
                <div className="space-y-2">
                  <Label>Prevalent Hypertension *</Label>
                  <Select
                    value={
                      healthForm.prevalentHyp !== undefined
                        ? healthForm.prevalentHyp.toString()
                        : ""
                    }
                    onValueChange={(value) =>
                      updateHealthForm("prevalentHyp", Number.parseInt(value))
                    }
                  >
                    <SelectTrigger className="bg-gray-900/60 border-gray-700 text-gray-100">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Yes</SelectItem>
                      <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Diabetes */}
                <div className="space-y-2">
                  <Label>Diabetes *</Label>
                  <Select
                    value={healthForm.diabetes !== undefined ? healthForm.diabetes.toString() : ""}
                    onValueChange={(value) => updateHealthForm("diabetes", Number.parseInt(value))
                    }
                  >
                    <SelectTrigger className="bg-gray-900/60 border-gray-700 text-gray-100">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Yes</SelectItem>
                      <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Total Cholesterol */}
                <div className="space-y-2">
                  <Label>Total Cholesterol *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={healthForm.totChol !== undefined ? healthForm.totChol : ""}
                    onChange={(e) =>
                      updateHealthForm(
                        "totChol",
                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                      )
                    }
                    required
                    className="bg-gray-900/60 border-gray-700 text-gray-100"
                  />
                </div>

                {/* Systolic BP */}
                <div className="space-y-2">
                  <Label>Systolic Blood Pressure *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={healthForm.sysBP !== undefined ? healthForm.sysBP : ""}
                    onChange={(e) =>
                      updateHealthForm(
                        "sysBP",
                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                      )
                    }
                    required
                    className="bg-gray-900/60 border-gray-700 text-gray-100"
                  />
                </div>

                {/* Diastolic BP */}
                <div className="space-y-2">
                  <Label>Diastolic Blood Pressure *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={healthForm.diaBP !== undefined ? healthForm.diaBP : ""}
                    onChange={(e) =>
                      updateHealthForm(
                        "diaBP",
                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                      )
                    }
                    required
                    className="bg-gray-900/60 border-gray-700 text-gray-100"
                  />
                </div>

                {/* BMI */}
                <div className="space-y-2">
                  <Label>BMI *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={healthForm.BMI !== undefined ? healthForm.BMI : ""}
                    onChange={(e) =>
                      updateHealthForm(
                        "BMI",
                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                      )
                    }
                    required
                    className="bg-gray-900/60 border-gray-700 text-gray-100"
                  />
                </div>

                {/* Heart Rate */}
                <div className="space-y-2">
                  <Label>Heart Rate *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={healthForm.heartRate !== undefined ? healthForm.heartRate : ""}
                    onChange={(e) =>
                      updateHealthForm(
                        "heartRate",
                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                      )
                    }
                    required
                    className="bg-gray-900/60 border-gray-700 text-gray-100"
                  />
                </div>

                {/* Glucose */}
                <div className="space-y-2">
                  <Label>Glucose *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={healthForm.glucose !== undefined ? healthForm.glucose : ""}
                    onChange={(e) =>
                      updateHealthForm(
                        "glucose",
                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                      )
                    }
                    required
                    className="bg-gray-900/60 border-gray-700 text-gray-100"
                  />
                </div>

                {healthError && (
                  <p className="text-red-400 text-sm">{healthError}</p>
                )}

                <motion.div whileHover={{ scale: 1.02 }} className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300" 
                    disabled={healthLoading}
                  >
                    {healthLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </div>
                    ) : (
                      "Submit Health Assessment"
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Health Results */}
              {healthResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-5 bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl border border-green-400/40 backdrop-blur-sm shadow-lg"
                >
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Health Prediction Result
                  </h3>
                  <div className="text-sm space-y-2">
                    <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                      <span className="text-gray-300">Ten Year CHD:</span>
                      <span className="font-semibold text-green-300">{healthResult.TenYearCHD}</span>
                    </div>
                    <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                      <span className="text-gray-300">Probability:</span>
                      <span className="font-semibold text-green-300">{healthResult.probability}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {/* New Fill Data Manually Button */}
    <Button variant="secondary" className="flex-1 max-w-xs bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg font-medium py-3 transition-all duration-300 hover:scale-105"
      onClick={() => {
        // Fill sample data into the forms
        setFinanceForm({
          Marital_Status: "Single",
          Income: 60000,
          Credit_Score: 720,
          Loan_Amount: 15000,
          Loan_Purpose: "Auto",
          Employment_Status: "Employed",
          Years_at_Current_Job: 3,
          Payment_History: "Good",
          Debt_to_Income_Ratio: 15000 / 60000,
          Assets_Value: 50000,
          Number_of_Dependents: 1,
          Previous_Defaults: 0,
          Marital_Status_Change: 0,
        });

        setHealthForm({
          currentSmoker: 0,
          cigsPerDay: 0,
          BPMeds: 0,
          prevalentStroke: 0,
          prevalentHyp: 0,
          diabetes: 0,
          totChol: 180,
          sysBP: 120,
          diaBP: 80,
          BMI: 24.5,
          heartRate: 70,
          glucose: 90,
        });

        setBasicDetails({
          age: "35",
          gender: "Male",
          education: "1", // Bachelor's
        });
      }}
    >
      Fill Data Manually
    </Button>
          <Button
            variant="outline"
            className="flex-1 max-w-xs bg-transparent border-2 border-gray-600 text-gray-100 hover:bg-gray-700/30 shadow-lg font-medium py-3 transition-all duration-300 hover:scale-105"
            onClick={() => setResetKey((prev) => prev + 1)}
          >
            Reset Cards
          </Button>

          <Button
            variant="default"
            className="flex-1 max-w-xs bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg font-medium py-3 transition-all duration-300 hover:scale-105"
            onClick={() => {
              const url = `/ai-assistant?riskScore=${riskScore}&financial=${subScores.financial}&health=${subScores.health}&time=${subScores.time}`
              router.push(url)
            }}
          >
            AI Assist
          </Button>

          <Button
            variant="default"
            className="flex-1 max-w-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg font-medium py-3 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={() => {
              const dashboardData = {
                financeResult: financeResult,
                healthResult: healthResult,
                financeForm: financeForm,
                healthForm: healthForm,
                basicDetails: basicDetails, /*<-*/
              }
              localStorage.setItem("dashboardData", JSON.stringify(dashboardData))
              router.push("/riskassessment/dashboard")
            }}
            disabled={!financeResult && !healthResult}
          >
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}