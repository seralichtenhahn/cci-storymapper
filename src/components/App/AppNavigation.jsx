import React from "react"

export default function AppNavigation() {
  return (
    <nav className="flex items-center justify-between max-w-screen-lg p-4 mx-auto">
      <a
        className="inline-flex items-center justify-center py-2 px-4 bg-gray-100 rounded-lg"
        href="/"
      >
        StoryMapper
      </a>

      <ul className="flex items-center space-x-2 text-sm font-medium text-gray-500">
        <li className="hidden lg:block">
          <a className="px-3 py-2 rounded-lg" href="/">
            {" "}
            Home{" "}
          </a>
        </li>

        <li>
          <a className="px-3 py-2 rounded-lg" href="">
            {" "}
            Projects{" "}
          </a>
        </li>
        <li>
          <a
            className="inline-flex items-center px-3 py-2 rounded-lg"
            href=""
            target="_blank"
          >
            External
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="ml-1.5 w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              ></path>
            </svg>
          </a>
        </li>
      </ul>
    </nav>
  )
}
