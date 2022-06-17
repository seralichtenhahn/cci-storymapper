import { Layer, Source } from "react-map-gl"

import useAppState from "@/hooks/useAppState"
import { useMemo } from "react"

export default function MapRoutes() {
  const { data } = useAppState()

  const places = data
    .filter((entry) => entry.lat && entry.lng)
    .filter((entry) => entry.type !== "country")

  const routeLayer = {
    type: "line",
    paint: {
      "line-color": "#1d4ed8",
      "line-width": 2,
      "line-blur": 3,
    },
  }

  return useMemo(
    () => (
      <Source
        id="routes"
        type="geojson"
        data={{
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: places.reduce((coordinates, place) => {
              return [...coordinates, [place.lng, place.lat]]
            }, []),
          },
        }}
      >
        <Layer {...routeLayer} />
      </Source>
    ),
    [data],
  )
}
