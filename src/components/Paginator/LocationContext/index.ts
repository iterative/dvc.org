import { createContext, useContext } from 'react'

export interface IPaginatorLocationContextValue {
  state?: {
    fromPaginator?: boolean
  }
}

export const PaginatorLocationContext = createContext<IPaginatorLocationContextValue | null>(
  null
)

export const usePaginatorContext = (): IPaginatorLocationContextValue | null =>
  useContext(PaginatorLocationContext)
