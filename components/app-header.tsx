"use client"

import { ProjectSelector } from "@/components/project-selector"
import { useMaterialStore } from "@/lib/material-store-enhanced"
import ImportGuide from "@/components/import-guide"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChestIcon } from "@/components/icons/chest-icon"

export function AppHeader() {
  const buildProjects = useMaterialStore((state) => state.buildProjects)
  const pathname = usePathname()

  // Don't show on dedicated view
  if (pathname === "/materials/dedicated") {
    return null
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-purple-200 dark:border-gray-800 px-4 py-2">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <ChestIcon className="h-12 w-12 text-purple-600" />
            <span className="text-xl font-bold text-purple-600 truncate max-w-[200px]">Litematica Tracker</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ImportGuide />
          {buildProjects.length > 0 && <ProjectSelector compact position="right" />}
        </div>
      </div>
    </header>
  )
}

