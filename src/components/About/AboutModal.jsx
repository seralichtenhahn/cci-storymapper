import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"

import IconClose from "@/components/Icons/IconClose"
import imageUrl from "@/assets/images/me.jpg"

export default function AboutModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function locationHashChanged() {
      if (location.hash === "#about") {
        setIsOpen(true)
        return
      }

      setIsOpen(false)
    }

    locationHashChanged()
    window.addEventListener("hashchange", locationHashChanged)

    return () => {
      window.removeEventListener("hashchange", locationHashChanged)
    }
  }, [])

  function closeModal() {
    setIsOpen(false)
    location.hash = ""
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-primary-500/40 backdrop-blur-sm" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative inline-block w-full max-w-screen-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <button
                  onClick={closeModal}
                  className="absolute text-gray-500 top-2 right-2"
                >
                  <span className="sr-only">back to main content</span>
                  <IconClose className="w-6 h-6" />
                </button>
                <div className="md:grid md:grid-cols-3">
                  <img
                    src={imageUrl}
                    alt="Me"
                    className="object-cover w-full h-48 md:h-full "
                  />
                  <div className="flex flex-col justify-center flex-1 col-span-2 p-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 text-gray-500"
                    >
                      About me{" "}
                      <span className="block text-2xl font-medium text-gray-900">
                        Hi, I'm Serafin
                      </span>
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-gray-500">
                        I'm a creative developer based in London. Currently, I'm
                        studying creative Computing at the Creative Computing
                        Institute. Storymapper is a tool for extracting
                        visualizing places and routes from text and displaying
                        them on a map. Let me know your thoughts!
                      </p>
                    </div>

                    <div className="mt-4">
                      <a
                        href="https://twitter.com/seralichtenhahn"
                        target="_blank"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={closeModal}
                      >
                        @seralichtenhahn on Twitter
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
