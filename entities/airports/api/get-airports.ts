
import type { Airport, AirportArrivals } from '../model/types'

export async function getAirports(): Promise<Airport[]> {
    const response = await fetch('/airport.json')
    if (!response.ok) {
        throw new Error('Failed to load airports')
    }
    return response.json()
}

export async function getAirportArrivals(airport: string): Promise<AirportArrivals> {
    const end = Math.floor(Date.now() / 1000)
    const begin = end - 86400
    const qs = new URLSearchParams({ airport, begin: String(begin), end: String(end) })
    const response = await fetch(`/api/flights/arrival?${qs}`)
    if (!response.ok) {
        throw new Error('Ошибка загрузки прибытий')
    }
    return response.json()
}


export async function getAirportDepartures(airport: string): Promise<AirportArrivals> {
    const end = Math.floor(Date.now() / 1000)
    const begin = end - 86400
    const qs = new URLSearchParams({ airport, begin: String(begin), end: String(end) })
    const response = await fetch(`/api/flights/departure?${qs}`)
    if (!response.ok) {
        throw new Error('Ошибка загрузки отправлений')
    }
    return response.json()
}

