"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, KeyboardIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { parseMaterialList } from "@/lib/material-parser"
import { useMaterialStore } from "@/lib/material-store-enhanced"
import { useToast } from "@/components/ui/use-toast"
import { Footer } from "@/components/footer"
import { OneTimeAlert } from "@/components/one-time-alert"

export default function ManualImport() {
  const router = useRouter()
  const { toast } = useToast()
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = () => {
    try {
      setIsLoading(true)

      if (!text.trim()) {
        toast({
          title: "Empty input",
          description: "Please paste a Litematica material list into the text area.",
          variant: "destructive",
        })
        return
      }

      const parsedList = parseMaterialList(text)

      if (parsedList && parsedList.items.length > 0) {
        const projectId = useMaterialStore.getState().addProject(parsedList.title, parsedList)
        router.push("/materials")
      } else {
        toast({
          title: "Invalid format",
          description: "The text doesn't appear to be a valid Litematica material list.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse the material list. Please check the format.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid-background flex flex-col">
      <main className="p-4 md:p-8 flex-1">
        <div className="max-w-md mx-auto">
          <OneTimeAlert />

          <Card>
            <CardHeader>
              <CardTitle>Manual input</CardTitle>
              <CardDescription>Paste your Litematica material list into the text area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center">
                  <KeyboardIcon className="h-12 w-12 text-primary" />
                </div>

                <Textarea
                  placeholder="Paste your Litematica material list here..."
                  className="min-h-[200px] font-mono text-sm"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <div className="text-sm text-muted-foreground">
                  <p>Make sure the text includes the item names, total, missing, and available columns.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button onClick={handleImport} disabled={isLoading} className="gap-2">
                {isLoading ? "Processing..." : "Import list"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

