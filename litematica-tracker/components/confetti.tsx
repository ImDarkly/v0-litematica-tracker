"use client"

import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"

export default function Confetti() {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window
    setDimensions({ width, height })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="confetti-container">
      <ReactConfetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.2}
        colors={["#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9"]}
      />
    </div>
  )
}

