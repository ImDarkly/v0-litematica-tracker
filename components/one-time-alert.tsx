"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OneTimeAlert() {
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    // Check if the alert has been dismissed before
    const alertDismissed = localStorage.getItem("alertDismissed")
    if (!alertDismissed) {
      setShowAlert(true)
    }
  }, [])

  const dismissAlert = () => {
    // Ensure we're setting the localStorage value correctly
    localStorage.setItem("alertDismissed", "true")
    setShowAlert(false)
  }

  if (!showAlert) {
    return null
  }

  return (
    <Alert className="mb-4 border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 relative">
      <AlertCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      <AlertTitle className="text-purple-700 dark:text-purple-300">Experimental App</AlertTitle>
      <AlertDescription className="text-purple-600/80 dark:text-purple-400/80 pr-8">
        This app is "vibe coded" and might not work as expected. It's a passion project for Minecraft builders.
      </AlertDescription>
      <div className="absolute top-2 right-2">
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0 flex items-center justify-center bg-white hover:bg-purple-100 text-purple-800 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white border border-purple-400 dark:border-purple-600"
          onClick={dismissAlert}
          aria-label="Close alert"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Alert>
  )
}

