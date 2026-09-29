import { useSelectionObject } from "./object-selection"
import { FlightDetail } from "./flight-detail";
import { AirportDetail } from "./airport-detail";
import { cn } from "@/shared/lib/cn";
import { memo } from "react";


type ObjectDetailProps = {
    className?: string
}
function ObjectDetail({ className }: ObjectDetailProps) {
    const object = useSelectionObject(
        state => state.selectedObject
    )

    return (

        <aside className={cn("min-w-0 bg-surface border border-border rounded-2xl p-4 text-text-primary h-full overflow-hidden", className)}>
            {object.id !== null ? (
                object.type === 'aircraft' ? <FlightDetail id={object.id ?? ''} /> : object.type === 'airport' ? <AirportDetail id={object.id ?? ''} /> : null
            ) : <div className="flex flex-col gap-10 h-full items-center justify-center">
                <span className="text-xl text-text-secondary font-bold text-center">Выберите самолет или аэропорт</span>
            </div>
            }
        </aside >)
}

export default memo(ObjectDetail)