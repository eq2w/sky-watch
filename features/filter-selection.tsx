import { create } from 'zustand'
type FilterStore = {
    selectedFilter: { altitude: { minH: number, maxH: number } | null, velocity: { minV: number, maxV: number } | null, country: string, onGround: boolean, showAirports: boolean, showAircrafts: boolean },
    setSelectedFilter: (altitude: { minH: number, maxH: number } | null, velocity: { minV: number, maxV: number } | null, country: string, onGround: boolean, showAirports: boolean, showAircrafts: boolean) => void
}

export const useSelectionFilter = create<FilterStore>((set) => ({
    selectedFilter: { altitude: null, velocity: null, country: 'all', onGround: false, showAirports: false, showAircrafts: true },
    setSelectedFilter: (altitude, velocity, country, onGround, showAirports, showAircrafts) =>
        set({ selectedFilter: { altitude, velocity, country, onGround, showAirports, showAircrafts } })
}))