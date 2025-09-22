/*<-*/ "use client"

import React, { useEffect, useRef, useState } from "react"

// Allow using the web component in TSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "lottie-player": any
    }
  }
}

interface PlantLottieProps {
  src: string
  height?: number
}

export default function PlantLottie({ src, height = 180 }: PlantLottieProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)

  // Load the LottieFiles player script once
  useEffect(() => {
    if (typeof window === "undefined") return
    const existing = document.querySelector(
      'script[data-lottie-player="true"]'
    ) as HTMLScriptElement | null

    if (existing) {
      setIsScriptLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
    script.async = true
    script.setAttribute("data-lottie-player", "true")
    script.onload = () => setIsScriptLoaded(true)
    document.head.appendChild(script)

    return () => {
      // Do not remove script to allow reuse across pages
    }
  }, [])

  // Set up intersection observer to play once on first scroll into view
  useEffect(() => {
    if (!isScriptLoaded) return
    const el = containerRef.current
    if (!el) return

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && playerRef.current && !hasPlayed) {
            try {
              // Ensure properties set to play once
              playerRef.current.setAttribute("loop", "false")
              playerRef.current.setAttribute("autoplay", "false")
              playerRef.current.seek(0)
              playerRef.current.play()
              setHasPlayed(true)
            } catch (e) {
              // ignore
            }
          }
        })
      },
      { threshold: 0.4 }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [isScriptLoaded, hasPlayed])

  return (
    <div ref={containerRef} className="w-full flex items-center justify-center">
      {/* If the script hasn't loaded yet, render nothing to avoid SSR issues */}
      {isScriptLoaded ? (
        <lottie-player
          ref={playerRef}
          src={src}
          style={{ width: "100%", height }}
          mode="normal"
          speed="1"
          loop={false}
          autoplay={false}
          controls={false}
          background="transparent"
        />
      ) : null}
    </div>
  )
}
/*<-*/