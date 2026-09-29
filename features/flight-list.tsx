'use client'
import { Flight } from "@/entities/flights/model/types"
import { ArrowIcon } from "@/shared/ui/icon/ArrowIcon";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import ReactCountryFlag from "react-country-flag";
import { useSelectionObject } from "./object-selection";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "@/shared/lib/hooks/use-debounce";
import { SortIcon } from "@/shared/ui/icon/SortIcon";
import { getTimeAgo } from "@/shared/lib/date/get-time-ago";
import { useSelectionFilter } from "./filter-selection";
import { filterFlights } from "@/entities/flights/model/filter-flights";
import { useFlightsQuery } from "@/entities/flights/api/use-flights-query";
import { WorldIcon } from "@/shared/ui/icon/WorldIcon";
import { CloseIcon } from "@/shared/ui/icon/CloseIcon";
import { cn } from "@/shared/lib/cn";
import { SpeedIcon } from "@/shared/ui/icon/SpeedIcon";
import { MountainIcon } from "@/shared/ui/icon/MountainIcon";
import { MarkerIcon } from "@/shared/ui/icon/MarkerIcon";
import { ClockIcon } from "@/shared/ui/icon/ClockIcon";
import { AirplaneTakeOffIcon } from "@/shared/ui/icon/AirplaneTakeOffIcon";
import { AirplaneIcon } from "@/shared/ui/icon/AirplaneIcon";
import { SearchIcon } from "@/shared/ui/icon/SearchIcon";
countries.registerLocale(en)

