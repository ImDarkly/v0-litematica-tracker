import { ThemeSwitch } from "@/components/theme-switch"

export function Footer() {
  return (
    <footer className="py-3 px-4 border-t border-purple-300 dark:border-gray-800 mt-auto bg-purple-100/80 dark:bg-transparent">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-xs text-purple-700 dark:text-muted-foreground">
          <span>Made with ❤️ for Minecraft builders</span>
          <span className="ml-2 text-purple-600 dark:text-purple-400 font-medium">v1.2.3</span>
        </div>
        <ThemeSwitch />
      </div>
    </footer>
  )
}

