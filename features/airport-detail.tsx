import { getAirportArrivals, getAirportDepartures, getAirports } from "@/entities/airports/api/get-airports"
import type { AirportArrival } from "@/entities/airports/model/types"
import { AirplaneIcon } from "@/shared/ui/icon/AirplaneIcon"
import { AirportIcon } from "@/shared/ui/icon/AirportIcon"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useSelectionObject } from "./object-selection"


export type AirportDetailProps = {
    id: string | null
}
export const AirportDetail = ({ id }: AirportDetailProps) => {
    const [activeTab, setActiveTab] = useState<'arrivals' | 'departures'>('arrivals')

    const { data: airport } = useQuery({
        queryKey: ['airports'],
        queryFn: getAirports,
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: Infinity,
        select: (list) => list.find((a) => a.ident === id),
    })

    const arrivals = useQuery({
        queryKey: ['arrivals', id],
        queryFn: () => getAirportArrivals(id!),
        enabled: !!id && activeTab === 'arrivals',
    })
    const departures = useQuery({
        queryKey: ['departures', id],
        queryFn: () => getAirportDepartures(id!),
        enabled: !!id && activeTab === 'departures',
    })

    const clearSelectedObject = useSelectionObject(
        (state) => state.clearSelectedObject
    );
    if (!id) return null
    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex gap-10 items-center justify-between">
                <span className="text-lg font-bold">{airport?.ident}</span>
                <span className="text-sm text-right max-w-60 whitespace-normal">{airport?.name}</span>
            </div>
            <div className="flex flex-col gap-2 overflow-hidden">
                <div className="flex items-center justify-between w-full relative">
                    <button type="button" className="text-sm cursor-pointer font-bold text-text-secondary text-center py-2 px-1 w-full" onClick={() => setActiveTab('arrivals')}>Прибытие</button>
                    <button type="button" className="text-sm cursor-pointer font-bold text-text-secondary text-center py-2 px-1 w-full" onClick={() => setActiveTab('departures')}>Отправление</button>
                    <div className={`absolute bottom-0 left-0 w-1/2 h-0.5 bg-primary transition-transform duration-300 ease-in-out ${activeTab === 'arrivals' ? 'translate-x-0' : 'translate-x-full'}`}></div>
                </div>

                <div className="flex flex-col gap-2 overflow-y-auto max-w-full scrollbar-gutter-stable ">
                    {
                        activeTab === 'arrivals' ? (
                            arrivals.isLoading ?
                                <div className="relative flex my-4 w-full min-h-0 min-w-0 items-center justify-center overflow-hidden">
                                    <div className="flex flex-col h-full items-center gap-4 text-text-secondary">
                                        <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                                        <span className="text-sm font-medium">Загрузка данных</span>
                                    </div>
                                </div>
                                :
                                arrivals.error ?
                                    <div className="relative flex my-4 w-full min-h-0 min-w-0 items-center justify-center overflow-hidden">
                                        <div className="flex flex-col h-full items-center gap-4 text-text-secondary">
                                            <span className="text-sm font-medium">Ошибка загрузки данных</span>
                                            <button type="button" className="ui-btn ui-btn-primary mt-auto w-full p-2" onClick={() => arrivals.refetch()}>Попробовать снова</button>
                                        </div>
                                    </div>
                                    :
                                    arrivals.data?.map((arrival: AirportArrival, i) => (
                                        <div className="flex flex-col gap-2 py-2 pr-2 border-b border-border" key={i}>
                                            <span className="text-sm">{arrival.callsign}</span>
                                            <div className="flex gap-2 items-center justify-between w-full">
                                                <AirplaneIcon className="w-5 h-5 text-primary rotate-90" />
                                                <span className="text-sm text-text-secondary text-center">{arrival.estArrivalAirportHorizDistance ? Math.fround(arrival.estArrivalAirportHorizDistance / 1000).toFixed(1) : ''} км</span>
                                                <AirportIcon className="w-5 h-5 text-text-secondary" />
                                            </div>
                                        </div>
                                    ))
                        ) : (
                            departures.isLoading ?
                                <div className="relative flex my-4 w-full min-h-0 min-w-0 items-center justify-center overflow-hidden">
                                    <div className="flex flex-col h-full items-center gap-4 text-text-secondary">
                                        <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                                        <span className="text-sm font-medium">Загрузка данных</span>
                                    </div>
                                </div>
                                :
                                departures.error ?
                                    <div className="relative flex my-4 w-full min-h-0 min-w-0 items-center justify-center overflow-hidden">
                                        <div className="flex flex-col h-full items-center gap-4 text-text-secondary">
                                            <span className="text-sm font-medium">Ошибка загрузки данных</span>
                                            <button type="button" className="ui-btn ui-btn-primary mt-auto w-full p-2" onClick={() => departures.refetch()}>Попробовать снова</button>
                                        </div>
                                    </div>
                                    :
                                    departures.data?.map((departure: AirportArrival, i) => (
                                        <div className="flex flex-col gap-2 py-2 pr-2 border-b border-border" key={i}>
                                            <span className="text-sm">{departure.callsign}</span>
                                            <div className="flex gap-2 items-center justify-between w-full">
                                                <AirportIcon className="w-5 h-5 text-text-secondary" />
                                                <span className="text-sm text-text-secondary text-center">{departure.estDepartureAirportHorizDistance ? Math.fround(departure.estDepartureAirportHorizDistance / 1000).toFixed(1) : ''} км</span>
                                                <AirplaneIcon className="w-5 h-5 text-primary rotate-90" />
                                            </div>
                                        </div>
                                    ))
                        )
                    }
                </div>
            </div>
            <button type="button" className="ui-btn ui-btn-primary mt-auto w-full p-2" onClick={() => clearSelectedObject()}>Закрыть</button>
        </div>
    )
}