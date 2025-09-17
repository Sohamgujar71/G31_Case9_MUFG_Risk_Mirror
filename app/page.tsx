"use client"

import Link from "next/link"
import RiskChart from "@/components/ui/chart"
import { Shield, Zap, LineChart, Upload, Brain, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

function TiltWrapper({ children }: { children: React.ReactNode }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5
    setRotate({ x: rotateX, y: rotateY })
  }

  function handleMouseLeave() {
    setRotate({ x: 0, y: 0 })
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  )
}

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Cursor glow state
  useEffect(() => {
    const glow = document.querySelector(".cursor-glow") as HTMLElement
    const move = (e: MouseEvent) => {
      if (glow) {
        glow.style.left = `${e.clientX}px`
        glow.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  return (
    <div className="relative space-y-20 perspective-[1000px]">
      {/* Hero */}
      <section className="relative grid items-center gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-5"
        >
          <h1 className="text-4xl font-bold tracking-tight leading-tight bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            Measure, monitor & explain <span className="text-primary">risk</span> at a glance.
          </h1>
          <p className="text-lg text-muted-foreground">
            RISK MIRROR turns complex signals into simple, actionable insights so you can make faster, smarter decisions.
          </p>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/riskassessment"
                className="rounded-xl bg-primary px-5 py-2 text-sm text-primary-foreground shadow hover:opacity-90"
              >
                Get My Risk Score
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/about"
                className="rounded-xl border px-5 py-2 text-sm shadow-sm hover:bg-muted"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <TiltWrapper>
          <motion.div
            initial={{ opacity: 0, rotateY: 15 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-2xl border p-6 shadow-xl transition-transform"
          >
            <RiskChart />
          </motion.div>
        </TiltWrapper>
      </section>

      {/* Features */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: Shield, title: "Trusted Protection", desc: "Identify potential threats early and prevent costly incidents before they happen." },
          { icon: Zap, title: "Fast Insights", desc: "Transform raw data into clear, actionable signals in seconds." },
          { icon: LineChart, title: "Visual Analytics", desc: "Intuitive charts help you track, compare, and explain risks effortlessly." }
        ].map((feature, i) => (
          <TiltWrapper key={i}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border shadow-md transition-transform hover:shadow-xl hover:-translate-y-2"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
              >
                <feature.icon className="h-6 w-6 text-primary mb-3" />
              </motion.div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          </TiltWrapper>
        ))}
      </section>

      {/* Enhanced How It Works */}
      <section id="how-it-works" className="space-y-16 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 rounded-3xl -z-10" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your data into actionable insights in three simple steps
          </p>
        </motion.div>

        {/* Interactive Step Cards */}
        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Connecting Lines */}
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-30 -translate-y-1/2" />
          
          {[
            { 
              step: 1, 
              title: "Input Data", 
              desc: "Securely upload your data or connect to existing sources with our encrypted API",
              icon: Upload,
              color: "from-blue-500 to-cyan-500",
              delay: 0
            },
            { 
              step: 2, 
              title: "AI Risk Scan", 
              desc: "Our advanced AI algorithms analyze patterns and detect potential threats in real-time",
              icon: Brain,
              color: "from-purple-500 to-pink-500",
              delay: 0.2
            },
            { 
              step: 3, 
              title: "Get Insights", 
              desc: "Receive personalized risk scores with actionable recommendations and visual reports",
              icon: Target,
              color: "from-green-500 to-emerald-500",
              delay: 0.4
            }
          ].map((item, i) => (
            <TiltWrapper key={i}>
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: item.delay,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredStep(item.step)}
                onHoverEnd={() => setHoveredStep(null)}
                className="relative group"
              >
                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}
                  animate={{
                    scale: hoveredStep === item.step ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />

                <Card className="rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 group-hover:border-primary/30 overflow-hidden relative">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
                  </div>

                  <CardContent className="p-8 space-y-6 text-center relative z-10">
                    {/* Animated Step Number */}
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto shadow-lg`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5 }
                      }}
                      animate={{
                        y: hoveredStep === item.step ? -5 : 0,
                      }}
                    >
                      <span className="font-bold text-white text-xl">{item.step}</span>
                    </motion.div>

                    {/* Animated Icon */}
                    <motion.div
                      animate={{
                        scale: hoveredStep === item.step ? 1.1 : 1,
                        rotate: hoveredStep === item.step ? 360 : 0,
                      }}
                      transition={{ 
                        duration: 0.6,
                        rotate: { duration: 0.8 }
                      }}
                      className="flex justify-center"
                    >
                      <item.icon className="h-8 w-8 text-primary" />
                    </motion.div>

                    <motion.div
                      animate={{
                        y: hoveredStep === item.step ? -2 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <h3 className="font-bold text-xl">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </motion.div>

                    {/* Interactive Progress Bar */}
                    <motion.div
                      className="w-full h-1 bg-gray-200 rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: item.delay + 0.5 }}
                    >
                      <motion.div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ 
                          delay: item.delay + 0.8, 
                          duration: 1.2,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TiltWrapper>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center space-y-5"
      >
        <h2 className="text-3xl font-bold">Ready to assess your risk?</h2>
        <p className="text-muted-foreground">
          Get started with a free assessment today and take control of your security.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/riskassessment"
            className="rounded-xl bg-primary px-6 py-3 text-sm text-primary-foreground shadow hover:opacity-90"
          >
            Start Now
          </Link>
        </motion.div>
      </motion.section>
    </div>
  )
}