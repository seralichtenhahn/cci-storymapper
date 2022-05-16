import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl"

import WebMercatorViewport from "@math.gl/web-mercator"
import mapboxgl from "mapbox-gl"
import useAppState from "@/hooks/useAppState"

export default function Map() {
  const container = useRef()
  const { data } = useAppState()

  const [viewport, setViewport] = useState({
    position: [0, 0, 0],
  })

  useEffect(() => {
    if (data.length === 0) {
      return
    }

    const bounds = new mapboxgl.LngLatBounds()
    data.forEach((marker) => bounds.extend([marker.lng, marker.lat]))

    const { latitude, longitude, zoom } = new WebMercatorViewport({
      width: container.current.clientWidth,
      height: container.current.clientHeight,
      ...viewport,
    }).fitBounds(bounds.toArray(), {
      padding: 100,
      maxZoom: 10,
    })

    setViewport({
      ...viewport,
      latitude,
      longitude,
      zoom,
    })
  }, [data])

  return (
    <div ref={container} className="w-full h-full overflow-hidden">
      <ReactMapGL
        {...viewport}
        style={{ width: "100%", height: "100%" }}
        onMove={(evt) => setViewport(evt.viewState)}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
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
