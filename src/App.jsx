import AppContext from "@/components/App/AppContext"
import AppNavigation from "@/components/App/AppNavigation"
import Editor from "./components/Editor/Editor"
import Map from "@/components/Map/Map"

function App() {
  return (
    <AppContext>
      <div className="flex flex-col h-screen">
        <AppNavigation />
        <div className="flex flex-col-reverse w-full h-full lg:flex-row">
          <div className="flex-grow h-full shadow-lg">
            <Editor />
          </div>
          <div className="flex-none w-full h-2/3 lg:h-full lg:w-2/3">
            <Map />
          </div>
        </div>
      </div>
    </AppContext>
  )
}

export default App
