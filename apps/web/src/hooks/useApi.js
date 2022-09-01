import useDebounce from "@/hooks/useDebounce"
import { useRef } from "react"
import useSWRImmutable from "swr/immutable"

const useApi = ({ query, excluded }) => {
  const debouncedQuery = useDebounce(query, 1000)
  const lastResponse = useRef([])

  const body = JSON.stringify({
    query: debouncedQuery,
    excluded,
  })

  const { data, error, isValidating } = useSWRImmutable(
    debouncedQuery ? body : null,
    (body) =>
      fetch(`${import.meta.env.VITE_API_URL}/parser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body,
      }).then((res) => res.json()),
    {
      errorRetryInterval: 100,
      errorRetryCount: 2,
      loadingTimeout: 1000 * 30,
    },
  )

  if (data?.length > 0) {
    lastResponse.current = data
  }

  return {
    data: data ?? lastResponse.current,
    error,
    isLoading: isValidating,
  }
}

export default useApi
