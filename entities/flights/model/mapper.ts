import { Flight, FlightRaw, Track, TrackRaw } from "./types";


export function mapFlight(raw: FlightRaw): Flight {
    return {
        icao24: raw[0],
        callsign: raw[1],
        origin_country: raw[2],
        time_position: raw[3],
        last_contact: raw[4],
        longitude: raw[5],
        latitude: raw[6],
        baro_altitude: raw[7],
        on_ground: raw[8],
        velocity: raw[9] != null ? raw[9] * 3.6 : null,
        true_track: raw[10],
        vertical_rate: raw[11],
        sensors: raw[12],
        geo_altitude: raw[13],
        squawk: raw[14],
        spi: raw[15],
        position_source: raw[16],
        category: raw[17],
    };
}

export function mapTrack(raw: TrackRaw): Track {
    return {
        icao24: raw.icao24,
        startTime: raw.startTime,
        endTime: raw.endTime,
        callsign: raw.callsign,
        path: raw.path.map((point) => ({
            time: point[0],
            latitude: point[1],
            longitude: point[2],
            baro_altitude: point[3],
            true_track: point[4],
            on_ground: point[5],
        })),
    }
}