import { getTimeAgo } from "@/shared/lib/date/get-time-ago";
import { AirplaneIcon } from "@/shared/ui/icon/AirplaneIcon"
import { ArrowIcon } from "@/shared/ui/icon/ArrowIcon";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import ReactCountryFlag from "react-country-flag";
import { useSelectionObject } from "./object-selection";
import { Flight } from "@/entities/flights/model/types";
import { useFlightsQuery } from "@/entities/flights/api/use-flights-query";
import { WorldIcon } from "@/shared/ui/icon/WorldIcon";
countries.registerLocale(en)

export type FlightDetailProps = {
    id: string | null
}
export const FlightDetail = ({ id }: FlightDetailProps) => {

    const { data } = useFlightsQuery({
        select: (data) => data?.states.find((flight: Flight) => flight.icao24 === id),
    })


    const code = countries.getAlpha2Code(data ? data.origin_country : '', 'en')

    const clearSelectedObject = useSelectionObject(
        (state) => state.clearSelectedObject
    );
    return (
        <>
            {data &&
                (<div className="flex flex-col gap-4 h-full">
                    <div className="flex gap-2 items-center justify-between">
                        <div className="inline-flex gap-2 items-center">
                            <AirplaneIcon className="w-5 h-5 text-primary" />
                            <span className="text-lg font-bold">{data.callsign}</span>
                        </div>
                        <span className={`p-2 rounded-2xl border border-border py-2 px-2 text-sm ${!data.on_ground ? 'text-success' : 'text-warning'}`}>{data.on_ground ? 'На земле' : 'В воздухе'}</span>
                    </div>

                    <div className="flex flex-col gap-2 text-xs">
                        <div className="border-b border-border py-2 flex justify-between gap-2 items-center">
                            <span className="text-text-secondary">Страна</span>
                            <div className="inline-flex gap-2 items-center text-right">
                                <span className="font-bold text-right ">{data.origin_country}</span>
                                {code ? (
                                    <ReactCountryFlag
                                        countryCode={code ? code : ''}
                                        svg
                                        className="text-2xl"
                                    />) : (<span><WorldIcon className="w-6 h-6 text-primary" /></span>)}
                            </div>
                        </div>
                        <div className="border-b border-border py-2 flex justify-between gap-2 items-center">
                            <span className="text-text-secondary">Высота</span>
                            <span className="font-bold text-right">{data.baro_altitude && `${Math.round(data.baro_altitude).toLocaleString('ru-Ru')} м`} </span>
                        </div>
                        <div className="border-b border-border py-2 flex justify-between gap-2 items-center">
                            <span className="text-text-secondary">Скорость</span>
                            <span className="font-bold text-right">{data.velocity && `${Math.round(data.velocity)} км/ч`}</span>
                        </div>
                        <div className="border-b border-border py-2 flex justify-between gap-2  items-center">
                            <span className="text-text-secondary">Вертик. скорость</span>
                            <div className="flex gap-1 items-center text-right">
                                <span className="font-bold">{data.vertical_rate && `${data.vertical_rate} м/с`}</span>
                                <ArrowIcon className={`w-5 h-5 ${data.vertical_rate && data.vertical_rate > 0 ? 'text-success' : data.vertical_rate === 0 || data.vertical_rate === null ? 'rotate-90' : 'text-danger rotate-180'} `} />
                            </div>
                        </div>
                        <div className="border-b border-border py-2 flex justify-between gap-2 items-center">
                            <span className="text-text-secondary">Курс</span>
                            <span className="font-bold text-right">{data.true_track}</span>
                        </div>
                        <div className="border-b border-border py-2 flex justify-between gap-2 items-center">
                            <span className="text-text-secondary">Координаты</span>
                            <span className="font-bold text-right">{`${data.latitude}, ${data.longitude}`}</span>
                        </div>
                        <div className="border-b border-border py-2 flex justify-between gap-2  items-center">
                            <span className="text-text-secondary">Последний контакт</span>
                            <span className="font-bold text-right">{data.last_contact && getTimeAgo(data.last_contact)}</span>
                        </div>
                    </div>

                    <button type="button" className="ui-btn ui-btn-primary mt-auto p-2" onClick={() => clearSelectedObject()}>Закрыть</button>
                </div>)
            }
        </>)

}

