"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell } from "recharts"

export default function RiskDashboard() {
  const [savings, setSavings] = useState(25000)
  const [spending, setSpending] = useState(20000)
  const [bmi, setBmi] = useState(22)
  const [exercise, setExercise] = useState(4)
  const [sleep, setSleep] = useState(7)
  const [credit, setCredit] = useState(650)
  const [smoking, setSmoking] = useState(2)

  const normalize = {
    // Higher normalized value == higher risk
    savings: (val: number) => 1 - Math.min(val / 50000, 1),
    spending: (val: number) => Math.min(val / 50000, 1),
    bmi: (val: number) => Math.min(1, Math.abs(val - 22) / 15),
    // Exercise ideal is 7 hrs/week: below 7 increases risk, above 7 ~ no risk
    exercise: (val: number) => Math.max(0, 1 - Math.min(val / 7, 1)),
    // Sleep ideal is 8 hrs/night: penalize deviation from 8
    sleep: (val: number) => Math.min(1, Math.abs(val - 8) / 8),
    credit: (val: number) => 1 - Math.min(Math.max((val - 300) / 550, 0), 1),
    smoking: (val: number) => Math.min(val / 20, 1),
  }

  const calculateRisk = () => {
    // Weighted risk (higher = worse)
    const risk =
      100 *
      (0.15 * normalize.savings(savings) +
        0.15 * normalize.spending(spending) +
        0.10 * normalize.credit(credit) +
        0.15 * normalize.bmi(bmi) +
        0.20 * normalize.smoking(smoking) +
        0.10 * normalize.exercise(exercise) +
        0.15 * normalize.sleep(sleep))

    return Math.round(Math.max(0, Math.min(100, risk)))
  }

  const riskScore = calculateRisk()

  const COLORS = ["#ff6b6b", "#2ecc71"] // red for risk, green for safe remainder
  const pieData = [
    { name: "Risk", value: riskScore },
    { name: "Safe", value: 100 - riskScore },
  ]

  const angle = 90 - (riskScore / 100) * 180
  const needleColor = riskScore >= 66 ? "#ff4d4f" : riskScore >= 33 ? "#ffd700" : "#00c853"

  const getAvatarSrc = () => {
    if (riskScore >= 66) return '/red-avatar.png'
    if (riskScore >= 33) return '/blue-avatar.png'
    return '/yellow-avatar.png'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-400">
        Risk Mirror - What-If Simulator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Savings */}
        <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-blue-400">Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              orientation="horizontal"
              value={[savings]}
              min={0}
              max={50000}
              step={1000}
              onValueChange={(val) => setSavings(val[0])}
            />
            <p className="mt-2 text-white">Monthly Savings: ₹{savings}</p>
          </CardContent>
        </Card>

        {/* Spending */}
        <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-red-400">Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              orientation="horizontal"
              value={[spending]}
              min={0}
              max={50000}
              step={1000}
              onValueChange={(val) => setSpending(val[0])}
            />
            <p className="mt-2 text-white">Monthly Spending: ₹{spending}</p>
          </CardContent>
        </Card>

        {/* BMI */}
        <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-green-400">BMI</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              orientation="horizontal"
              value={[bmi]}
              min={15}
              max={40}
              step={1}
              onValueChange={(val) => setBmi(val[0])}
            />
            <p className="mt-2 text-white">BMI: {bmi}</p>
          </CardContent>
        </Card>

        {/* Exercise */}
        <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-yellow-400">Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              orientation="horizontal"
              value={[exercise]}
              min={0}
              max={14}
              step={1}
              onValueChange={(val) => setExercise(val[0])}
            />
            <p className="mt-2 text-white">Exercise: {exercise} hrs/week</p>
          </CardContent>
        </Card>

        {/* Sleep */}
        <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-purple-400">Sleep</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              orientation="horizontal"
              value={[sleep]}
              min={0}
              max={12}
              step={1}
              onValueChange={(val) => setSleep(val[0])}
            />
            <p className="mt-2 text-white">Sleep: {sleep} hrs/night</p>
          </CardContent>
        </Card>

        {/* Credit Score */}
        <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-cyan-400">Credit Score</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              orientation="horizontal"
              value={[credit]}
              min={300}
              max={850}
              step={10}
              onValueChange={(val) => setCredit(val[0])}
            />
            <p className="mt-2 text-white">Credit Score: {credit}</p>
          </CardContent>
        </Card>

        {/* Smoking */}
        <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-pink-400">Smoking/Alcohol</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              orientation="horizontal"
              value={[smoking]}
              min={0}
              max={20}
              step={1}
              onValueChange={(val) => setSmoking(val[0])}
            />
            <p className="mt-2 text-white">Units/Day: {smoking}</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Indicator */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-10 mx-auto max-w-md text-center"
      >
        <Card className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-center rounded-2xl shadow-2xl p-6">
          <CardHeader>
            <CardTitle className="text-white text-xl">Overall Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-[250px] h-[150px] mx-auto">
              <PieChart width={250} height={150}>
                <Pie
                  data={pieData}
                  cx={125}
                  cy={125}
                  innerRadius={60}
                  outerRadius={100}
                  startAngle={180}
                  endAngle={0}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>

              {/* Needle */}
              <div
                className="absolute left-1/2 bottom-0 w-1 h-24 origin-bottom"
                style={{
                  transform: `rotate(${angle}deg)`,
                  backgroundColor: needleColor,
                }}
              />

              {/* Labels */}
              <div className="absolute left-0 bottom-0 text-sm text-red-400">High Risk</div>
              <div className="absolute right-0 bottom-0 text-sm text-green-400">Low Risk</div>
            </div>

            {/* Score Below Gauge */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <motion.div
                key={riskScore}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-yellow-300"
              >
                {riskScore}
              </motion.div>
              <motion.img
                key={`avatar-${riskScore}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                src={getAvatarSrc()}
                alt="Risk level avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>

            <p className="mt-4 text-white">
              {riskScore >= 66
                ? "High Risk - Immediate action required!"
                : riskScore >= 33
                ? "Moderate Risk - Some improvements needed."
                : "Low Risk - You're in a safe zone!"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Math Explanation */}
      <div className="mt-10 p-6 bg-gray-900 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-indigo-300 mb-4">
          How is the Risk Score Calculated?
        </h2>
        <p className="text-white mb-2">
          Each parameter is normalized to a 0–1 risk value where higher means higher risk.
        </p>
        <ul className="list-disc ml-6 text-white space-y-1">
          <li>Savings: <code>1 - savings/50000</code> (less savings  higher risk)</li>
          <li>Spending: <code>spending/50000</code> (more spending  higher risk)</li>
          <li>BMI: <code>|bmi - 22| / 15</code> (farther from 22  higher risk)</li>
          <li>Exercise: <code>1 - min(exercise/7, 1)</code> (less than 7 hrs  higher risk)</li>
          <li>Sleep: <code>|sleep - 8| / 8</code> (farther from 8 hrs  higher risk)</li>
          <li>Credit Score: <code>1 - (credit - 300) / 550</code> (lower credit  higher risk)</li>
          <li>Smoking/Alcohol: <code>smoking/20</code> (more units  higher risk)</li>
        </ul>
        <p className="text-white mt-4">
          The overall risk score (higher = worse) is weighted as:
        </p>
        <pre className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto">{`Risk = 100 * (0.15*Savings + 0.15*Spending + 0.10*Credit + 0.15*BMI +
                0.20*Smoking + 0.10*Exercise + 0.15*Sleep)`}</pre>
      </div>
    </div>
  )
}