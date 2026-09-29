export type Airport = {
    ident: string,
    name: string,
    latitude: number,
    longitude: number,
}

export type Airports = Airport[]

export type AirportArrival = {
    icao24: string,
    firstSeen: number,
    estDepartureAirport: string | null,
    lastSeen: number,
    estArrivalAirport: string,
    callsign: string,
    estDepartureAirportHorizDistance: number | null,
    estDepartureAirportVertDistance: number | null,
    estArrivalAirportHorizDistance: number,
    estArrivalAirportVertDistance: number,
    departureAirportCandidatesCount: number,
    arrivalAirportCandidatesCount: number
}

export type AirportArrivals = AirportArrival[]