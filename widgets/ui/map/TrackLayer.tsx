'use client'
import { getTrackFlight } from "@/entities/flights/api/get-flights";
import { useSelectionObject } from "@/features/object-selection";
import { useYMap } from "@/shared/lib/yandex-maps/useYMap";
import { useQuery } from "@tanstack/react-query";
import { LngLat } from "@yandex/ymaps3-types";



export const TrackLayer = () => {
    const api = useYMap()

    const selectedAircraft = useSelectionObject(
        (state) => state.selectedObject
    )



    const { data } = useQuery({
        queryKey: ['flight-track', selectedAircraft.id],
        queryFn: () => getTrackFlight(selectedAircraft.id!),
        retry: false,
        enabled: !!selectedAircraft.id && selectedAircraft.type === 'aircraft',
    })


    if (!api || !data?.path.length) return null

    const coordinates: LngLat[] = data.path.flatMap((point) =>
        point.latitude != null && point.longitude != null
            ? [[point.longitude, point.latitude] as LngLat]
            : [],
    )
    if (coordinates.length < 2) return null

    const { YMapFeature } = api
    return (
        <>

            <YMapFeature geometry={{
                type: 'LineString',
                coordinates
            }}
                style={{ stroke: [{ color: 'red', width: 2 }] }} />
        </>
    )

}