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
          <div className="flex gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/riskassessment"
                className="inline-flex items-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200"
              >
                <Shield className="w-4 h-4 mr-2" />
                Get My Risk Score
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/goal-tracker"
                className="inline-flex items-center rounded-xl border border-primary/20 px-6 py-3 text-sm font-medium shadow-sm hover:bg-primary/10 hover:border-primary/40 transition-all duration-200"
              >
                <Target className="w-4 h-4 mr-2" />
                Try Goal Tracker
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
          { icon: Zap, title: "Fast AI Insights", desc: "Transform raw data into clear, actionable signals with AI-powered analysis in seconds." },
          { icon: Target, title: "Goal-Driven Planning", desc: "Create personalized roadmaps with our AI Goal Tracker to achieve your objectives systematically." }
        ].map((feature, i) => (
          <TiltWrapper key={i}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border shadow-md bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-card"
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
        {/* Animated flowing background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-purple-500/3 rounded-3xl -z-10" />
        
        {/* Flowing animated background shapes */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          {/* Large flowing shape 1 */}
          <motion.div
            className="absolute w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-full blur-3xl"
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -80, 60, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: '10%',
              top: '20%',
            }}
          />
          
          {/* Large flowing shape 2 */}
          <motion.div
            className="absolute w-80 h-80 bg-gradient-to-br from-purple-500/8 to-pink-500/4 rounded-full blur-3xl"
            animate={{
              x: [0, -120, 80, 0],
              y: [0, 100, -70, 0],
              scale: [1, 0.7, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: -5,
            }}
            style={{
              right: '15%',
              top: '10%',
            }}
          />
          
          {/* Medium flowing shape 3 */}
          <motion.div
            className="absolute w-64 h-64 bg-gradient-to-br from-green-500/6 to-emerald-500/3 rounded-full blur-2xl"
            animate={{
              x: [0, 60, -90, 0],
              y: [0, -60, 40, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: -10,
            }}
            style={{
              left: '60%',
              bottom: '20%',
            }}
          />
          
          {/* Small flowing shapes */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 bg-gradient-to-br from-primary/4 to-purple-500/2 rounded-full blur-xl"
              animate={{
                x: [0, Math.random() * 100 - 50, Math.random() * -80 + 40, 0],
                y: [0, Math.random() * -60 + 30, Math.random() * 80 - 40, 0],
                scale: [1, Math.random() * 0.5 + 0.8, Math.random() * 0.7 + 0.6, 1],
                opacity: [0.3, 0.6, 0.2, 0.3],
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * -10,
              }}
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
            />
          ))}
        </div>
        
        {/* Floating sparkle particles */}
        <div className="absolute inset-0 overflow-hidden -z-5">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              animate={{
                x: [0, Math.random() * 60 - 30],
                y: [0, Math.random() * 60 - 30],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
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
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: item.delay,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                viewport={{ once: true, amount: 0.2 }}
                onHoverStart={() => setHoveredStep(item.step)}
                onHoverEnd={() => setHoveredStep(null)}
                className="relative group will-change-transform"
              >
                {/* Subtle smooth glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-15 transition-all duration-600 ease-out -z-10`}
                  animate={{
                    scale: hoveredStep === item.step ? 1.05 : 1,
                    opacity: hoveredStep === item.step ? 0.18 : 0,
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                />

                <Card className="rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 group-hover:border-primary/20 overflow-hidden relative bg-card/80 backdrop-blur-sm">
                  {/* Cleaner background pattern */}
                  <div className="absolute inset-0 opacity-3">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_60%)]" />
                  </div>

                  <CardContent className="p-8 space-y-6 text-center relative z-10">
                    {/* Animated Step Number */}
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto shadow-lg ring-1 ring-white/10`}
                      whileHover={{ 
                        scale: 1.08,
                        transition: { 
                          duration: 0.4,
                          ease: [0.25, 0.1, 0.25, 1]
                        }
                      }}
                      animate={{
                        y: hoveredStep === item.step ? -3 : 0,
                      }}
                      transition={{ 
                        duration: 0.4,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                    >
                      <span className="font-bold text-white text-xl drop-shadow-sm">{item.step}</span>
                    </motion.div>

                    {/* Animated Icon */}
                    <motion.div
                      animate={{
                        scale: hoveredStep === item.step ? 1.05 : 1,
                        rotate: hoveredStep === item.step ? 5 : 0,
                      }}
                      transition={{ 
                        duration: 0.4,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      className="flex justify-center"
                    >
                      <item.icon className="h-8 w-8 text-primary drop-shadow-sm" />
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

                    {/* Cleaner Progress Bar */}
                    <motion.div
                      className="w-full h-1 bg-muted/30 rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: item.delay + 0.5 }}
                    >
                      <motion.div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full shadow-sm`}
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ 
                          delay: item.delay + 0.8, 
                          duration: 1.4,
                          ease: [0.25, 0.1, 0.25, 1]
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

      {/* Enhanced Final CTA */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 p-12 text-center"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(56,189,248,0.1),transparent_50%)] opacity-50" />
        
        <div className="relative space-y-6">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Ready to mirror your risks?
            </h2>
          </motion.div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who trust RISK MIRROR for smarter decisions. Start with a risk assessment or explore our AI Goal Tracker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/riskassessment"
                className="inline-flex items-center rounded-xl bg-primary px-8 py-4 text-sm font-medium text-primary-foreground shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200"
              >
                <Shield className="w-5 h-5 mr-2" />
                Start Risk Assessment
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/goal-tracker"
                className="inline-flex items-center rounded-xl border border-primary/30 bg-background/80 px-8 py-4 text-sm font-medium shadow-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
              >
                <Target className="w-5 h-5 mr-2" />
                Try Goal Tracker
              </Link>
            </motion.div>
          </div>
          
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center gap-8 pt-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Real-time Analysis</span>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}