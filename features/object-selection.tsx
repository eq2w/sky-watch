import { LngLat } from '@yandex/ymaps3-types'
import { create } from 'zustand'

export type SelectedObject = {
    id: string | null,
    location: LngLat | null,
    type: 'aircraft' | 'airport' | null,
    angle: number | null
}
type ObjectStore = {
    selectedObject: SelectedObject,
    setSelectedObject: (next: SelectedObject) => void
    clearSelectedObject: () => void
}
const empty: SelectedObject = {
    id: null,
    location: null,
    type: null,
    angle: null
}
export const useSelectionObject = create<ObjectStore>((set) => ({
    selectedObject: empty,
    setSelectedObject: (next) => set({ selectedObject: next }),
    clearSelectedObject: () => set({ selectedObject: empty })
}))