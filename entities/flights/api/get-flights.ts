import { mapFlight, mapTrack } from "../model/mapper"
import { Flight } from "../model/types"

export async function getTrackFlight(icao24: string) {
    const response = await fetch(
        `/api/tracks/all?icao24=${encodeURIComponent(icao24)}&time=0`
    )

    if (!response.ok) {
        throw new Error('Ошибка загрузки траектории полета')
    }
    const data = await response.json()
    return mapTrack(data)
}

export async function getFlight() {
    const response = await fetch(
        '/api/states/all'
    )

    if (!response.ok) {
        throw new Error('Ошибка загрузки списка полетов')
    }
    const data = await response.json()
    return { ...data, states: data.states.map(mapFlight).filter(isValidFlight) }
}

function isValidFlight(flight: Flight): boolean {
    return (
        flight.latitude != null &&
        flight.longitude != null
    )
}
