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
    <div>
      <h1>Test Component</h1>
    </div>
  )
}