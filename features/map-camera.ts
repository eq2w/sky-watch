import type { LngLat, LngLatBounds } from '@yandex/ymaps3-types'
import { create } from 'zustand'

type CameraTarget =
    | { type: 'bounds'; bounds: LngLatBounds }
    | { type: 'center'; center: LngLat; zoom?: number }
    | null

type MapCameraStore = {
    target: CameraTarget
    fitBounds: (bounds: LngLatBounds) => void
    flyTo: (center: LngLat, zoom?: number) => void
    clearTarget: () => void,
    zoom: number | null,
    setZoom: (zoom: number) => void
}

export const useMapCamera = create<MapCameraStore>((set) => ({
    target: null,
    fitBounds: (bounds) => set({ target: { type: 'bounds', bounds } }),
    flyTo: (center, zoom) => set({ target: { type: 'center', center, zoom } }),
    clearTarget: () => set({ target: null }),
    zoom: null,
    setZoom: (zoom) => set({ zoom }),

}))