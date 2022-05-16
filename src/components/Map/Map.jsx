import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl"

import IconExternal from "@/components/Icons/IconExternal"
import IconMarker from "@/components/Icons/IconMarker"
import Tippy from "@tippyjs/react"
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
    data
      .filter((marker) => marker.lat && marker.lng)
      .forEach((marker) => bounds.extend([marker.lng, marker.lat]))

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
        {data
          .filter((marker) => marker.lat && marker.lng)
          .map((marker) => {
            const { lat, lng, name } = marker

            return (
              <Marker key={name} longitude={lng} latitude={lat} anchor="bottom">
                <Tippy
                  content={
                    <p className="flex items-center gap-2 w-max">
                      <span>{name}</span>
                      {marker.properties?.wikidata && (
                        <a
                          href={`https://www.wikidata.org/wiki/${marker.properties.wikidata}`}
                          title="Wikidata"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconExternal className="w-3 h-3" />
                        </a>
                      )}
                    </p>
                  }
                  placement="right"
                  interactive={true}
                  visible={true}
                  moveTransition="transform 100ms ease-out"
                  maxWidth="none"
                  popperOptions={{
                    strategy: "fixed",
                    modifiers: [
                      {
                        name: "flip",
                        options: {
                          fallbackPlacements: [
                            "bottom",
                            "right",
                            "top",
                            "left",
                          ],
                        },
                      },
                      {
                        name: "preventOverflow",
                        options: {
                          altAxis: true,
                          tether: false,
                        },
                      },
                    ],
                  }}
                >
                  <button>
                    <IconMarker className="w-6 h-6" />
                  </button>
                </Tippy>
              </Marker>
            )
          })}
        <NavigationControl showCompass={false} className="bottom-8 right-8" />
      </ReactMapGL>
    </div>
  )
}
