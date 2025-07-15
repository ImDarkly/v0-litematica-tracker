"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { HelpCircle } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useState } from "react"

export default function ImportGuide() {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HelpCircle className="h-4 w-4 text-purple-500" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>How to import your material list</DialogTitle>
            <DialogDescription>Follow these steps to import your Litematica material list</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <h3 className="font-medium">Step 1: Export from Litematica</h3>
              <p className="text-sm text-muted-foreground break-words">
                In Minecraft, use Litematica to export your material list to a file.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Step 2: Copy the content</h3>
              <p className="text-sm text-muted-foreground break-words">
                Open the file and press Ctrl+A to select all, then Ctrl+C to copy.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Step 3: Import to this app</h3>
              <p className="text-sm text-muted-foreground break-words">
                Choose your preferred import method (clipboard, manual, or file) and follow the prompts.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Example format:</h3>
              <pre className="text-xs p-2 bg-muted rounded-md overflow-x-auto whitespace-pre-wrap break-all">
                {`+-------------------------------+-------+---------+-----------+
| Material List for placement 'Simple Survival House'        |
+-------------------------------+-------+---------+-----------+
| Item                          | Total | Missing | Available |
+-------------------------------+-------+---------+-----------+
| Oak Planks                    |   128 |     128 |         0 |
| Oak Stairs                    |    64 |      64 |         0 |
...`}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HelpCircle className="h-4 w-4 text-purple-500" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>How to import your material list</DrawerTitle>
          <DrawerDescription>Follow these steps to import your Litematica material list</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <h3 className="font-medium">Step 1: Export from Litematica</h3>
            <p className="text-sm text-muted-foreground break-words">
              In Minecraft, use Litematica to export your material list to a file.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Step 2: Copy the content</h3>
            <p className="text-sm text-muted-foreground break-words">
              Open the file and press Ctrl+A to select all, then Ctrl+C to copy.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Step 3: Import to this app</h3>
            <p className="text-sm text-muted-foreground break-words">
              Choose your preferred import method (clipboard, manual, or file) and follow the prompts.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Example format:</h3>
            <pre className="text-xs p-2 bg-muted rounded-md overflow-x-auto whitespace-pre-wrap break-all">
              {`+-------------------------------+-------+---------+-----------+
| Material List for placement 'Simple Survival House'        |
+-------------------------------+-------+---------+-----------+
| Item                          | Total | Missing | Available |
| Oak Planks                    |   128 |     128 |         0 |
| Oak Stairs                    |    64 |      64 |         0 |
...`}
            </pre>
          </div>
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

