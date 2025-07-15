"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { MaterialItem, MaterialList } from "./material-parser"

interface MaterialState {
  materialList: MaterialList | null
  setMaterialList: (list: MaterialList) => void
  updateItem: (id: string, updates: Partial<MaterialItem>) => void
  collectItem: (id: string, amount?: number) => void
  resetItem: (id: string) => void
  collectAll: () => void
  resetAll: () => void
  clearList: () => void
  isAllCollected: () => boolean
}

export const useMaterialStore = create<MaterialState>()(
  persist(
    (set, get) => ({
      materialList: null,

      setMaterialList: (list) => set({ materialList: list }),

      updateItem: (id, updates) =>
        set((state) => {
          if (!state.materialList) return state

          const updatedItems = state.materialList.items.map((item) => (item.id === id ? { ...item, ...updates } : item))

          return {
            materialList: {
              ...state.materialList,
              items: updatedItems,
            },
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

        set({
          materialList: {
            ...state.materialList,
            items: updatedItems,
          },
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

        set({
          materialList: {
            ...state.materialList,
            items: updatedItems,
          },
        })
      },

      clearList: () => set({ materialList: null }),

      isAllCollected: () => {
        const state = get()
        if (!state.materialList || state.materialList.items.length === 0) return false

        return state.materialList.items.every((item) => item.collected >= item.total)
      },
    }),
    {
      name: "litematica-material-storage",
    },
  ),
)

