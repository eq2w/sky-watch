'use client'

import { useCallback, useMemo } from "react"
import type { LngLat } from "@yandex/ymaps3-types"
import type { Feature } from "@yandex/ymaps3-clusterer";
import { useQuery } from "@tanstack/react-query";
import { getAirports } from "@/entities/airports/api/get-airports";
import { Airport } from "@/entities/airports/model/types";
import { AirportIcon } from "@/shared/ui/icon/AirportIcon";
import { useSelectionObject } from "@/features/object-selection";
import { useSelectionFilter } from "@/features/filter-selection";
import { useYMap } from "@/shared/lib/yandex-maps/useYMap";
import { useMapCamera } from "@/features/map-camera";

type AirportsLayer = {
    source: string
}


export const AirportsLayer = ({ source }: AirportsLayer) => {
   
    const selectedFilter = useSelectionFilter(
        (state) => state.selectedFilter
    )

    const api = useYMap()
    const zoom = useMapCamera((state) => state.zoom)

    const airportsQuery = useQuery({
        queryKey: ['airports'],
        queryFn: getAirports,
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: Infinity,
    })
    const setSelectedAirport = useSelectionObject(
        (state) => state.setSelectedObject
    )

    const points = useMemo(() => {
        if (!airportsQuery.data) return [];
        return airportsQuery.data.map((airport: Airport) => ({
            type: 'Feature' as const,
            id: airport.ident,
            geometry: { type: 'Point' as const, coordinates: [airport.longitude, airport.latitude] as LngLat },
            properties: { name: airport.name },
        }))
    }, [airportsQuery.data])


    const gridSizeMethod = useMemo(() => api?.clusterByGrid({ gridSize: 50 }), [api])
    const marker = useCallback((feature: Feature) => {
        if (!api) return <></>
        const { YMapMarker } = api
        return (
            < YMapMarker coordinates={feature.geometry.coordinates} source={source} onClick={() => {
                setSelectedAirport({ id: feature.id, location: feature.geometry.coordinates, type: 'airport', angle: null })
            }} >
                <div className="group relative cursor-pointer" >
                    <span className="hidden group-hover:block absolute left-1/2 bottom-full border border-border min-w-28 max-w-56 whitespace-normal w-max rounded-xl p-2 bg-background z-10 text-text-primary -translate-1/2">{String(feature.properties?.name)}</span>
                    <AirportIcon className="-translate-1/2 text-warning w-4 h-4" />
                </div>
            </YMapMarker >)
    }, [api])

    const cluster = useCallback((coordinates: LngLat) => {
        if (!api) return <></>
        const { YMapMarker } = api
        return (
            <YMapMarker coordinates={coordinates} source={source}   >
            </YMapMarker>)
    }, [])


    if (!api || !gridSizeMethod || points.length === 0 || !selectedFilter.showAirports || zoom === null || zoom < 8) return null
    const { YMapClusterer, YMapFeatureDataSource, YMapLayer } = api

    return (
        <>
            <YMapFeatureDataSource id={source} />
            <YMapLayer source={source} type="markers" zIndex={1500} />
            <YMapClusterer marker={marker} cluster={cluster} method={gridSizeMethod} features={points} />
        </>
    )
}