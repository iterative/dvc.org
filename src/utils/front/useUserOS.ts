import { useEffect, useReducer } from 'react'

import isClient from '@dvcorg/gatsby-theme-iterative/src/utils/front/isClient'
import safeLocalStorage from '@dvcorg/gatsby-theme-iterative/src/utils/front/safeLocalStorage'

export enum OS {
  UNKNOWN = 'unknown',
  OSX = 'osx',
  WINDOWS = 'win',
  LINUX = 'linux',
  LINUX_RPM = 'linux_rpm'
}

const userAgentIs = (value: string): boolean =>
  navigator.userAgent.indexOf(value) !== -1

const getUserOS = (): OS => {
  let OSName = OS.UNKNOWN

  if (!isClient) return OSName
  if (userAgentIs('Win')) OSName = OS.WINDOWS
  if (userAgentIs('Mac')) OSName = OS.OSX
  if (userAgentIs('Linux')) OSName = OS.LINUX

  return OSName
}

const osLocalStorageKey = 'user-os'
let userOS = OS.UNKNOWN

export const useUserOS = (): OS => {
  const [userOSState, updateUserOS] = useReducer<() => OS>(() => {
    const newValue = getUserOS()
    userOS = newValue
    return newValue
  }, userOS)

  useEffect(() => {
    const fetchedOS = getUserOS()
    userOS = fetchedOS
    updateUserOS()
    safeLocalStorage.setItem(osLocalStorageKey, fetchedOS as string)
  }, [])

  return userOSState
}
