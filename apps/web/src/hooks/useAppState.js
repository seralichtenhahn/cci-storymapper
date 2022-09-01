import { useCallback, useContext } from "react"

import AppStateContext from "@/state/AppStateContext"

const useAppState = () => {
  const appState = useContext(AppStateContext)

  const excludePlace = useCallback((place) => {
    appState.setExcluded((excluded) => [...excluded, place])
  }, [])

  return {
    ...appState,
    excludePlace,
  }
}

export default useAppState
