'use client'

import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { useSelectionObject } from "./object-selection"
import { useDebounce } from "@/shared/lib/hooks/use-debounce"
import { searchYandex } from "@/entities/map/api/search-yandex"
import { YandexFeatureMember } from "@/entities/map/model/types"
import { CloseIcon } from "@/shared/ui/icon/CloseIcon"
import { cn } from "@/shared/lib/cn"
import { SearchIcon } from "@/shared/ui/icon/SearchIcon"

type MapSearchProps = {
    className?: string
}
export const MapSearch = ({ className }: MapSearchProps) => {
    const [search, setSearch] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const setSetSelectedObject = useSelectionObject(
        (state) => state.setSelectedObject
    )
    const clearSelectedObject = useSelectionObject(
        (state) => state.clearSelectedObject
    )
    useEffect(() => {
        if (!open && !searchOpen) return

        function handlePointerDown(e: PointerEvent) {
            if (!rootRef.current?.contains(e.target as Node)) {
                setOpen(false)
                setSearchOpen(false)
            }
        }
        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [open, searchOpen])



    const debouncedSearch = useDebounce(search, 500)

    const searchResult = useQuery({
        queryKey: ['search', debouncedSearch],
        queryFn: () => searchYandex(debouncedSearch),
        enabled: debouncedSearch.trim().length > 2,
    })

    const results = searchResult.data?.response.GeoObjectCollection.featureMember ?? []

    const goToPosition = (item: YandexFeatureMember) => {
        const [lon, lat] = item.GeoObject.Point.pos.split(' ').map(Number)
        if (!Number.isFinite(lon) || !Number.isFinite(lat)) return
        setSetSelectedObject({
            id: null,
            location: [lon, lat],
            type: null,
            angle: null
        })
        setSearch('')
        setOpen(false)
        setSearchOpen(false)
    }

    const clearSearch = () => {
        setSearch('')
        clearSelectedObject()
        setOpen(false)
        inputRef.current?.focus()
    }

    return (
        <div className={cn('lg:relative', className)} ref={rootRef}>
            <button type="button" className="ui-btn px-3 lg:hidden" onClick={() => setSearchOpen(true)}>
                <SearchIcon className="size-4 text-text-secondary" />
            </button>
            <div className={` ${searchOpen ? 'z-10 opacity-100 pointer-events-auto' : ' pointer-events-none -z-10 opacity-0 '} 
            absolute top-1/2 left-1/2 -translate-1/2 w-full lg:w-auto lg:top-auto lg:left-auto lg:translate-none lg:pointer-events-auto lg:block lg:z-auto lg:opacity-100
             lg:relative transition-all duration-300 ease-in-out `}>
                <input id="map-search" autoComplete="off" type="text" placeholder="Поиск по карте"
                    className="ui-input w-full min-w-60 lg:min-w-80 h-12 lg:h-auto px-8" onKeyDown={
                        e => {
                            if (e.key === 'Escape') {
                                setOpen(false)
                                inputRef.current?.blur()
                            }
                        }
                    } ref={inputRef} value={search} onChange={(e) => {
                        setSearch(e.target.value)
                        if (e.target.value.length > 2) {
                            setOpen(true)
                        }
                    }} />
                <SearchIcon className="size-4 text-text-secondary absolute left-2 top-1/2 -translate-y-1/2" />
                <button type="button" aria-label="Очистить поиск" onMouseDown={e => e.preventDefault()} disabled={search.length < 1} className={`${search.length < 1 && 'sr-only'} ui-btn rounded-none border-none p-0 absolute right-2 top-1/2 -translate-y-1/2 size-4`} onClick={() => clearSearch()}><CloseIcon /></button>
            </div>
            {results.length > 0 &&
                <div className={`transition-all duration-300 ease-in-out absolute top-[calc(100%+10px)] lg:top-[calc(100%+30px)] bg-surface shadow-lg max-h-max px-3 py-2 rounded-2xl border border-border z-100 left-0 w-full
                 ${open
                        ? 'opacity-100 translate-y-0'
                        : 'pointer-events-none opacity-0 -translate-y-2'
                    }`}>
                    <ul className="list-none p-0 m-0 flex justify-around flex-col gap-2">
                        {results.map((item) => (
                            <li key={item.GeoObject.Point.pos} className="w-full">
                                <button type="button" onClick={() => goToPosition(item)} className="ui-btn w-full justify-start rounded-none p-1 border-none min-h-5 text-left" >
                                    {item.GeoObject.metaDataProperty.GeocoderMetaData.text}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    )
}