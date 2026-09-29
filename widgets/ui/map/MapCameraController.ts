import { useMapCamera } from "@/features/map-camera";
import { useSelectionObject } from "@/features/object-selection";
import { YMap } from "@yandex/ymaps3-types";
import { useEffect, useRef } from "react";

export function MapCameraController({
    mapRef,
}: { mapRef: React.RefObject<YMap | null> }) {

    const didAutoZoomRef = useRef(false)
    const zoomCameraRef = useRef<number | null>(null)

    const selectedLocation = useSelectionObject(
        (state) => state.selectedObject.location
    )
    const target = useMapCamera(
        (state) => state.target
    )
    const clearTarget = useMapCamera(
        (state) => state.clearTarget
    )
    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        if (selectedLocation) {
            const isFirstSelect = zoomCameraRef.current === null

            if (isFirstSelect) {
                zoomCameraRef.current = map.zoom
                didAutoZoomRef.current = map.zoom < 7
            }

            map.update({
                location: {
                    center: selectedLocation,
                    ...(isFirstSelect && map.zoom < 7 ? { zoom: 9 } : {}),
                    duration: 500,
                    easing: 'ease-in-out',
                }
            })
            return
        }

        const zoom = zoomCameraRef.current
        const didAutoZoom = didAutoZoomRef.current

        didAutoZoomRef.current = false
        zoomCameraRef.current = null

        if (didAutoZoom && zoom !== null && Math.abs(map.zoom - 9) < 0.2) {

            map.update({
                location: {
                    zoom: zoom,
                    duration: 500,
                    easing: 'ease-in-out',
                }
            })
        }
    }, [selectedLocation, mapRef])

    useEffect(() => {
        const map = mapRef.current
        if (!target) return
        if (!map) return
        if (target.type === 'bounds') {
            map.update({
                location: { bounds: target.bounds, duration: 500, easing: 'ease-in-out' },
            })
        } else {
            map.update({
                location: {
                    center: target.center,
                    ...(target.zoom != null ? { zoom: target.zoom } : {}),
                    duration: 500,
                    easing: 'ease-in-out',
                },
            })
        }
        clearTarget()
    }, [target, mapRef, clearTarget])
    return null
}