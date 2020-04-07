import React from 'react'

enum KEYS {
  RETURN = 13,
  SPACE = 32
}

export const isTriggeredFromKB = (e: React.KeyboardEvent) =>
  e.which === KEYS.RETURN || e.which === KEYS.SPACE
