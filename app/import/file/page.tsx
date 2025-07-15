"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { parseMaterialList } from "@/lib/material-parser"
import { useMaterialStore } from "@/lib/material-store-enhanced"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

export default function FileImport() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = async (file: File) => {
    try {
      setIsLoading(true)

      const text = await file.text()
      const parsedList = parseMaterialList(text)

      if (parsedList && parsedList.items.length > 0) {
        const projectId = useMaterialStore.getState().addProject(parsedList.title, parsedList)
        router.push("/materials")
      } else {
        toast({
          title: "Invalid format",
          description: "The file doesn't appear to contain a valid Litematica material list.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read or parse the file. Please check the format.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  return (
    <main className="min-h-screen grid-background p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Upload file</CardTitle>
            <CardDescription>Import your Litematica material list from a file</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg ${
                isDragging ? "border-primary bg-primary/5" : "border-primary/20"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileUp className="h-16 w-16 text-primary mb-6" />

              <p className="text-center mb-6">
                Drag and drop your Litematica material list file here, or click to browse
                <br />
                <span className="text-sm text-muted-foreground">Accepts .txt files</span>
              </p>

              <Input
                type="file"
                accept=".txt"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outline"
                  className="gap-2 cursor-pointer"
                  disabled={isLoading}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <FileUp className="h-4 w-4" />
                  {isLoading ? "Processing..." : "Browse files"}
                </Button>
              </label>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

