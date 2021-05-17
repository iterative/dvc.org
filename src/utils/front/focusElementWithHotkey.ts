/**
 * Utility function to focus on an element by pressing a specified hotkey.
 * @param target CSS selector for the element to be focused
 * @param hotkey The key that should trigger the target element to be focused
 */
export const focusElementWithHotkey = (
  target: string,
  hotkey: string
): void => {
  document.addEventListener('keydown', $event => {
    if ($event.key !== hotkey || document.activeElement?.matches(target)) {
      return
    }
    const targetElement = document.querySelector(target) as HTMLElement
    targetElement?.focus()
    $event.preventDefault()
  })
}
