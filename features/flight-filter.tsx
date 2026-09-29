'use client'
import { Flight } from "@/entities/flights/model/types";
import { memo, useEffect, useRef, useState } from "react";
import { useSelectionFilter } from "./filter-selection";
import { FilterIcon } from "@/shared/ui/icon/FilterIcon";
import { CountrySelect } from "@/shared/ui/CountrySelect/CountrySelect";
import { useFlightsQuery } from "@/entities/flights/api/use-flights-query";
import { cn } from "@/shared/lib/cn";
type FlightFilterProps = {
    className?: string
}

function FlightFilter({ className }: FlightFilterProps) {
    const { data } = useFlightsQuery()
    const flights: Flight[] = data?.states
    const [rangeH, setRangeH] = useState([0, 0])
    const [minH, setMinH] = useState(0)
    const [maxH, setMaxH] = useState(0)
    const [rangeV, setRangeV] = useState([0, 0])
    const [minV, setMinV] = useState(0)
    const [maxV, setMaxV] = useState(0)
    const [country, setCountry] = useState('all')
    const [onGround, setOnGround] = useState(false)
    const [showAirports, setShowAirports] = useState(false)
    const [showAircrafts, setShowAircrafts] = useState(true)
    const initialized = useRef(false)

    const countries = [...new Set((flights ?? []).map(flight => flight.origin_country).filter(country => country !== '').sort((a, b) => a.localeCompare(b)))]

    const setSelectedFilter = useSelectionFilter(
        (state) => state.setSelectedFilter
    )
    const disabled = !flights?.length

    useEffect(() => {
        if (!flights || initialized.current) return

        const minHeight = flights?.reduce((acc, f) => {
            const h = f.baro_altitude
            return h !== null && h < acc ? h : acc
        }, Infinity)

        const minVelocity = flights?.reduce((acc, f) => {
            const h = f.velocity
            return h !== null && h < acc ? h : acc
        }, Infinity)

        const maxHeight = flights?.reduce((acc, f) => {
            const h = f.baro_altitude
            return h !== null && h > acc ? h : acc
        }, -Infinity)

        const maxVelocity = flights?.reduce((acc, f) => {
            const h = f.velocity
            return h !== null && h > acc ? h : acc
        }, -Infinity)

        const minH = Math.floor(minHeight / 100) * 100
        const maxH = Math.ceil(maxHeight / 100) * 100

        const minV = Math.floor(minVelocity / 100) * 100
        const maxV = Math.ceil(maxVelocity / 100) * 100

        setRangeH([minH, maxH])
        setRangeV([minV, maxV])
        setMinH(minH)
        setMaxH(maxH)
        setMinV(minV)
        setMaxV(maxV)
        initialized.current = true
    }, [flights])

    useEffect(() => {
        if (!flights?.length || !initialized.current) return

        const altitude =
            minH === rangeH[0] && maxH === rangeH[1] ? null : { minH, maxH }
        const velocity =
            minV === rangeV[0] && maxV === rangeV[1] ? null : { minV, maxV }

        setSelectedFilter(
            altitude,
            velocity,
            country,
            onGround,
            showAirports,
            showAircrafts,
        )
    }, [country,
        onGround,
        minH,
        maxH,
        minV,
        maxV,
        showAirports,
        showAircrafts,
        setSelectedFilter,
        flights?.length,
        rangeH,
        rangeV])

    const handleReset = () => {
        setMinH(rangeH[0])
        setMaxH(rangeH[1])
        setMinV(rangeV[0])
        setMaxV(rangeV[1])
        setOnGround(false)
        setCountry('all')
        setShowAirports(false)
        setShowAircrafts(true)
    }

    const spanH = rangeH[1] - rangeH[0] || 1
    const leftH = ((minH - rangeH[0]) / spanH) * 100
    const rightH = ((maxH - rangeH[0]) / spanH) * 100

    const spanV = rangeV[1] - rangeV[0] || 1
    const leftV = ((minV - rangeV[0]) / spanV) * 100
    const rightV = ((maxV - rangeV[0]) / spanV) * 100

    return (
        <aside
            className={cn(
                'h-full min-w-0 overflow-y-hidden flex flex-col bg-surface rounded-2xl border border-border p-4 gap-4',
                disabled && 'opacity-50',
                className,
            )}
        >
            <h2 className="text-xl font-bold text-text-primary inline-flex gap-2 items-center">
                <FilterIcon className="w-5 h-5 fill-text-primary" />
                <span>Фильтры</span></h2>
            <fieldset disabled={disabled} className="flex flex-col gap-4 h-full">
                <div className="flex flex-col gap-4">
                    <span className="text-sm text-text-primary">По высоте (м)</span>
                    <div className="relative h-4 lg:h-2">
                        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-text-secondary" />
                        <div
                            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary"
                            style={{ left: `${leftH}%`, width: `${rightH - leftH}%` }}
                        />
                        <input type="range" value={minH} min={rangeH[0]} max={rangeH[1]} aria-label="Минимальная высота" id="minAltitude" step={100}
                            className="absolute w-full pointer-events-none appearance-none top-0 left-0 [&::-webkit-slider-thumb]:appearance-none 
                        lg:[&::-webkit-slider-thumb]:w-2 lg:[&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary
                         [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
                            onChange={e => {
                                const value = Number(e.target.value)
                                setMinH(Math.min(value, maxH - 100))
                            }} />
                        <input type="range" value={maxH} min={rangeH[0]} max={rangeH[1]} aria-label="Максимальная высота" id="maxAltitude" step={100}
                            className="absolute w-full pointer-events-none appearance-none top-0 left-0  [&::-webkit-slider-thumb]:appearance-none 
                        lg:[&::-webkit-slider-thumb]:w-2 lg:[&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary 
                        [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
                            onChange={e => {
                                const value = Number(e.target.value)
                                setMaxH(Math.max(value, minH + 100))
                            }} />
                    </div>
                </div>
                <div className="flex gap-4 items-center justify-between">
                    <span className="w-full text-text-secondary text-sm">{minH}</span>
                    <span className="w-full text-text-secondary text-sm text-right">{maxH}</span>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-4">
                        <span className="text-sm text-text-primary">По скорости (км/ч)</span>
                        <div className="relative h-4 lg:h-2">
                            <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-text-secondary" />
                            <div
                                className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary"
                                style={{ left: `${leftV}%`, width: `${rightV - leftV}%` }}
                            />
                            <input type="range" value={minV} min={rangeV[0]} max={rangeV[1]} aria-label="Минимальная скорость" id="minVelocity" step={100}
                                className="absolute w-full pointer-events-none appearance-none top-0 left-0 [&::-webkit-slider-thumb]:appearance-none 
                            lg:[&::-webkit-slider-thumb]:w-2 lg:[&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary
                             [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
                                onChange={e => {
                                    const value = Number(e.target.value)
                                    setMinV(Math.min(value, maxV - 100))
                                }} />
                            <input type="range" value={maxV} min={rangeV[0]} max={rangeV[1]} aria-label="Максимальная скорость" id="maxVelocity" step={100}
                                className="absolute w-full pointer-events-none appearance-none top-0 left-0  [&::-webkit-slider-thumb]:appearance-none 
                            lg:[&::-webkit-slider-thumb]:w-2 lg:[&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary 
                            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
                                onChange={e => {
                                    const value = Number(e.target.value)
                                    setMaxV(Math.max(value, minV + 100))
                                }} />
                        </div>
                    </div>
                    <div className="flex gap-10 items-center justify-between">
                        <span className="w-full text-text-secondary text-sm">{minV}</span>
                        <span className="w-full text-text-secondary text-sm text-right">{maxV}</span>
                    </div>
                </div>
                <CountrySelect countriesList={countries} value={country} onChange={setCountry} />
                <label className="inline-flex justify-between items-center cursor-pointer">
                    <span className="text-sm text-text-primary">{onGround ? 'На земле' : 'В воздухе'}</span>
                    <div className="relative inline-flex items-center">
                        <input checked={!onGround} onChange={() => setOnGround(prev => !prev)} type="checkbox" className="peer sr-only" />
                        <span className="h-4 w-7 rounded-full bg-border transition-colors peer-checked:bg-success" />
                        <span className="absolute left-1 top-1 size-2 rounded-full bg-white transition-transform peer-checked:translate-x-3" />
                    </div>
                </label>
                <label className="inline-flex justify-between items-center cursor-pointer">
                    <span className="text-sm text-text-primary">{showAircrafts ? 'Показать самолеты ' : 'Скрыть самолеты'}</span>
                    <div className="relative inline-flex items-center">
                        <input checked={showAircrafts} onChange={() => setShowAircrafts(prev => !prev)} type="checkbox" className="peer sr-only" />
                        <span className="h-4 w-7 rounded-full bg-border transition-colors peer-checked:bg-success" />
                        <span className="absolute left-1 top-1 size-2 rounded-full bg-white transition-transform peer-checked:translate-x-3" />
                    </div>
                </label>
                <label className="inline-flex justify-between items-center cursor-pointer">
                    <span className="text-sm text-text-primary">{showAirports ? 'Показать аэропорты ' : 'Скрыть аэропорты'}</span>
                    <div className="relative inline-flex items-center">
                        <input checked={showAirports} onChange={() => setShowAirports(prev => !prev)} type="checkbox" className="peer sr-only" />
                        <span className="h-4 w-7 rounded-full bg-border transition-colors peer-checked:bg-success" />
                        <span className="absolute left-1 top-1 size-2 rounded-full bg-white transition-transform peer-checked:translate-x-3" />
                    </div>
                </label>

                <button className="ui-btn p-2 mt-auto" onClick={handleReset}>Сбросить</button>
            </fieldset>
        </aside >
    )

}

export default memo(FlightFilter)