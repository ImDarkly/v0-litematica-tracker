"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid3X3, Table, Check, Eye, EyeOff, Trash2, ExternalLink, ArrowDown, ArrowUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { MaterialItem } from "@/lib/material-parser"
import Confetti from "@/components/confetti"
import { Footer } from "@/components/footer"
import { OneTimeAlert } from "@/components/one-time-alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import our components and utilities
import { MinecraftUnitsDisplay } from "@/components/minecraft-units-display"
import { useMaterialStore } from "@/lib/material-store-enhanced"

function MaterialItemCard({
  item,
  collectItem,
  resetItem,
}: { item: MaterialItem; collectItem: (id: string) => void; resetItem: (id: string) => void }) {
  const progressPercentage = item.total > 0 ? Math.round((item.collected / item.total) * 100) : 0
  const isCompleted = item.missing === 0
  const nothingCollected = item.collected === 0

  return (
    <Card
      className={`overflow-hidden ${isCompleted ? "border-purple-300 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700" : ""}`}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <TooltipProvider>
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <CardTitle className="text-base truncate max-w-[200px]">{item.name}</CardTitle>
              </TooltipTrigger>
              <TooltipContent>{item.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Badge
            variant={isCompleted ? "outline" : "secondary"}
            className={isCompleted ? "border-purple-400 text-purple-700 dark:text-purple-300" : ""}
          >
            {isCompleted ? "Complete" : <MinecraftUnitsDisplay count={item.missing} showRaw={false} />}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex justify-between items-center text-sm mb-2">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700 mb-4">
          <div className="h-full bg-purple-600 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm mb-4">
          <div className="flex flex-col items-center p-1 rounded-md bg-gray-100 dark:bg-gray-800">
            <span className="text-muted-foreground text-xs">Total</span>
            <MinecraftUnitsDisplay count={item.total} className="text-center" />
          </div>
          <div className="flex flex-col items-center p-1 rounded-md bg-gray-100 dark:bg-gray-800">
            <span className="text-muted-foreground text-xs">Missing</span>
            <MinecraftUnitsDisplay count={item.missing} className="text-center" />
          </div>
          <div className="flex flex-col items-center p-1 rounded-md bg-gray-100 dark:bg-gray-800">
            <span className="text-muted-foreground text-xs">Collected</span>
            <MinecraftUnitsDisplay count={item.collected} className="text-center" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => collectItem(item.id)}
            disabled={isCompleted}
          >
            <Check className="h-4 w-4 mr-1 text-purple-500" />
            Collect
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => resetItem(item.id)}
            disabled={nothingCollected}
          >
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function MaterialItemRow({ item }: { item: MaterialItem }) {
  const collectItem = useMaterialStore((state) => state.collectItem)
  const resetItem = useMaterialStore((state) => state.resetItem)
  const isCompleted = item.missing === 0
  const nothingCollected = item.collected === 0

  return (
    <TableRow className={`${isCompleted ? "bg-purple-50 dark:bg-purple-900/20" : ""}`}>
      <TableCell>
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <span className="truncate block max-w-[200px]">{item.name}</span>
            </TooltipTrigger>
            <TooltipContent>{item.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-right">
        <MinecraftUnitsDisplay count={item.total} tooltipSide="left" />
      </TableCell>
      <TableCell className="text-right">
        <MinecraftUnitsDisplay count={item.missing} tooltipSide="left" />
      </TableCell>
      <TableCell className="text-right">
        <MinecraftUnitsDisplay count={item.collected} tooltipSide="left" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => collectItem(item.id)}
            disabled={isCompleted}
          >
            <Check className="h-4 w-4 text-gray-500" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => resetItem(item.id)}
            disabled={nothingCollected}
          >
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function MaterialsPage() {
  const router = useRouter()
  const materialList = useMaterialStore((state) => state.materialList)
  const isAllCollected = useMaterialStore((state) => state.isAllCollected)
  const clearList = useMaterialStore((state) => state.clearList)
  const collectAll = useMaterialStore((state) => state.collectAll)
  const resetAll = useMaterialStore((state) => state.resetAll)
  const collectItem = useMaterialStore((state) => state.collectItem)
  const resetItem = useMaterialStore((state) => state.resetItem)

  const [searchTerm, setSearchTerm] = useState("")
  const [showCompleted, setShowCompleted] = useState(true)
  const [sortField, setSortField] = useState<keyof MaterialItem>("missing")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (!materialList) {
      router.push("/")
    }
  }, [materialList, router])

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

  // Completely rewritten sorting function
  const sortItems = (items: MaterialItem[]) => {
    // First filter by search term and completion status
    const filtered = items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCompletion = showCompleted || item.missing > 0
      return matchesSearch && matchesCompletion
    })

    // Then sort by the selected field and direction
    return [...filtered].sort((a, b) => {
      // First sort by completion status (incomplete first)
      if (!showCompleted) {
        if (a.missing === 0 && b.missing > 0) return 1
        if (a.missing > 0 && b.missing === 0) return -1
      }

      // Then sort by the selected field
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })
  }

  const handleSort = (field: keyof MaterialItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedItems = materialList?.items ? sortItems(materialList.items) : []

  const openInNewWindow = () => {
    if (materialList) {
      // Serialize the entire material list and store it in localStorage
      localStorage.setItem("dedicated_view_data", JSON.stringify(materialList))

      // Also store the active project ID if available
      if (useMaterialStore.getState().activeProjectId) {
        localStorage.setItem("dedicated_view_project_id", useMaterialStore.getState().activeProjectId)
      }

      const url = `${window.location.origin}/materials/dedicated`
      window.open(url, "_blank", "width=500,height=600")
    }
  }

  if (!materialList) {
    return null
  }

  const totalProgress = materialList.items.reduce(
    (acc, item) => {
      acc.total += item.total
      acc.collected += item.collected
      return acc
    },
    { total: 0, collected: 0 },
  )

  const progressPercentage =
    totalProgress.total > 0 ? Math.round((totalProgress.collected / totalProgress.total) * 100) : 0

  // Check if any items have been collected
  const anyItemsCollected = materialList.items.some((item) => item.collected > 0)

  return (
    <div className="min-h-screen grid-background flex flex-col">
      {showConfetti && <Confetti />}

      <main className="p-4 md:p-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <TooltipProvider>
                <Tooltip delayDuration={50}>
                  <TooltipTrigger asChild>
                    <h1 className="text-2xl font-bold text-purple-600 truncate max-w-[300px]">{materialList.title}</h1>
                  </TooltipTrigger>
                  <TooltipContent>{materialList.title}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={progressPercentage} className="w-40 h-2 bg-gray-200 dark:bg-gray-700">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: `${progressPercentage}%` }} />
              </Progress>
              <span className="text-sm text-muted-foreground">{progressPercentage}% complete</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={openInNewWindow}>
                <ExternalLink className="h-4 w-4 text-gray-500" />
                Open in new window
              </Button>

              <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowCompleted(!showCompleted)}>
                {showCompleted ? (
                  <>
                    <EyeOff className="h-4 w-4 text-gray-500" />
                    Hide completed
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 text-gray-500" />
                    Show completed
                  </>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={collectAll}>
                    <Check className="h-4 w-4 mr-2 text-gray-500" />
                    Mark all as collected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={resetAll} disabled={!anyItemsCollected}>
                    <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
                    Reset all progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={clearList}>
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-500" />
                    Import new list
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <OneTimeAlert />

          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <CardTitle>Material List</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => handleSort("name")}>
                      Name{" "}
                      {sortField === "name" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3 ml-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 ml-1" />
                        ))}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => handleSort("missing")}>
                      Missing{" "}
                      {sortField === "missing" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3 ml-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 ml-1" />
                        ))}
                    </Button>
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="grid">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="grid" className="gap-2">
                      <Grid3X3 className="h-4 w-4" />
                      Grid
                    </TabsTrigger>
                    <TabsTrigger value="table" className="gap-2">
                      <Table className="h-4 w-4" />
                      Table
                    </TabsTrigger>
                  </TabsList>

                  <div className="text-sm text-muted-foreground">{sortedItems.length} items</div>
                </div>

                <TabsContent value="grid" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {sortedItems.map((item) => (
                      <MaterialItemCard key={item.id} item={item} collectItem={collectItem} resetItem={resetItem} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="table" className="mt-0">
                  <TableComponent>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 -ml-2"
                            onClick={() => handleSort("name")}
                          >
                            Item{" "}
                            {sortField === "name" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="h-3 w-3 ml-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 ml-1" />
                              ))}
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 ml-auto"
                            onClick={() => handleSort("total")}
                          >
                            Total{" "}
                            {sortField === "total" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="h-3 w-3 ml-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 ml-1" />
                              ))}
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 ml-auto"
                            onClick={() => handleSort("missing")}
                          >
                            Missing{" "}
                            {sortField === "missing" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="h-3 w-3 ml-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 ml-1" />
                              ))}
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 ml-auto"
                            onClick={() => handleSort("collected")}
                          >
                            Collected{" "}
                            {sortField === "collected" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="h-3 w-3 ml-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 ml-1" />
                              ))}
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedItems.map((item) => (
                        <MaterialItemRow key={item.id} item={item} />
                      ))}
                    </TableBody>
                  </TableComponent>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

