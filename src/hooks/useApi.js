import useDebounce from "@/hooks/useDebounce"
import useSWR from "swr"

const useApi = ({ query, excluded }) => {
  const debouncedQuery = useDebounce(query, 1000)
  const body = JSON.stringify({
    query: debouncedQuery,
    excluded,
  })
  const { data, error, isValidating } = useSWR(
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
      revalidateIfStale: false,
    },
  )

  return {
    data: data ?? [],
    error,
    isLoading: isValidating,
  }
}

export default useApi
