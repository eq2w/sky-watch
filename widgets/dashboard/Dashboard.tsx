'use client'

import { useEffect, useState } from "react";
import Map from "@/widgets/ui/map/Map";
import { AirportsLayer } from "../ui/map/AirportsLayer";
import { AircraftLayer } from "../ui/map/AircraftsLayer";
import { YMapLocation } from "@yandex/ymaps3-types/imperative/YMap";
import { SelectedObjectLayer } from "../ui/map/SelectedObjectLayer";
import { TrackLayer } from "../ui/map/TrackLayer";
import { useMapCamera } from "@/features/map-camera";
import { ErrorToast } from "../ui/ErrorToast/ErrorToast";
import FlightFilter from "@/features/flight-filter";
import ObjectDetail from "@/features/object-detail";
import FlightList from "@/features/flight-list";
import Header from "@/widgets/ui/header/Header";
import { useSelectionObject } from "@/features/object-selection";


const initial: YMapLocation = ({ center: [37.588144, 55.733842], zoom: 6 })

type Tab = 'Map' | 'Filter' | 'Details' | 'List'

const tabs: { id: Tab; label: string }[] = [
    { id: 'Map', label: 'Карта' },
    { id: 'Filter', label: 'Фильтры' },
    { id: 'Details', label: 'Детали' },
    { id: 'List', label: 'Список' },
  ]
const mapLayers = (
    <>
        <AirportsLayer source={'airports'} />
        <AircraftLayer source={'aircrafts'} />
        <TrackLayer />
        <SelectedObjectLayer source={'selectedObject'} />
    </>
)

export default function Dashboard() {
    const [tabMobile, setTabMobile] = useState<{ current: Tab, previous: Tab }>({
        current: 'Map',
        previous: 'Map'
    })
    const flyTo = useMapCamera((state) => state.flyTo)

    useEffect(() => {
        if (!navigator.geolocation) return
        navigator.geolocation.getCurrentPosition((pos) => {
            flyTo([pos.coords.longitude, pos.coords.latitude], 6)
        })
    }, [flyTo])

    useEffect(() => {
        return useSelectionObject.subscribe((state, prev) => {
            if (state.selectedObject.id === prev.selectedObject.id) return
            setTabMobile((tab) => {
                if (tab.current === 'Map') return tab
                if (!state.selectedObject.id) {
                    return { current: tab.previous, previous: tab.current }
                }
                return { current: 'Details', previous: tab.current }
            })
        })
    }, [])

    return (
        <>
            <ErrorToast />
            <Header className="mb-0 mx-4 mt-4" />
            <main className="flex flex-1 flex-col w-full min-h-0 min-w-0 gap-4 p-4 overflow-hidden">
                <div className="grid flex-2 min-h-0 min-w-0 gap-4
                grid-cols-1
                grid-rows-1
                relative
                lg:grid-cols-[minmax(0,300px)_minmax(600px,1fr)_minmax(0,300px)] lg:gap-6
                lg:grid-rows-[minmax(0,2fr)_minmax(0,1fr)]
                ">
                    <FlightFilter className={`flex ${tabMobile.current === 'Filter' ? '' : 'hidden'} lg:flex lg:relative absolute inset-0 z-50`} />
                    <Map location={initial} className="min-h-0 min-w-0 w-full h-full z-10 ">
                        {mapLayers}
                    </Map>
                    <ObjectDetail className={`flex flex-col ${tabMobile.current === 'Details' ? '' : 'hidden'} lg:flex absolute lg:static inset-0 z-50`} />
                    <FlightList className={`flex ${tabMobile.current === 'List' ? '' : 'hidden'} lg:col-span-3 lg:flex absolute lg:static inset-0 z-50`} />
                </div>
                <div className="flex relative bg-surface border border-border rounded-2xl w-full min-h-0 min-w-0 lg:hidden">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setTabMobile((prev) => ({ current: tab.id, previous: prev.current }))}
                            className={`ui-btn flex flex-row w-full min-h-0 active:bg-primary/30 hover:bg-primary/10 min-w-0 p-2 z-1 bg-transparent border-none h-full`}>
                            {tab.label}
                        </button>
                    ))}
                    <div className="h-full absolute top-0 left-0 bg-primary rounded-2xl transition-transform duration-300 ease-in-out"
                        style={{
                            width: `${100 / tabs.length}%`,
                            transform: `translateX(${tabMobile.current === 'Map' ? '0%' : tabMobile.current === 'Filter' ? '100%' : tabMobile.current === 'Details' ? '200%' : '300%'})`
                        }}
                    >
                    </div>
                </div>

            </main>
        </>
    );
}
