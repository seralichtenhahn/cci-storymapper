import AppContext from "@/components/App/AppContext"
import AppNavigation from "@/components/App/AppNavigation"
import Editor from "@/components/Editor/Editor"
import Map from "@/components/Map/Map"
import AboutModal from "@/components/About/AboutModal"

function App() {
  return (
    <AppContext>
      <div className="flex flex-col h-screen">
        <AppNavigation />
        <div className="flex flex-none overflow-hidden flex-col-reverse w-full h-[calc(100vh-5rem)] lg:flex-row">
          <div className="h-1/2 lg:h-full lg:w-1/3 lg:shadow-lg">
            <Editor />
          </div>
          <div className="h-1/2 lg:h-full lg:w-2/3">
            <Map />
          </div>
        </div>
      </div>
      <AboutModal />
    </AppContext>
  )
}

export default App
