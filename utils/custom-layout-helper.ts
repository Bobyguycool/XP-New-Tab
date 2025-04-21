// Helper functions for custom layout functionality

/**
 * Saves the current layout configuration to localStorage
 * @param layoutItems Array of layout items with positions and dimensions
 */
export function saveCustomLayout(layoutItems: any[]) {
  try {
    localStorage.setItem("customLayoutItems", JSON.stringify(layoutItems))
    return true
  } catch (error) {
    console.error("Error saving custom layout:", error)
    return false
  }
}

/**
 * Loads the saved layout configuration from localStorage
 * @returns Array of layout items or null if none exists
 */
export function loadCustomLayout() {
  try {
    const savedLayout = localStorage.getItem("customLayoutItems")
    return savedLayout ? JSON.parse(savedLayout) : null
  } catch (error) {
    console.error("Error loading custom layout:", error)
    return null
  }
}

/**
 * Checks if two layout items are overlapping
 * @param item1 First layout item
 * @param item2 Second layout item
 * @returns Boolean indicating if items overlap
 */
export function checkOverlap(item1: any, item2: any) {
  return !(
    item1.x + item1.width < item2.x ||
    item1.x > item2.x + item2.width ||
    item1.y + item1.height < item2.y ||
    item1.y > item2.y + item2.height
  )
}

/**
 * Suggests a position for a new item to avoid overlaps
 * @param newItem New item to position
 * @param existingItems Existing layout items
 * @param containerWidth Width of the container
 * @param containerHeight Height of the container
 * @returns Updated position for the new item
 */
export function suggestPosition(newItem: any, existingItems: any[], containerWidth: number, containerHeight: number) {
  // Start with the original position
  const position = { x: newItem.x, y: newItem.y }

  // Grid size for positioning
  const gridSize = 20

  // Try different positions until we find one without overlap
  for (let y = 0; y < containerHeight; y += gridSize) {
    for (let x = 0; x < containerWidth; x += gridSize) {
      const testItem = { ...newItem, x, y }

      // Check if this position overlaps with any existing item
      const hasOverlap = existingItems.some((item) => checkOverlap(testItem, item))

      if (!hasOverlap) {
        return { x, y }
      }
    }
  }

  // If all positions have overlaps, return the original position
  return position
}

/**
 * Snaps a position to a grid
 * @param position Position to snap
 * @param gridSize Size of the grid
 * @returns Snapped position
 */
export function snapToGrid(position: { x: number; y: number }, gridSize = 10) {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  }
}
