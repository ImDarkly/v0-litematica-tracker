"use client"

import { convertToMinecraftUnits } from "@/lib/minecraft-units"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MinecraftUnitsDisplayProps {
  count: number
  showRaw?: boolean
  className?: string
  tooltipSide?: "top" | "right" | "bottom" | "left"
}

export function MinecraftUnitsDisplay({
  count,
  showRaw = true,
  className = "",
  tooltipSide = "top",
}: MinecraftUnitsDisplayProps) {
  const units = convertToMinecraftUnits(count)

  // For small numbers, just show the raw count
  if (count <= 64) {
    return <span className={className}>{count}</span>
  }

  // Get color based on size (for tooltip only)
  const getTooltipColor = () => {
    if (count > 1728) return "text-purple-600 dark:text-purple-400" // More than a shulker
    if (count > 640) return "text-purple-600 dark:text-purple-400" // More than 10 stacks
    if (count > 320) return "text-purple-600 dark:text-purple-400" // More than 5 stacks
    if (count > 128) return "text-purple-600 dark:text-purple-400" // More than 2 stacks
    return "text-purple-600 dark:text-purple-400" // 1-2 stacks
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          <span className={`cursor-help ${className}`}>{count}</span>
        </TooltipTrigger>
        <TooltipContent
          side={tooltipSide}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2 rounded shadow-md"
        >
          <div className="space-y-1 text-xs">
            <div className={`font-medium ${getTooltipColor()}`}>{units.displayText}</div>
            {units.shulkers > 0 && (
              <div className="flex justify-between gap-2">
                <span className="text-gray-600 dark:text-gray-400">Shulker boxes:</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">{units.shulkers}</span>
              </div>
            )}
            {units.stacks > 0 && (
              <div className="flex justify-between gap-2">
                <span className="text-gray-600 dark:text-gray-400">Stacks:</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">{units.stacks}</span>
              </div>
            )}
            {units.items > 0 && (
              <div className="flex justify-between gap-2">
                <span className="text-gray-600 dark:text-gray-400">Items:</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">{units.items}</span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

