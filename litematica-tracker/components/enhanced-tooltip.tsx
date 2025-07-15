"use client"

import type { ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EnhancedTooltipProps {
  text: string
  children: ReactNode
  side?: "top" | "right" | "bottom" | "left"
  showOnlyIfTruncated?: boolean
  maxWidth?: string
}

export function EnhancedTooltip({
  text,
  children,
  side = "top",
  showOnlyIfTruncated = false,
  maxWidth = "200px",
}: EnhancedTooltipProps) {
  // If we only want to show the tooltip when text is truncated,
  // we need to check if the text length exceeds a certain threshold
  const shouldShowTooltip = !showOnlyIfTruncated || text.length > 20

  if (!shouldShowTooltip) {
    return <>{children}</>
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className="px-3 py-1.5 text-sm">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

