"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUp, Clipboard, KeyboardIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { parseMaterialList } from "@/lib/material-parser"
import { useMaterialStore } from "@/lib/material-store-enhanced"
import { useToast } from "@/components/ui/use-toast"
import { OneTimeAlert } from "@/components/one-time-alert"
import { Footer } from "@/components/footer"

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handlePasteFromClipboard = async () => {
    try {
      setIsLoading(true)

      if (!navigator.clipboard) {
        toast({
          title: "Clipboard access not available",
          description: "Please try the manual input method instead.",
          variant: "destructive",
        })
        return
      }

      const text = await navigator.clipboard.readText()
      const parsedList = parseMaterialList(text)

      if (parsedList && parsedList.items.length > 0) {
        const projectId = useMaterialStore.getState().addProject(parsedList.title, parsedList)
        router.push("/materials")
      } else {
        toast({
          title: "Invalid format",
          description: "The clipboard content doesn't appear to be a valid Litematica material list.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Clipboard error",
        description: "Unable to read from clipboard. Please check your browser permissions.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid-background flex flex-col">
      <main className="p-4 md:p-8 flex-1 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <OneTimeAlert />

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Track your building materials with ease</CardTitle>
              <CardDescription>
                Import your Litematica material lists and keep track of your building progress
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg border-purple-300 dark:border-purple-700 w-full mb-6">
                <Clipboard className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-medium mb-2">Paste from clipboard</h3>
                <p className="text-center text-muted-foreground mb-4">
                  Copy your Litematica material list (Ctrl+A, Ctrl+C) and paste it here
                </p>
                <Button size="lg" className="gap-2 w-full" onClick={handlePasteFromClipboard} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4 text-purple-500" />
                      Paste from clipboard
                    </>
                  )}
                </Button>
              </div>

              <div className="flex gap-4 w-full">
                <Link href="/import/manual" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full gap-2">
                    <KeyboardIcon className="h-4 w-4 text-gray-500" />
                    Manual input
                  </Button>
                </Link>

                <Link href="/import/file" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full gap-2">
                    <FileUp className="h-4 w-4 text-gray-500" />
                    Upload file
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

