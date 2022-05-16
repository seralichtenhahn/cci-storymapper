import { createContext } from "react"

export const defaultState = {
  isLoading: false,
}

const AppStateContext = createContext(defaultState)

export default AppStateContext
