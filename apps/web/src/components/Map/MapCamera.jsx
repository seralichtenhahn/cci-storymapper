import React, { useEffect } from "react"

import WebMercatorViewport from "@math.gl/web-mercator"
import mapboxgl from "mapbox-gl"
import useAppState from "@/hooks/useAppState"
import { useMap } from "react-map-gl"

export default function MapCamera({ width, height, viewport }) {
  const { current: map } = useMap()
  const { data } = useAppState()

  useEffect(() => {
    if (data.length === 0) {
      return
    }

    const bounds = new mapboxgl.LngLatBounds()
    data
      .filter((marker) => marker.lat && marker.lng)
      .forEach((marker) => bounds.extend([marker.lng, marker.lat]))

    const { latitude, longitude, zoom } = new WebMercatorViewport({
      width,
      height,
      ...viewport,
    }).fitBounds(bounds.toArray(), {
      padding: 100,
      maxZoom: 10,
    })

    map.flyTo({ center: [longitude, latitude], zoom, speed: 1 })
  }, [data])

  return null
}
