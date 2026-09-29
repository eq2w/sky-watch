export type FlightRaw = [
    string,
    string | null,
    string,
    number | null,
    number,
    number | null,
    number | null,
    number | null,
    boolean,
    number | null,
    number | null,
    number | null,
    number[],
    number | null,
    string | null,
    boolean,
    number,
    number,
]


export type Flight = {
    icao24: string,
    callsign: string | null,
    origin_country: string,
    time_position: number | null,
    last_contact: number,
    longitude: number | null,
    latitude: number | null,
    baro_altitude: number | null,
    on_ground: boolean,
    velocity: number | null,
    true_track: number | null,
    vertical_rate: number | null,
    sensors: number[],
    geo_altitude: number | null,
    squawk: string | null,
    spi: boolean,
    position_source: number,
    category: number,
}

export type Flights = {
    time: string,
    states: Flight[],
}

export type TrackRaw = {
    icao24: string,
    startTime: number,
    endTime: number,
    callsign: string,
    path: PointRaw[],
}

export type PointRaw = [
    number,
    number | null,
    number | null,
    number | null,
    number | null,
    boolean,
]

export type Track = {
    icao24: string,
    startTime: number,
    endTime: number,
    callsign: string,
    path: Point[],
}

export type Point = {
    time: number,
    latitude: number | null,
    longitude: number | null,
    baro_altitude: number | null,
    true_track: number | null,
    on_ground: boolean,
}