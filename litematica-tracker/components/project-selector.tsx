"use client"

import { useState } from "react"
import { useMaterialStore } from "@/lib/material-store-enhanced"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Check, ChevronDown, Flag, FolderOpen, Pencil, Trash2 } from "lucide-react"
import Confetti from "@/components/confetti"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ProjectSelector({
  compact = false,
  position = "right",
}: {
  compact?: boolean
  position?: "left" | "right"
}) {
  const router = useRouter()
  const buildProjects = useMaterialStore((state) => state.buildProjects)
  const activeProjectId = useMaterialStore((state) => state.activeProjectId)
  const setActiveProject = useMaterialStore((state) => state.setActiveProject)
  const renameProject = useMaterialStore((state) => state.renameProject)
  const removeProject = useMaterialStore((state) => state.removeProject)
  const completeProject = useMaterialStore((state) => state.completeProject)
  const getProject = useMaterialStore((state) => state.getProject)

  const [showDialog, setShowDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<"rename" | "delete" | "complete">("rename")
  const [projectId, setProjectId] = useState<string | null>(null)
  const [newProjectName, setNewProjectName] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)

  const activeProject = activeProjectId ? getProject(activeProjectId) : null

  const openRenameDialog = (id: string) => {
    const project = getProject(id)
    if (project) {
      setProjectId(id)
      setNewProjectName(project.name)
      setDialogMode("rename")
      setShowDialog(true)
    }
  }

  const openDeleteDialog = (id: string) => {
    setProjectId(id)
    setDialogMode("delete")
    setShowDialog(true)
  }

  const openCompleteDialog = (id: string) => {
    setProjectId(id)
    setDialogMode("complete")
    setShowDialog(true)
  }

  const handleDialogConfirm = () => {
    if (!projectId) return

    if (dialogMode === "rename") {
      renameProject(projectId, newProjectName)
    } else if (dialogMode === "delete") {
      removeProject(projectId)
    } else if (dialogMode === "complete") {
      completeProject(projectId)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }

    setShowDialog(false)
    setProjectId(null)
  }

  const handleSelectProject = (id: string) => {
    setActiveProject(id)
    router.push("/materials")
  }

  if (buildProjects.length === 0) {
    return null
  }

  return (
    <div className="flex items-center">
      {showConfetti && <Confetti />}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {compact ? (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <FolderOpen className="h-4 w-4 text-purple-500" />
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="gap-2 max-w-[200px]">
                    <FolderOpen className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="truncate">{activeProject ? activeProject.name : "Select Project"}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  </Button>
                </TooltipTrigger>
                {activeProject && activeProject.name.length > 15 && (
                  <TooltipContent>{activeProject.name}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align={position === "left" ? "start" : "end"} className="w-56">
          {compact && activeProject && (
            <DropdownMenuItem className="font-medium text-purple-700 dark:text-purple-400 truncate">
              {activeProject.name}
            </DropdownMenuItem>
          )}

          {compact && activeProject && <DropdownMenuSeparator />}

          {buildProjects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              className="flex items-center justify-between"
              onClick={() => handleSelectProject(project.id)}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {project.completedAt ? (
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <FolderOpen className="h-4 w-4 text-purple-500 flex-shrink-0" />
                )}
                <span className={`truncate ${project.completedAt ? "line-through opacity-70" : ""}`}>
                  {project.name}
                </span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    openRenameDialog(project.id)
                  }}
                >
                  <Pencil className="h-3 w-3 text-gray-500" />
                </Button>
                {!project.completedAt && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      openCompleteDialog(project.id)
                    }}
                  >
                    <Flag className="h-3 w-3 text-green-500" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    openDeleteDialog(project.id)
                  }}
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "rename"
                ? "Rename Project"
                : dialogMode === "delete"
                  ? "Delete Project"
                  : "Complete Project"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "rename"
                ? "Enter a new name for your project."
                : dialogMode === "delete"
                  ? "Are you sure you want to delete this project? This action cannot be undone."
                  : "Mark this project as complete? This will show a celebration animation!"}
            </DialogDescription>
          </DialogHeader>

          {dialogMode === "rename" && (
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
              className="border-purple-300"
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button variant={dialogMode === "delete" ? "destructive" : "default"} onClick={handleDialogConfirm}>
              {dialogMode === "rename" ? "Save" : dialogMode === "delete" ? "Delete" : "Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

