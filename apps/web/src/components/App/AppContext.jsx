import AppStateContext from "@/state/AppStateContext"
import useApi from "@/hooks/useApi"
import { useState } from "react"

export default function AppContext({ children }) {
  const [query, setQuery] = useState("")
  const [excluded, setExcluded] = useState([])
  const { data, isLoading, error } = useApi({ query, excluded })

  return (
    <AppStateContext.Provider
      value={{ query, setQuery, excluded, setExcluded, data, isLoading, error }}
    >
      {children}
    </AppStateContext.Provider>
  )
}
