import React, { createContext, useEffect, useState } from 'react'

interface ITogglesData {
  [key: string]: {
    texts: string[]
    checkedInd: number
    parentText: string | null
  }
}

interface ITogglesContext {
  addNewToggle?: (
    id: string,
    texts: string[],
    parentText: string | null
  ) => void
  updateToggleInd?: (id: string, newInd: number) => void
  togglesData?: ITogglesData
}

export const TogglesContext = createContext<ITogglesContext>({})

const makeTextUrlFriendly = (val: string): string =>
  val.replace(/[^\w\-\._~]/g, '-').replace(/-+/g, '-')

const convertTabTextToQueryText = (
  text: string,
  parentText: string | null
): string => makeTextUrlFriendly(`${parentText ? `${parentText} ` : ''}${text}`)

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
  queryVal: string,
  parentText: string | null
): number => {
  const urlFriendlyTexts = texts.map(text =>
    convertTabTextToQueryText(text, parentText)
  )
  const index = urlFriendlyTexts.findIndex(text => queryVal.startsWith(text))
  return index > -1 ? index : 0
}

export const TogglesProvider: React.FC = ({ children }) => {
  const [togglesData, setTogglesData] = useState({})
  const [lastSelectedTab, setLastSelectedTab] = useState<null | string>(null)

  useEffect(() => {
    const tab = getUrlQueryVal(window.location.search, 'tab')
    setLastSelectedTab(tab)
  }, [])

  const addNewToggle = (
    id: string,
    texts: string[],
    parentText: string | null
  ): void => {
    let lastSelected = lastSelectedTab
    const togglesDataCopy: ITogglesData = { ...togglesData }

    if (lastSelected === null) {
      lastSelected = getUrlQueryVal(window.location.search, 'tab')
    }

    togglesDataCopy[id] = {
      texts,
      checkedInd: getSelectedIndexBasedOffQueryVal(
        texts,
        lastSelected,
        parentText
      ),
      parentText
    }
    setTogglesData(togglesDataCopy)
  }

  const updateToggleInd = (id: string, newInd: number): void => {
    const togglesDataCopy: ITogglesData = { ...togglesData }
    const selectedTabText = togglesDataCopy[id].texts[newInd]
    togglesDataCopy[id] = { ...togglesDataCopy[id], checkedInd: newInd }

    setUrlQuery(
      window.location.href,
      'tab',
      convertTabTextToQueryText(selectedTabText, togglesDataCopy[id].parentText)
    )
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
