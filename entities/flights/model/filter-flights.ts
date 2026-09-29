import type { Flight } from './types'

export type FlightFilterState = {
    altitude: { minH: number; maxH: number } | null
    velocity: { minV: number; maxV: number } | null
    country: string
    onGround: boolean
}

export function filterFlights(flights: Flight[], filter: FlightFilterState): Flight[] {
    const { altitude, velocity, country, onGround } = filter

    return flights.filter((f) => {
        if (altitude) {
            if (f.baro_altitude == null) return false
            if (f.baro_altitude < altitude.minH || f.baro_altitude > altitude.maxH) return false
        }
        if (velocity) {
            if (f.velocity == null) return false
            if (f.velocity < velocity.minV || f.velocity > velocity.maxV) return false
        }
        if (country !== 'all' && f.origin_country !== country) return false
        if (f.on_ground !== onGround) return false
        return true
    })
}