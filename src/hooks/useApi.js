import useSWR from "swr"

const useApi = ({ query }) => {
  const { data, error, isValidating } = useSWR(
    query || null,
    (query) =>
      fetch(`${import.meta.env.VITE_API_URL}/parser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          query,
        }),
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
