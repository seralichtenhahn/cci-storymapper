import { Editable, Slate, withReact } from "slate-react"
import { Node, createEditor } from "slate"
import React, { useCallback, useMemo } from "react"

import { debounce } from "lodash"

const serialize = (nodes) => {
  return nodes.map((n) => Node.string(n)).join("\n")
}

export default function Editor({ onChange }) {
  const editor = useMemo(() => withReact(createEditor()), [])

  const initialValue = [
    {
      type: "paragraph",
      children: [{ type: "text", text: "" }],
    },
  ]

  const debouncedOnChange = useCallback(
    debounce((value) => {
      onChange(serialize(value))
    }, 1000), // wait 1s before invoking onChange
    [onChange],
  )

  return (
    <Slate editor={editor} value={initialValue} onChange={debouncedOnChange}>
      <Editable
        placeholder="Once upon a time in Hollywood..."
        className="border-2 border-slate-700 rounded-lg flex-1 p-2"
      />
    </Slate>
  )
}
