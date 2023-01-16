import { Editable, Slate, withReact } from "slate-react"
import { Node, Text, createEditor } from "slate"
import React, { useCallback, useMemo, useTransition } from "react"

import IconDelete from "@/components/Icons/IconDelete"
import Tippy from "@tippyjs/react"
import clsx from "clsx"
import useAppState from "@/hooks/useAppState"

const serialize = (nodes) => {
  return nodes.map((n) => Node.string(n)).join("\n")
}

export default function Editor() {
  const [, startTransition] = useTransition()
  const editor = useMemo(() => withReact(createEditor()), [])
  const initialValue = useMemo(
    () => [
      {
        type: "paragraph",
        children: [{ type: "text", text: "" }],
      },
    ],
    [],
  )
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])

  const { setQuery, isLoading, data, query } = useAppState()

  const decorate = useCallback(
    ([node, path]) => {
      const ranges = []

      if (!data || data.length === 0) {
        return ranges
      }

      if (Text.isText(node)) {
        const { text } = node

        data.forEach((result) => {
          const { query, type } = result

          const index = text.toLowerCase().indexOf(query.toLowerCase())
          if (index !== -1) {
            ranges.push({
              anchor: { path, offset: index },
              focus: { path, offset: index + query.length },
              highlight: type,
              query,
            })
          }
        })
      }

      return ranges
    },
    [data],
  )

  return (
    <div className="flex flex-col h-full p-2 space-y-2 bg-white shadow-lg">
      <h2 className="px-2 font-bold text-gray-900 lg:mt-4">Your Story</h2>
      <Slate
        editor={editor}
        value={initialValue}
        onChange={(v) => {
          startTransition(() => {
            setQuery(serialize(v))
          })
        }}
      >
        <Editable
          decorate={decorate}
          renderLeaf={renderLeaf}
          spellCheck
          autoFocus
          placeholder="Once upon a time in Hollywood..."
          className="flex-1 p-2 overflow-auto leading-relaxed"
        />
      </Slate>
      <div className="flex justify-between px-4 py-1 text-sm font-bold tracking-wider text-blue-500 uppercase bg-blue-100 rounded-full justify-self-end">
        <span>{query.length}/2000</span>
        <span>{isLoading ? "Loading..." : "Saved"}</span>
      </div>
    </div>
  )
}

const Leaf = ({ attributes, children, leaf }) => {
  const { excludePlace } = useAppState()
  const classes = "transition-colors duration-200"

  if (!leaf.highlight) {
    return (
      <span {...attributes} className={classes}>
        {children}
      </span>
    )
  }

  return (
    <Tippy
      interactive
      placement="bottom"
      content={
        <div className="text-sm" contentEditable={false}>
          <button
            onClick={() => excludePlace(leaf.query)}
            className="flex items-center"
          >
            <IconDelete className="w-3 h-3 mr-2" />
            <span>Remove from map</span>
          </button>
        </div>
      }
    >
      <button
        type="button"
        {...attributes}
        className={clsx(
          "focus:outline-none rounded relative -mx-0.5 px-0.5 after:absolute after:rounded-full after:w-2 after:h-2 after:bg-blue-600 after:top-[-3px] after:right-[-3px]",
          classes,
          leaf.highlight === "city" && "bg-blue-300",
          leaf.highlight === "country" && "bg-blue-300",
          leaf.highlight === "region" && "bg-blue-300",
          leaf.highlight === "location" && "bg-blue-100",
          leaf.highlight === "facility" && "bg-blue-100",
        )}
      >
        {children}
      </button>
    </Tippy>
  )
}
