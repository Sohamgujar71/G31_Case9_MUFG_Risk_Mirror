"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AboutPage() {
  // Cursor glow effect
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-gray-900 dark:text-gray-100 p-8 flex flex-col items-center overflow-hidden">
      {/* Cursor Glow */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-[300px] h-[300px] rounded-full bg-blue-500/30 blur-3xl"
        style={{
          transform: `translate(${cursor.x - 150}px, ${cursor.y - 150}px)`,
        }}
      />

      {/* Floating Background Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-30 blur-2xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-30 blur-2xl"
        animate={{ y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-text-shimmer"
      >
        About RISK MIRROR
      </motion.h1>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl mb-10 rounded-2xl border border-border bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 p-6 md:p-10 shadow-xl"
      >
        <div className="grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold">Your AI copilot for risk-free growth</h2>
            <p className="text-muted-foreground leading-relaxed">
              RISK MIRROR combines predictive analytics, behavior insights, and conversational AI to help you understand, plan, and act with confidence—across finance, health, and lifestyle.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              {['AI Insights','Personalized Plans','Real‑time Tracking','Privacy‑first'].map((chip, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs md:text-sm bg-muted border border-border">{chip}</span>
              ))}
            </div>
          </div>
          <div className="flex md:justify-end">
            <div className="rounded-xl border border-border bg-card p-4 w-full md:w-[260px]">
              <div className="text-sm text-muted-foreground mb-2">Live Snapshot</div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-background/60 border border-border p-3">
                  <div className="text-xl font-bold">92%</div>
                  <div className="text-xs text-muted-foreground">User Satisfaction</div>
                </div>
                <div className="rounded-lg bg-background/60 border border-border p-3">
                  <div className="text-xl font-bold">120k+</div>
                  <div className="text-xs text-muted-foreground">Decisions Assisted</div>
                </div>
                <div className="rounded-lg bg-background/60 border border-border p-3 col-span-2">
                  <div className="text-xl font-bold"><span className="text-blue-500">Zero</span> PII Stored</div>
                  <div className="text-xs text-muted-foreground">Privacy by design</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Description Section */}
      <motion.div
        className="w-full max-w-6xl grid md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="md:col-span-2 space-y-4">
          <p className="text-lg text-muted-foreground">
            RISK MIRROR is your unified layer for risk intelligence—merging data, context, and human feedback into clear guidance. Built for clarity, speed, and trust.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {title:'Clarity, not clutter', desc:'We translate complex signals into simple decisions with measurable outcomes.'},
              {title:'Personal by default', desc:'Every insight adapts to your goals, constraints, and behavior—no generic templates.'},
              {title:'Explainable AI', desc:'Transparent reasoning with rationale and sources where applicable.'},
              {title:'Secure & private', desc:'We keep sensitive data on-device or encrypted—no unnecessary retention.'}
            ].map((f, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4">
                <div className="font-semibold mb-1">{f.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-sm text-muted-foreground mb-2">Tech we love</div>
            <div className="flex flex-wrap gap-2">
              {['Next.js','Prisma','Gemini','Firebase','Tailwind','Framer Motion'].map((t,i)=> (
                <span key={i} className="px-2.5 py-1 rounded-md text-xs bg-muted border border-border">{t}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-sm text-muted-foreground mb-2">What you get</div>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc ml-4">
              <li>Actionable plans with progress tracking</li>
              <li>Unified insights across domains</li>
              <li>Human‑friendly explanations</li>
              <li>Privacy‑first architecture</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Milestones / Roadmap */}
      <motion.div
        className="w-full max-w-6xl mt-10 grid sm:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {[
          {step:'Q1', title:'Foundation', desc:'Core engine, privacy layer, and UX system.'},
          {step:'Q2', title:'Assist', desc:'Goal trackers, AI suggestions, and progress loops.'},
          {step:'Q3', title:'Scale', desc:'Multi‑domain insights, automation, and teams.'}
        ].map((m,i)=> (
          <div key={i} className="rounded-2xl border border-border bg-gradient-to-br from-background to-card p-5">
            <div className="text-xs uppercase tracking-wide text-blue-500 mb-1">{m.step}</div>
            <div className="font-semibold mb-1">{m.title}</div>
            <div className="text-sm text-muted-foreground">{m.desc}</div>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mt-10 rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div>
          <div className="text-xl font-semibold">Ready to mirror your risk—and master it?</div>
          <div className="text-sm text-muted-foreground">Start with the Goal Tracker and let AI chart your path.</div>
        </div>
        <a href="/goal-tracker" className="inline-flex items-center rounded-lg px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition">Open Goal Tracker</a>
      </motion.div>

      {/* Floating Tagline */}
      <motion.p
        className="mt-10 text-lg font-semibold text-gray-600 dark:text-gray-300"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        Empowering smarter financial decisions 💡
      </motion.p>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -500px 0;
          }
          100% {
            background-position: 500px 0;
          }
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
