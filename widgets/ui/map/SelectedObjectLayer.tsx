'use client'

import { useSelectionObject } from "@/features/object-selection"
import { useYMap } from "@/shared/lib/yandex-maps/useYMap"

import { AirplaneIcon } from "@/shared/ui/icon/AirplaneIcon"
import { AirportIcon } from "@/shared/ui/icon/AirportIcon"


type SelectedObjectLayer = {
    source: string
}

export const SelectedObjectLayer = ({ source }: SelectedObjectLayer) => {
    const api = useYMap()

    const selectedObject = useSelectionObject(
        (state) => state.selectedObject
    )

    if (!api || !selectedObject.location) return null
    const { YMapFeatureDataSource, YMapMarker, YMapLayer } = api
    return (
        <>
            <YMapFeatureDataSource id={source} />
            <YMapLayer source={source} type="markers" zIndex={2000} />
            <YMapMarker coordinates={selectedObject.location} source={source} >
                {selectedObject.type === 'aircraft' ?
                    <div className="group relative cursor-pointer">
                        <AirplaneIcon className="text-danger max-w-none w-4 h-4 " style={{ transform: `translate(-50%, -50%) rotate(${selectedObject?.angle}deg)` }} />
                    </div> :
                    selectedObject.type === 'airport' ?
                        <div className="group relative cursor-pointer" >
                            <span className="hidden group-hover:block absolute left-1/2 bottom-full border border-border min-w-28 max-w-56 whitespace-normal w-max rounded-xl p-2 bg-background z-10 text-text-primary -translate-1/2">{selectedObject.id}</span>
                            <AirportIcon className="-translate-1/2 text-danger w-4 h-4" />
                        </div> :
                        null
                }
            </YMapMarker>

        </>
    )
}
