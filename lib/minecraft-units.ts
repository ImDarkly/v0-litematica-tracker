export interface MinecraftUnits {
  shulkers: number
  stacks: number
  items: number
  total: number
  displayText: string
}

export function convertToMinecraftUnits(count: number): MinecraftUnits {
  const ITEMS_PER_STACK = 64
  const STACKS_PER_SHULKER = 27

  const total = count
  const shulkers = Math.floor(count / (ITEMS_PER_STACK * STACKS_PER_SHULKER))
  count %= ITEMS_PER_STACK * STACKS_PER_SHULKER

  const stacks = Math.floor(count / ITEMS_PER_STACK)
  const items = count % ITEMS_PER_STACK

  // Create a formatted display text
  let displayText = ""

  if (shulkers > 0) {
    displayText += `${shulkers} shulker${shulkers > 1 ? "s" : ""}`
    if (stacks > 0 || items > 0) displayText += ", "
  }

  if (stacks > 0) {
    displayText += `${stacks} stack${stacks > 1 ? "s" : ""}`
    if (items > 0) displayText += ", "
  }

  if (items > 0 || (shulkers === 0 && stacks === 0)) {
    displayText += `${items} item${items !== 1 ? "s" : ""}`
  }

  return {
    shulkers,
    stacks,
    items,
    total,
    displayText,
  }
}

