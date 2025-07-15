"use client"

import { Button } from "@/components/ui/button"
import { Check, Trash2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import type { MaterialItem, MaterialList } from "@/lib/material-parser"
import ReactConfetti from "react-confetti"
import { OneTimeAlert } from "@/components/one-time-alert"
import { ThemeSwitch } from "@/components/theme-switch"
import { ProjectSelector } from "@/components/project-selector"
import { MinecraftUnitsDisplay } from "@/components/minecraft-units-display"
import { useMaterialStore } from "@/lib/material-store-enhanced"
import Link from "next/link"
import { ChestIcon } from "@/components/icons/chest-icon"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function DedicatedMaterialsPage() {
  const router = useRouter()
  const materialList = useMaterialStore((state) => state.materialList)
  const setMaterialList = useMaterialStore((state) => state.setMaterialList)
  const setActiveProject = useMaterialStore((state) => state.setActiveProject)
  const isAllCollected = useMaterialStore((state) => state.isAllCollected)
  const collectItem = useMaterialStore((state) => state.collectItem)
  const resetItem = useMaterialStore((state) => state.resetItem)

  const [searchTerm, setSearchTerm] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const [sortBy, setSortBy] = useState<"name" | "missing" | "total">("missing")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Track window width for responsive grid
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // Set initial width
    setWindowWidth(window.innerWidth)

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoaded) {
      try {
        // Try to load the serialized material list from localStorage
        const savedData = localStorage.getItem("dedicated_view_data")
        const projectId = localStorage.getItem("dedicated_view_project_id")

        if (savedData) {
          const parsedData = JSON.parse(savedData) as MaterialList

          // Set the material list directly
          setMaterialList(parsedData)

          // If we have a project ID, set it as active
          if (projectId) {
            setActiveProject(projectId)
          }

          setIsLoaded(true)
        } else if (!materialList) {
          // If no saved data and no material list, redirect to home
          router.push("/")
        }
      } catch (error) {
        console.error("Error loading dedicated view data:", error)
        if (!materialList) {
          router.push("/")
        }
      }
    }
  }, [materialList, router, setMaterialList, setActiveProject, isLoaded])

  useEffect(() => {
    // Check if all items are collected and show confetti
    if (isAllCollected() && materialList?.items.length > 0) {
      setShowConfetti(true)

      // Hide confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [materialList, isAllCollected])

  // Sort and filter items
  const sortedItems =
    materialList?.items
      .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        // First sort by completion status (incomplete first)
        if (a.missing === 0 && b.missing > 0) return 1
        if (a.missing > 0 && b.missing === 0) return -1

        // Then sort by the selected field
        if (sortBy === "name") {
          return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        } else {
          const aValue = a[sortBy]
          const bValue = b[sortBy]
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue
        }
      }) || []

  // Calculate the number of columns based on window width
  const getGridColumns = () => {
    if (windowWidth < 400) return 1
    if (windowWidth < 600) return 2
    if (windowWidth < 900) return 3
    if (windowWidth < 1200) return 4
    return 5
  }

  if (!materialList) {
    return (
      <div className="min-h-screen grid-background flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-purple-700 mb-4">Loading material list...</h1>
          <p className="text-sm text-purple-600 mb-6">If nothing loads, please try again from the main window.</p>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid-background flex flex-col">
      {showConfetti && <ConfettiComponent />}

      <div className="p-2 pb-1 bg-purple-100/80 dark:bg-transparent border-b border-purple-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1 overflow-hidden">
            <ChestIcon className="h-10 w-10 text-purple-600" />
            <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                  <h1 className="text-lg font-bold text-purple-700 truncate max-w-[200px]">{materialList.title}</h1>
                </TooltipTrigger>
                <TooltipContent>{materialList.title}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ProjectSelector compact position="right" />
        </div>

        <OneTimeAlert />

        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-7 text-sm bg-white dark:bg-gray-800 border-purple-300 dark:border-gray-700 flex-grow"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              if (sortBy === "name") {
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              } else {
                setSortBy("name")
                setSortDirection("asc")
              }
            }}
          >
            Name
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              if (sortBy === "missing") {
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              } else {
                setSortBy("missing")
                setSortDirection("asc")
              }
            }}
          >
            Missing
          </Button>
        </div>
      </div>

      <div className="p-1 overflow-auto h-[calc(100vh-100px)] flex-1">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${getGridColumns()}, minmax(0, 1fr))`,
          }}
        >
          {sortedItems.map((item) => (
            <SquareItem key={item.id} item={item} collectItem={collectItem} resetItem={resetItem} />
          ))}

          {sortedItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 col-span-full">
              <p className="text-sm text-purple-600 dark:text-muted-foreground">No items found</p>
            </div>
          )}

          {isAllCollected() && sortedItems.length > 0 && (
            <div className="bg-purple-200 dark:bg-purple-900/30 rounded-lg p-4 text-center mt-4 col-span-full border border-purple-400 dark:border-purple-700">
              <h3 className="font-bold text-purple-800 dark:text-purple-400">All items collected!</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">Great job completing this build</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-2 border-t border-purple-300 dark:border-gray-800 flex justify-between items-center bg-purple-100/80 dark:bg-transparent">
        <span className="text-xs text-purple-600 dark:text-muted-foreground font-medium">v1.2.3</span>
        <ThemeSwitch />
      </div>
    </div>
  )
}

function SquareItem({
  item,
  collectItem,
  resetItem,
}: {
  item: MaterialItem
  collectItem: (id: string) => void
  resetItem: (id: string) => void
}) {
  const isCompleted = item.missing === 0
  const nothingCollected = item.collected === 0

  return (
    <div
      className={`flex flex-col p-2 border rounded-md shadow-sm transition-colors ${
        isCompleted
          ? "border-purple-500 bg-purple-200/80 dark:bg-purple-900/30 dark:border-purple-700"
          : "border-purple-400 bg-purple-100/80 dark:bg-gray-800/30 dark:border-gray-700"
      }`}
    >
      <div className="flex justify-between items-center">
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <div className="text-xs font-medium truncate max-w-[65%] text-purple-800 dark:text-gray-200">
                {item.name}
              </div>
            </TooltipTrigger>
            <TooltipContent>{item.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div
          className={`text-xs px-2 py-0.5 rounded-full ${
            isCompleted
              ? "bg-purple-300 text-purple-800 dark:bg-purple-800 dark:text-purple-300"
              : "bg-purple-200 text-purple-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {isCompleted ? "Complete" : <MinecraftUnitsDisplay count={item.missing} showRaw={false} />}
        </div>
      </div>

      <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 text-center">
        <MinecraftUnitsDisplay count={item.collected} showRaw={false} /> /
        <MinecraftUnitsDisplay count={item.total} showRaw={false} />
      </div>

      <div className="flex justify-end gap-1 mt-2">
        <Button
          variant="default"
          size="icon"
          className="h-9 w-9 rounded-md"
          onClick={() => collectItem(item.id)}
          disabled={isCompleted}
        >
          <Check className="h-4 w-4 text-purple-700 dark:text-purple-300" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-md"
          onClick={() => resetItem(item.id)}
          disabled={nothingCollected}
        >
          <Trash2 className="h-4 w-4 text-purple-700 dark:text-gray-400" />
        </Button>
      </div>
    </div>
  )
}

function ConfettiComponent() {
  return (
    <div className="confetti-container">
      <ReactConfetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
        gravity={0.2}
        colors={["#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9"]}
      />
    </div>
  )
}

