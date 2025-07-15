"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { MaterialItem, MaterialList } from "./material-parser"

export interface BuildProject {
  id: string
  name: string
  materialList: MaterialList
  createdAt: number
  completedAt: number | null
}

interface MaterialState {
  // Current active list
  materialList: MaterialList | null
  // All build projects
  buildProjects: BuildProject[]
  activeProjectId: string | null

  // Functions for current active list
  setMaterialList: (list: MaterialList) => void
  updateItem: (id: string, updates: Partial<MaterialItem>) => void
  collectItem: (id: string, amount?: number) => void
  resetItem: (id: string) => void
  collectAll: () => void
  resetAll: () => void
  clearList: () => void
  isAllCollected: () => boolean

  // Functions for managing multiple projects
  addProject: (name: string, materialList: MaterialList) => string
  removeProject: (id: string) => void
  setActiveProject: (id: string) => void
  completeProject: (id: string) => void
  getProject: (id: string) => BuildProject | undefined
  renameProject: (id: string, newName: string) => void
}

export const useMaterialStore = create<MaterialState>()(
  persist(
    (set, get) => ({
      materialList: null,
      buildProjects: [],
      activeProjectId: null,

      setMaterialList: (list) => set({ materialList: list }),

      updateItem: (id, updates) =>
        set((state) => {
          if (!state.materialList) return state

          const updatedItems = state.materialList.items.map((item) => (item.id === id ? { ...item, ...updates } : item))

          // Update both the active list and the project list
          const updatedList = {
            ...state.materialList,
            items: updatedItems,
          }

          let updatedProjects = [...state.buildProjects]
          if (state.activeProjectId) {
            updatedProjects = updatedProjects.map((project) =>
              project.id === state.activeProjectId ? { ...project, materialList: updatedList } : project,
            )
          }

          return {
            materialList: updatedList,
            buildProjects: updatedProjects,
          }
        }),

      collectItem: (id, amount) => {
        const state = get()
        if (!state.materialList) return

        const item = state.materialList.items.find((i) => i.id === id)
        if (!item) return

        const amountToCollect = amount !== undefined ? amount : item.missing
        const newCollected = Math.min(item.collected + amountToCollect, item.total)
        const newMissing = Math.max(0, item.total - newCollected - item.available)

        get().updateItem(id, {
          collected: newCollected,
          missing: newMissing,
        })
      },

      resetItem: (id) => {
        const state = get()
        if (!state.materialList) return

        const item = state.materialList.items.find((i) => i.id === id)
        if (!item) return

        get().updateItem(id, {
          collected: 0,
          missing: Math.max(0, item.total - item.available),
        })
      },

      collectAll: () => {
        const state = get()
        if (!state.materialList) return

        const updatedItems = state.materialList.items.map((item) => ({
          ...item,
          collected: item.total,
          missing: 0,
        }))

        // Update both active list and build projects
        const updatedList = {
          ...state.materialList,
          items: updatedItems,
        }

        let updatedProjects = [...state.buildProjects]
        if (state.activeProjectId) {
          updatedProjects = updatedProjects.map((project) =>
            project.id === state.activeProjectId ? { ...project, materialList: updatedList } : project,
          )
        }

        set({
          materialList: updatedList,
          buildProjects: updatedProjects,
        })
      },

      resetAll: () => {
        const state = get()
        if (!state.materialList) return

        const updatedItems = state.materialList.items.map((item) => ({
          ...item,
          collected: 0,
          missing: Math.max(0, item.total - item.available),
          hidden: false, // Reset hidden state too
        }))

        // Update both active list and build projects
        const updatedList = {
          ...state.materialList,
          items: updatedItems,
        }

        let updatedProjects = [...state.buildProjects]
        if (state.activeProjectId) {
          updatedProjects = updatedProjects.map((project) =>
            project.id === state.activeProjectId ? { ...project, materialList: updatedList } : project,
          )
        }

        set({
          materialList: updatedList,
          buildProjects: updatedProjects,
        })
      },

      clearList: () => set({ materialList: null, activeProjectId: null }),

      isAllCollected: () => {
        const state = get()
        if (!state.materialList || state.materialList.items.length === 0) return false

        return state.materialList.items.every((item) => item.collected >= item.total)
      },

      // Functions for managing multiple projects
      addProject: (name, list) => {
        const id = `project-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        const newProject: BuildProject = {
          id,
          name,
          materialList: list,
          createdAt: Date.now(),
          completedAt: null,
        }

        set((state) => ({
          buildProjects: [...state.buildProjects, newProject],
          materialList: list,
          activeProjectId: id,
        }))

        return id
      },

      removeProject: (id) => {
        set((state) => {
          const updatedProjects = state.buildProjects.filter((p) => p.id !== id)
          const activeProject = state.activeProjectId === id ? updatedProjects[0] || null : state.activeProjectId

          return {
            buildProjects: updatedProjects,
            activeProjectId: activeProject,
            materialList: activeProject
              ? updatedProjects.find((p) => p.id === activeProject)?.materialList || null
              : null,
          }
        })
      },

      setActiveProject: (id) => {
        const project = get().buildProjects.find((p) => p.id === id)
        if (project) {
          set({
            activeProjectId: id,
            materialList: project.materialList,
          })
        }
      },

      completeProject: (id) => {
        set((state) => ({
          buildProjects: state.buildProjects.map((p) => (p.id === id ? { ...p, completedAt: Date.now() } : p)),
        }))
      },

      getProject: (id) => {
        return get().buildProjects.find((p) => p.id === id)
      },

      renameProject: (id, newName) => {
        set((state) => ({
          buildProjects: state.buildProjects.map((p) => (p.id === id ? { ...p, name: newName } : p)),
        }))
      },
    }),
    {
      name: "litematica-material-storage",
    },
  ),
)

