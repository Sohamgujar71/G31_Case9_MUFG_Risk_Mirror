"use client"

import { ReactNode } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

interface ChartContainerProps {
  children: ReactNode
  className?: string
  config?: Record<string, any>
}

interface ChartTooltipContentProps {
  payload?: any
  label?: string
}

export const ChartContainer = ({
  children,
  className = "",
  config,
}: ChartContainerProps) => {
  return (
    <div className={`rounded-2xl border border-gray-700 bg-gray-900 p-5 shadow-lg ${className}`}>
      {children}
    </div>
  )
}

export const ChartTooltip = (props: any) => <Tooltip {...props} />

export const ChartTooltipContent = ({ payload, label }: ChartTooltipContentProps) => {
  if (!payload || payload.length === 0) {
    return null
  }
  return (
    <div className="bg-gray-800 text-gray-100 p-3 rounded-lg shadow-lg border border-gray-700">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-white">
        Risk: <span className="text-blue-400">{payload[0].value}</span>
      </p>
    </div>
  )
}

const data = [
  { name: "Mon", risk: 32 },
  { name: "Tue", risk: 28 },
  { name: "Wed", risk: 36 },
  { name: "Thu", risk: 31 },
  { name: "Fri", risk: 40 },
  { name: "Sat", risk: 38 },
  { name: "Sun", risk: 42 },
]

export const RiskChart = () => (
  <ChartContainer className="max-w-full">
    <h3 className="mb-4 text-sm font-medium text-gray-300">Weekly Risk Index</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip content={<ChartTooltipContent />} cursor={{ stroke: "#3b82f6", strokeWidth: 2 }} />
          <Line
            type="monotone"
            dataKey="risk"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6, fill: "#2563eb", stroke: "#1e40af", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </ChartContainer>
)

export default RiskChart
