import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl"

import WebMercatorViewport from "@math.gl/web-mercator"
import mapboxgl from "mapbox-gl"

export default function Map({ data }) {
  const ref = useRef()
  const isSizeSet = useRef(false)

  const [viewport, setViewport] = useState({
    width: ref.current?.offsetWidth ?? 0,
    height: ref.current?.offsetHeight ?? 0,
    position: [0, 0, 0],
  })

  // set size of map
  useEffect(() => {
    setViewport((v) => ({
      ...v,
      width: ref.current?.offsetWidth ?? 0,
      height: ref.current?.offsetHeight ?? 0,
    }))

    isSizeSet.current = true
  }, [ref])

  useEffect(() => {
    console.log({ viewport })
    if (data.length === 0 || !isSizeSet.current) {
      return
    }

    const bounds = new mapboxgl.LngLatBounds()
    data.forEach((marker) => bounds.extend([marker.lng, marker.lat]))

    const { latitude, longitude, zoom } = new WebMercatorViewport(
      viewport,
    ).fitBounds(bounds.toArray(), {
      padding: 100,
      maxZoom: 10,
    })

    setViewport({
      ...viewport,
      latitude,
      longitude,
      zoom,
    })
  }, [data, isSizeSet])

  return (
    <div
      ref={ref}
      className="aspect-video lg:aspect-[4/5] overflow-hidden rounded-lg"
    >
      <ReactMapGL
        {...viewport}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        onViewportChange={setViewport}
        scrollZoom={false}
        attributionControl={false}
        mapStyle="mapbox://styles/seralichtenhahn/cl2n8c5lx005714l40jxdibql"
      >
        {data.map((marker) => {
          const { lat, lng, name } = marker
          return (
            <Marker key={name} longitude={lng} latitude={lat} anchor="bottom">
              <div className="w-6 h-6 rounded-full bg-sky-800"></div>
            </Marker>
          )
        })}
        <NavigationControl showCompass={false} className="bottom-8 right-8" />
      </ReactMapGL>
    </div>
  )
}
