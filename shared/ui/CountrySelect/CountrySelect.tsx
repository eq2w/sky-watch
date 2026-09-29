import { useEffect, useRef, useState } from "react"
import ReactCountryFlag from "react-country-flag"
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { WorldIcon } from "../icon/WorldIcon";
import { CloseIcon } from "../icon/CloseIcon";

type CountrySelectProps = {
    countriesList: string[]
    value: string,
    onChange: (value: string) => void,
}
countries.registerLocale(en)

export function CountrySelect({ countriesList, value, onChange }: CountrySelectProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const rootRef = useRef<HTMLDivElement>(null)
    const selectedCountry =
        value === 'all' ? 'Все страны' : value

    const filteredCountries = countriesList.filter((country) => country.toLowerCase().includes(search.toLowerCase()))

    useEffect(() => {
        if (!open) return

        function handlePointerDown(e: PointerEvent) {
            if (!rootRef.current?.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [open])

    useEffect(() => {
        if (!open) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false)
            }
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [open])

    function handleTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
        if (e.target !== e.currentTarget) return
        if (!open) setSearch('')
    }

    return (
        <div className="" ref={rootRef}>
            <button type="button" aria-expanded={open} className="ui-btn justify-start w-full min-h-10" onClick={() => setOpen(prev => !prev)}>
                {value === 'all' ? (
                    <span className=""><WorldIcon className="w-6 h-6 text-primary" /></span>
                ) : (
                    (() => {
                        const code = countries.getAlpha2Code(value, 'en')

                        return code ? (
                            <ReactCountryFlag
                                countryCode={code}
                                svg
                                className="text-xl"
                            />
                        ) : (
                            <span><WorldIcon className="w-6 h-6 text-primary" /></span>
                        )
                    })()
                )}
                <span className="text-text-primary text-sm">
                    {selectedCountry}
                </span>
            </button>

            <div aria-label="Выбор страны" onTransitionEnd={handleTransitionEnd} 
            className={`${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'} 
            transition-all duration-300 ease-in-out absolute
              flex flex-col gap-2 top-74 left-4 right-4 bottom-4 z-20 bg-surface border
               border-border rounded-xl p-4 overflow-auto`}>
                <div className="relative">
                    <input type="text" autoComplete="off" className="ui-input" placeholder="Поиск по стране" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button type="button" aria-label="Очистить поиск" onMouseDown={e => e.preventDefault()} disabled={search.length < 1} className={`${search.length < 1 && 'sr-only'} ui-btn rounded-none border-none p-0 absolute right-2 top-1/2 -translate-y-1/2 size-4`} onClick={() => setSearch('')}><CloseIcon /></button>
                </div>
                <div className="flex flex-col gap-1">
                    <button type="button" className="ui-btn w-full p-1 border-none flex gap-4 justify-start items-center" onClick={() => { onChange('all'); setOpen(false) }}>
                        <span><WorldIcon className="w-6 h-6 text-primary" /></span> Все страны
                    </button>
                    {filteredCountries.map((country) => {
                        const code = countries.getAlpha2Code(country, 'en')

                        return (< button type="button" className="ui-btn w-full p-1 border-none flex gap-4 justify-start items-center" key={country} onClick={() => { onChange(country); setOpen(false) }}>
                            {code ? (
                                <ReactCountryFlag
                                    countryCode={code ? code : ''}
                                    svg
                                    className="text-2xl"
                                />) : (<span><WorldIcon className="w-6 h-6 text-primary" /></span>)}
                            <span className="text-sm text-left">{country}</span>
                        </button>
                        )
                    })}
                </div>
            </div>

        </div >
    )
}