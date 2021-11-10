import React, { createContext, useEffect, useState } from 'react'

interface ITogglesData {
  [key: string]: { texts: string[]; checkedInd: number }
}

interface ITogglesContext {
  addNewToggle?: (id: string, texts: string[]) => void
  updateToggleInd?: (id: string, newInd: number) => void
  togglesData?: ITogglesData
}

export const TogglesContext = createContext<ITogglesContext>({})

const makeTextUrlFriendly = (val: string): string =>
  val.replace(/[^\w\-\._~]/g, '-').replace(/-+/g, '-')

const getUrlQueryVal = (query: string, param: string): string => {
  const params = new URLSearchParams(query)
  return params.get(param) || ''
}

const setUrlQuery = (href: string, param: string, value: string): void => {
  const formattedVal = makeTextUrlFriendly(value)
  const url = new URL(href)
  url.searchParams.set(param, formattedVal)
  window.history.pushState({}, '', url.href)
}

const getSelectedIndexBasedOffQueryVal = (
  texts: string[],
  queryVal: string
): number => {
  const urlFriendlyTexts = texts.map(makeTextUrlFriendly)
  const index = urlFriendlyTexts.indexOf(queryVal)
  return index > -1 ? index : 0
}

export const TogglesProvider: React.FC = ({ children }) => {
  const [togglesData, setTogglesData] = useState({})
  const [lastSelectedTab, setLastSelectedTab] = useState<null | string>(null)

  useEffect(() => {
    const tab = getUrlQueryVal(window.location.search, 'tab')
    setLastSelectedTab(tab)
  }, [])

  const addNewToggle = (id: string, texts: string[]): void => {
    let lastSelected = lastSelectedTab
    const togglesDataCopy: ITogglesData = { ...togglesData }

    if (lastSelected === null) {
      lastSelected = getUrlQueryVal(window.location.search, 'tab')
    }

    togglesDataCopy[id] = {
      texts,
      checkedInd: getSelectedIndexBasedOffQueryVal(texts, lastSelected)
    }
    setTogglesData(togglesDataCopy)
  }

  const updateToggleInd = (id: string, newInd: number): void => {
    const togglesDataCopy: ITogglesData = { ...togglesData }
    const selectedTabText = togglesDataCopy[id].texts[newInd]
    togglesDataCopy[id] = { ...togglesDataCopy[id], checkedInd: newInd }

    for (const [toggleId, { texts }] of Object.entries(togglesDataCopy)) {
      if (texts.includes(selectedTabText)) {
        togglesDataCopy[toggleId] = {
          ...togglesDataCopy[toggleId],
          checkedInd: togglesDataCopy[id].texts.indexOf(selectedTabText)
        }
      }
    }

    setUrlQuery(window.location.href, 'tab', selectedTabText)
    setLastSelectedTab(selectedTabText)
    setTogglesData(togglesDataCopy)
  }

  return (
    <TogglesContext.Provider
      value={{ addNewToggle, updateToggleInd, togglesData }}
    >
      {children}
    </TogglesContext.Provider>
  )
}
