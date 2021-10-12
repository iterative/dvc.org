import React, { createContext, useState } from 'react'

interface ITogglesData {
  [key: string]: { texts: string[]; checkedInd: number }
}

interface ITogglesContext {
  addNewToggle?: (id: string, texts: string[]) => void
  updateToggleInd?: (id: string, newInd: number) => void
  togglesData?: ITogglesData
}

export const TogglesContext = createContext<ITogglesContext>({})

export const TogglesProvider: React.FC = ({ children }) => {
  const [togglesData, setTogglesData] = useState({})

  const addNewToggle = (id: string, texts: string[]): void => {
    const togglesDataCopy: ITogglesData = { ...togglesData }
    togglesDataCopy[id] = { texts, checkedInd: 0 }
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