type SortField = 'baro_altitude' | 'velocity' | 'vertical_rate'
type SortDirection = 'asc' | 'desc'
type FlightListProps = {
    className?: string
}
function FlightList({ className }: FlightListProps) {
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState<{ field: SortField | null, direction: SortDirection }>({ field: null, direction: 'asc' })
    const [searchOpen, setSearchOpen] = useState(false)
    const [sortOpen, setSortOpen] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const sortRef = useRef<HTMLDivElement>(null)
    const [width] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth : 0
    )

    useEffect(() => {
        if (!searchOpen) return

        function handlePointerDown(e: PointerEvent) {
            if (!searchRef.current?.contains(e.target as Node)) {
                setSearchOpen(false)
            }
        }
        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [searchOpen])

    useEffect(() => {
        if (!sortOpen) return

        function handlePointerDown(e: PointerEvent) {
            if (!sortRef.current?.contains(e.target as Node)) {
                setSortOpen(false)
            }
        }
        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [sortOpen])


    const setSelectedObject = useSelectionObject(
        (state) => state.setSelectedObject
    );
    const { data, isLoading } = useFlightsQuery()
    const flights: Flight[] = data?.states
    const debouncedSearch = useDebounce(search, 300)


    const selectedFilter = useSelectionFilter(
        (state) => state.selectedFilter
    )
    const filteredFlights = useMemo(() => {
        const query = debouncedSearch.trim().toLowerCase()

        let result: Flight[] = filterFlights(flights ?? [], selectedFilter)

        if (query) {
            result = result.filter(
                (flight) =>
                    flight.icao24.toLowerCase().includes(query) ||
                    flight.callsign?.toLowerCase().includes(query) ||
                    flight.origin_country?.toLowerCase().includes(query)
            )
        }

        if (sort.field) {
            const { field, direction } = sort
            result.sort((a, b) => {
                const aVal = a[field]
                const bVal = b[field]
                if (aVal === bVal) return 0
                if (aVal === null) return 1
                if (bVal === null) return -1

                return direction === 'asc' ? aVal - bVal : bVal - aVal
            })
        }
        return result.slice(0, 30)
    }, [flights, debouncedSearch, sort, selectedFilter])

    function toggleSort(field: SortField) {
        setSort((prev) => {
            if (prev.field !== field) {
                return { field, direction: 'asc' }
            }
            if (prev.direction === 'asc') {
                return { field, direction: 'desc' }
            }
            return { field: null, direction: 'asc' }
        })
    }

    function iconSort(field: SortField) {
        const active = sort.field === field
        return [
            'transition-transform',
            active ? 'text-primary' : 'text-text-muted',
            active && sort.direction === 'asc' ? 'rotate-180' : '',
        ].join(' ')
    }
    return (
        <div className={cn("py-2 px-4 flex flex-col gap-2 w-full h-full border border-border bg-surface rounded-2xl", className)}>
            <div className="flex gap-2 mb-2 lg:mb-0 justify-between items-center relative lg:static">
                <h2 className="text-md lg:text-xl font-bold text-text-primary 3xl:">Самолеты онлайн</h2>
                <div className="flex gap-2">
                    <div ref={sortRef} className="relative z-50 lg:hidden">
                        <button type="button" className={`ui-btn px-3 `} onClick={() => setSortOpen((prev) => !prev)}>
                            <SortIcon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 transition- duration-300 ease-in-out ${sort.field !== null ? 'text-primary' : 'text-text-muted'}  ${sort.field !== null && sort.direction === 'asc' ? 'rotate-180' : 'rotate-0'}`} />
                        </button>
                        <div className={` absolute top-[calc(100%+10px)] right-0
                             ${sortOpen ? 'pointer-events-auto z-10 opacity-100' : 'pointer-events-none opacity-0'} 
                             transition-opacity duration-300 ease-in-out bg-surface border border-border rounded-2xl p-2
                             w-max  flex flex-col gap-2
                             `}>
                            <button type="button" className="ui-btn" onClick={() => toggleSort('baro_altitude')}>
                                <span>По высоте</span> <SortIcon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 ${iconSort('baro_altitude')}`} />
                            </button>
                            <button type="button" className="ui-btn" onClick={() => toggleSort('velocity')}>
                                <span>По скорости</span> <SortIcon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 ${iconSort('velocity')}`} />
                            </button>
                            <button type="button" className="ui-btn" onClick={() => toggleSort('vertical_rate')}>
                                <span>По верт. скорости</span> <SortIcon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 ${iconSort('vertical_rate')}`} />
                            </button>
                        </div>
                    </div>
                    <button type="button" className="ui-btn px-3 lg:hidden " onClick={() => setSearchOpen(true)}>
                        <SearchIcon className="size-4" />
                    </button>
                </div>
                <div
                    ref={searchRef}
                    className={`flex gap-10 absolute left-0 top-0 w-full transition-opacity duration-300 ease-in-out
                            lg:relative lg:w-auto lg:pointer-events-auto lg:opacity-100 lg:z-auto
                            ${searchOpen
                            ? 'pointer-events-auto z-10 opacity-100'
                            : 'pointer-events-none opacity-0'
                        }`}
                >
                    <input type="text" id="flight-list-search" placeholder="Поиск по ICAO, callsign, стране" autoComplete="off" value={search} onChange={(e) => setSearch(e.target.value)}
                        className="ui-input w-full lg:min-w-60" />
                    <button type="button" aria-label="Очистить поиск" onMouseDown={e => e.preventDefault()} disabled={search.length < 1} className={`${search.length < 1 && 'sr-only'} ui-btn rounded-none border-none p-0 absolute right-2 top-1/2 -translate-y-1/2 size-4`} onClick={() => setSearch('')}><CloseIcon /></button>
                </div>
            </div>
            <div className="overflow-auto lg:border lg:border-border lg:rounded-2xl h-full scrollbar-gutter-stable">
                {isLoading ? (
                    <div className="inline-flex w-full flex-col text-text-primary p-6 gap-4 items-center">
                        <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                        <span className="text-sm font-medium">Загрузка самолетов</span>
                    </div>
                ) : (
                    width >= 1024 ? (
                        <table className="w-full table-fixed border-collapse text-center text-text-primary ">
                            <thead className="text-xs bg-surface border-border border-b sticky top-0 z-10 bg-panel">
                                <tr>
                                    <th className="text-left px-1 lg:px-2  pointer-events-none">ICAO24</th>
                                    <th className="text-left px-1 lg:px-2 pointer-events-none">Callsign</th>
                                    <th className="text-left px-1 lg:px-2  pointer-events-none">Страна</th>
                                    <th className="text-right px-1 lg:px-2">
                                        <button type="button" aria-label="Сортировка по высоте" onClick={() => toggleSort('baro_altitude')} className="cursor-pointer inline-flex gap-0.5 lg:gap-2 items-center">
                                            <span>Высота, м</span> <SortIcon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 ${iconSort('baro_altitude')}`} />
                                        </button>
                                    </th>
                                    <th className="text-right px-1 lg:px-2" >
                                        <button type="button" aria-label="Сортировка по скорости" onClick={() => toggleSort('velocity')} className="cursor-pointer inline-flex gap-0.5 lg:gap-2 items-center">
                                            <span>Скорость, км/ч</span> <SortIcon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 ${iconSort('velocity')}`} />
                                        </button>
                                    </th>
                                    <th className="text-right px-1 lg:px-2" >
                                        <button type="button" aria-label="Сортировка по вертикальной скорости" onClick={() => toggleSort('vertical_rate')} className="cursor-pointer inline-flex gap-0.5 lg:gap-2 items-center">
                                            <span>Верт. скорость, м/с</span> <SortIcon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 ${iconSort('vertical_rate')}`} />
                                        </button>
                                    </th>
                                    <th className="text-right px-1 lg:px-2 pointer-events-none" >Долгота, °</th>
                                    <th className="text-right px-1 lg:px-2 pointer-events-none">Широта, °</th>
                                    <th className="text-right px-1 lg:px-2 pointer-events-none">Последний контакт</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs lg:text-sm">
                                {filteredFlights.length === 0 ?
                                    <tr>
                                        <td colSpan={9} className="text-center py-4">Самолеты не найдены</td>
                                    </tr>
                                    :
                                    filteredFlights.map((flight) => {
                                        const code = countries.getAlpha2Code(flight.origin_country, 'en')

                                        return (
                                            <tr key={flight.icao24} tabIndex={0} className="border-b border-border hover:bg-surface-hover hover:border-border-hover cursor-pointer"
                                                onClick={() => setSelectedObject({
                                                    id: flight.icao24,
                                                    location: flight.longitude != null && flight.latitude != null ? [flight.longitude, flight.latitude] : null,
                                                    type: 'aircraft',
                                                    angle: flight.true_track,
                                                })}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault()
                                                        setSelectedObject({
                                                            id: flight.icao24,
                                                            location: flight.longitude != null && flight.latitude != null
                                                                ? [flight.longitude, flight.latitude]
                                                                : null,
                                                            type: 'aircraft',
                                                            angle: flight.true_track,
                                                        })
                                                    }
                                                }}>
                                                <td className="text-left px-1 lg:px-2 py-1 font-medium"> {flight.icao24.toLocaleUpperCase()}</td>
                                                <td className="text-left px-1 lg:px-2 py-1 font-medium"> {flight.callsign}</td>
                                                <td className="text-left px-1 lg:px-2 py-1 flex justify-start ">
                                                    <div className="inline-flex gap-1 lg:gap-4 items-center">
                                                        {code ? (
                                                            <ReactCountryFlag
                                                                countryCode={code ? code : ''}
                                                                svg
                                                                className="text-2xl"
                                                            />) : (<span><WorldIcon className="w-6 h-6 text-primary" /></span>)}
                                                        <span className="min-w-15 lg:min-w-40">{flight.origin_country}</span>
                                                    </div>
                                                </td>
                                                <td className="text-right px-1 lg:px-2 py-1">{flight.baro_altitude != null && Math.round(flight.baro_altitude).toLocaleString('ru-Ru')}</td>
                                                <td className="text-right px-1 lg:px-2 py-1">{flight.velocity != null && Math.round(flight.velocity)}</td>
                                                <td className="text-right px-1 lg:px-2 py-1">
                                                    <div className="inline-flex gap-2 items-center">
                                                        {flight.vertical_rate}
                                                        <ArrowIcon className={`w-5 h-5 ${flight.vertical_rate && flight.vertical_rate > 0 ? 'text-success' : flight.vertical_rate === 0 ? 'rotate-90' : 'text-danger rotate-180'} `} />
                                                    </div>
                                                </td>
                                                <td className="text-right px-1 lg:px-2 py-1">{flight.longitude?.toFixed(2)}</td>
                                                <td className="text-right px-1 lg:px-2 py-1">{flight.latitude?.toFixed(2)}</td>
                                                <td className="text-right px-1 lg:px-2 py-1">{flight.last_contact && getTimeAgo(flight.last_contact)}</td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>)
                        :
                        <ul className="flex flex-col gap-2">
                            {filteredFlights.map((flight) => {
                                const code = countries.getAlpha2Code(flight.origin_country, 'en')
                                return (
                                    <li key={flight.icao24}>
                                        <button type="button" className="group w-full text-text-primary hover:bg-surface-hover/70 active:bg-surface-active/70
                                 border-border border rounded-2xl flex flex-col gap-2  p-4 text-sm transition-colors duration-300 ease-in-out"
                                            onClick={() => setSelectedObject({
                                                id: flight.icao24,
                                                location: flight.longitude != null && flight.latitude != null ? [flight.longitude, flight.latitude] : null,
                                                type: 'aircraft',
                                                angle: flight.true_track,
                                            })}>
                                            <div className="flex justify-between items-start border-b pb-2 border-border">
                                                <div className="inline-flex gap-2 items-center">
                                                    <div className="border-border bg-surface-hover/70 border rounded-md p-1 group-active:bg-surface-active/70 transition-colors duration-300 ease-in-out">
                                                        {code ? (
                                                            <ReactCountryFlag
                                                                countryCode={code ? code : ''}
                                                                svg
                                                                className="text-2xl"
                                                            />) : (<span><WorldIcon className="w-6 h-6 text-primary" /></span>)}
                                                    </div>
                                                    <span className="text-sm max-w-30">{flight.origin_country}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-text-muted text-right">ICAO24</span>
                                                    <span className="text-sm text-right">{flight.icao24.toLocaleUpperCase()}</span>
                                                </div>
                                            </div>
                                            <div className="border-b border-border flex gap-2 pb-2">
                                                <AirplaneIcon className="text-primary rotate-90" />
                                                <span  >{flight.callsign}</span>
                                            </div>
                                            <div className="grid grid-cols-3 justify-between items-center border-b border-border pb-2">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <MountainIcon className="text-primary w-5 h-5" />
                                                    <span>{flight.baro_altitude != null && Math.round(flight.baro_altitude).toLocaleString('ru-Ru')} м</span>
                                                </div>
                                                <div className="flex flex-col gap-1 items-center">
                                                    <SpeedIcon className="text-primary w-5 h-5" />
                                                    <span>{flight.velocity != null && Math.round(flight.velocity)} км/ч</span>
                                                </div>
                                                <div className="flex flex-col gap-1 items-center">
                                                    <AirplaneTakeOffIcon className="text-primary w-5 h-5" />
                                                    <div className="inline-flex gap-1 items-center">
                                                        <span>{flight.vertical_rate} м/с</span>
                                                        <ArrowIcon className={`w-5 h-5 ${flight.vertical_rate && flight.vertical_rate > 0 ? 'text-success' : flight.vertical_rate === 0 ? 'rotate-90' : 'text-danger rotate-180'} `} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <MarkerIcon className="text-primary w-5 h-5" />
                                                    <span>{`${flight.longitude?.toFixed(2)}°, ${flight.latitude?.toFixed(2)}°`}</span>
                                                </div>
                                                <div className="flex flex-col gap-1 items-center">
                                                    <ClockIcon className="text-primary w-5 h-5" />
                                                    <span>{flight.last_contact && getTimeAgo(flight.last_contact)}</span>
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                )}
            </div>
        </div>
    )
}

export default memo(FlightList)