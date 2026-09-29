'use client'
import { useCallback, useMemo } from "react"
import type { LngLat } from "@yandex/ymaps3-types"
import { type Feature } from "@yandex/ymaps3-clusterer";
import { useSelectionObject } from "@/features/object-selection";
import { AirplaneIcon } from "@/shared/ui/icon/AirplaneIcon";
import { useSelectionFilter } from "@/features/filter-selection";
import { filterFlights } from "@/entities/flights/model/filter-flights";
import { useYMap } from "@/shared/lib/yandex-maps/useYMap";
import { useFlightsQuery } from "@/entities/flights/api/use-flights-query";
import { getBounds } from "@/shared/lib/yandex-maps/getBounds";
import { useMapCamera } from "@/features/map-camera";
import { clusterByDistance } from "./ClusterByDistance";

type AircraftLayer = {
    source: string
}


export const AircraftLayer = ({ source }: AircraftLayer) => {

    const api = useYMap()

    const { data } = useFlightsQuery()
    const flights = data?.states

    const setSelectedAircraft = useSelectionObject(
        (state) => state.setSelectedObject
    );
    const selectedFilter = useSelectionFilter(
        (state) => state.selectedFilter
    )
    const fitBounds = useMapCamera(
        (state) => state.fitBounds
    )
    const points = useMemo(() => {
        if (!flights) return [];

        return filterFlights(flights, selectedFilter).map((flight) => ({
            type: 'Feature' as const,
            id: flight.icao24,
            geometry: { type: 'Point' as const, coordinates: [flight.longitude, flight.latitude] as LngLat },
            properties: { name: flight.callsign ?? 'unknown', angle: flight.true_track ?? 0 },
        }))
    }, [flights, selectedFilter])

    const gridSizeMethod = useMemo(() => clusterByDistance({ distancePx: 30 }), [])

    const marker = useCallback((feature: Feature) => {
        if (!api) return <></>
        const { YMapMarker } = api
        return (
            <YMapMarker coordinates={feature.geometry.coordinates} source={source} >
                <div onClick={() => setSelectedAircraft({ id: feature.id, location: feature.geometry.coordinates, type: 'aircraft', angle: Number(feature.properties?.angle) })} className="group relative cursor-pointer">
                    <span className="hidden group-hover:block absolute left-1/2 -top-15 border border-border rounded-xl p-2 bg-background text-text-primary -translate-1/2">{String(feature.properties?.name)}</span>
                    <AirplaneIcon className="text-primary max-w-none w-4 h-4 " style={{ transform: `translate(-50%, -50%) rotate(${feature.properties?.angle}deg)` }} />
                </div>
            </YMapMarker >
        )
    }, [api])

    const cluster = useCallback((coordinates: LngLat, features: Feature[]) => {
        if (!api) return <></>
        const { YMapMarker } = api
        return (
            <YMapMarker coordinates={coordinates} source={source}  >
                <div className="group relative cursor-pointer"
                    onClick={
                        () => {
                            const bounds = getBounds(features.map(feature => feature.geometry.coordinates))
                            fitBounds(bounds)
                        }
                    }>
                    <span className="group-hover:block bg-primary-soft absolute left-1/2 -top-6 z-100 border text-center min-w-10 shadow-black/40 border-primary/40 rounded-xl p-0.5 text-text-primary -translate-1/2 text-xs">{features.length}</span>
                    <AirplaneIcon className="z-0 text-primary max-w-none w-4 h-4" style={{ transform: `translate(-50%, -50%) rotate(${features.at(0)?.properties?.angle}deg)` }} />
                </div>
            </YMapMarker>)
    }, [api, fitBounds])


    if (!api || !gridSizeMethod || points.length === 0 || !selectedFilter.showAircrafts) return null
    const { YMapClusterer, YMapFeatureDataSource, YMapLayer } = api
    return (
        <>
            <YMapFeatureDataSource id={source} />
            <YMapLayer source={source} type="markers" zIndex={1500} />
            <YMapClusterer marker={marker} cluster={cluster} method={gridSizeMethod} features={points} />
        </>
    )
}