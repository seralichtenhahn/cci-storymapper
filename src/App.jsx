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
          <div className="h-[calc(100vh-5rem-100vw)] lg:h-full flex-1 lg:shadow-lg lg:flex-grow">
            <Editor />
          </div>
          <div className="flex-none w-full aspect-square lg:aspect-auto lg:h-full lg:w-2/3">
            <Map />
          </div>
        </div>
      </div>
      <AboutModal />
    </AppContext>
  )
}

export default App
