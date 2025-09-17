"use client"

import dynamic from "next/dynamic"

const RiskDashboard = dynamic(() => import("./risk_dashboard_ui"), {
  ssr: false,
})

export default function WhatIfSimulatorPage() {
  return <RiskDashboard />
} 