export interface MaterialItem {
  id: string
  name: string
  total: number
  missing: number
  available: number
  collected: number
  hidden: boolean
}

export interface MaterialList {
  title: string
  items: MaterialItem[]
}

export function parseMaterialList(text: string): MaterialList | null {
  try {
    // Split the text into lines
    const lines = text.split("\n").filter((line) => line.trim() !== "")

    // Extract the title from the second line
    const titleLine = lines[1] || ""
    const titleMatch = titleLine.match(/Material List for placement '(.+?)'/)
    const title = titleMatch ? titleMatch[1] : "Material List"

    // Find the header line index
    const headerLineIndex = lines.findIndex(
      (line) =>
        line.includes("Item") && line.includes("Total") && line.includes("Missing") && line.includes("Available"),
    )

    if (headerLineIndex === -1) {
      throw new Error("Invalid format: Header line not found")
    }

    // Start parsing items from the line after the header and separator
    const items: MaterialItem[] = []

    for (let i = headerLineIndex + 2; i < lines.length; i++) {
      const line = lines[i]

      // Stop if we hit the bottom border
      if (line.startsWith("+--") || line.includes("---+")) {
        break
      }

      // Parse the line
      // Format is typically: | Item Name | Total | Missing | Available |
      const parts = line.split("|").map((part) => part.trim())

      if (parts.length >= 5) {
        const name = parts[1]
        const total = Number.parseInt(parts[2], 10) || 0
        const parsedMissing = Number.parseInt(parts[3], 10) || 0
        const available = Number.parseInt(parts[4], 10) || 0

        // Calculate collected (what's already placed)
        const collected = total - parsedMissing

        // Calculate the actual missing amount based on the rule:
        // If missing == total: Use total - available
        // If missing != total: Use missing - available
        let missing = parsedMissing
        if (parsedMissing === total) {
          missing = Math.max(0, total - available)
        } else {
          missing = Math.max(0, parsedMissing - available)
        }

        items.push({
          id: `item-${i}`,
          name,
          total,
          missing,
          available,
          collected,
          hidden: false,
        })
      }
    }

    if (items.length === 0) {
      throw new Error("No items found in the material list")
    }

    return { title, items }
  } catch (error) {
    console.error("Error parsing material list:", error)
    return null
  }
}

