"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clipboard } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { parseMaterialList } from "@/lib/material-parser"
import { useMaterialStore } from "@/lib/material-store-enhanced"
import { useToast } from "@/components/ui/use-toast"

export default function ClipboardImport() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [hasClipboardPermission, setHasClipboardPermission] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if clipboard API is available
    if (navigator.clipboard) {
      navigator.permissions
        ?.query({ name: "clipboard-read" as PermissionName })
        .then((result) => {
          setHasClipboardPermission(result.state === "granted" || result.state === "prompt")
        })
        .catch(() => {
          // If we can't check permission, assume we need to ask
          setHasClipboardPermission(true)
        })
    } else {
      setHasClipboardPermission(false)
    }
  }, [])

  const handlePaste = async () => {
    try {
      setIsLoading(true)

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
    <main className="min-h-screen grid-background p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Paste from clipboard</CardTitle>
            <CardDescription>Import your Litematica material list from clipboard</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Clipboard className="h-16 w-16 text-primary mb-6" />

            {hasClipboardPermission === false && (
              <div className="text-center mb-6">
                <p className="text-destructive mb-2">Clipboard access is not supported in your browser</p>
                <p className="text-sm text-muted-foreground">Please try the manual input method instead.</p>
              </div>
            )}

            {hasClipboardPermission !== false && (
              <>
                <p className="text-center mb-6">
                  Click the button below to paste your Litematica material list from clipboard.
                  <br />
                  <span className="text-sm text-muted-foreground">
                    Make sure you've copied the list first (Ctrl+A, Ctrl+C)
                  </span>
                </p>

                <Button size="lg" className="gap-2" onClick={handlePaste} disabled={isLoading}>
                  <Clipboard className="h-4 w-4" />
                  {isLoading ? "Processing..." : "Paste from clipboard"}
                </Button>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button variant="outline">Cancel</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

