import { useEffect, useState } from "react"

import AppNavigation from "@/components/App/AppNavigation"
import Editor from "./components/Editor/Editor"
import Map from "@/components/Map/Map"
import useApi from "@/hooks/useApi"

function App() {
  const [query, setQuery] = useState("Once upon a time in Hollywood...")

  const { data, isLoading, error } = useApi({ query })

  console.log(data)

  return (
    <>
      <AppNavigation />
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 bg-sky-100 p-4 rounded-xl gap-4">
          <div className="lg:col-span-3 h-full flex flex-col min-h-[8rem]">
            <Editor onChange={setQuery} />
            <div className="flex justify-between">
              <span>{query.length}/2000</span>
              <span>{isLoading ? "Loading..." : "Saved"}</span>
            </div>
          </div>
          <div className="lg:col-span-2">
            <Map data={data} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
