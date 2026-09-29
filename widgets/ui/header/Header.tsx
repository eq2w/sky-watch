import { useFlightsQuery } from "@/entities/flights/api/use-flights-query";
import { MapSearch } from "@/features/map-search";
import { cn } from "@/shared/lib/cn";
import { AirplaneIcon } from "@/shared/ui/icon/AirplaneIcon";
import { RefreshIcon } from "@/shared/ui/icon/RefreshIcon";
import { memo } from "react";
type HeaderProps = {
    className?: string
}

function Header({ className }: HeaderProps) {
    const { isLoading, isRefetching, refetch } = useFlightsQuery()
    return (
        <header className={cn("h-12 lg:h-20 bg-surface border relative lg:static border-border py-2 px-4 flex justify-between gap-10 items-center rounded-2xl", className)} >
            <div className="flex gap-10 lg:gap-30 items-center">
                <div className="flex gap-1 lg:gap-2 items-center">
                    <AirplaneIcon className="w-6 md:w-8 h-6 md:h-8 text-primary rotate-45" />
                    <h1 className="text-md lg:text-xl font-bold text-text-primary">Sky Watch</h1>
                </div>
                <MapSearch />
            </div>
            <div className="flex items-center">
                <button type="button" disabled={isRefetching || isLoading} className="ui-btn px-3" onClick={() => refetch()}>
                    <RefreshIcon className={`w-4 h-4 text-text-secondary ${isRefetching || isLoading ? 'animate-spin' : ''}`} />
                    <span className="text-sm hidden lg:block">Обновить</span>
                </button>
            </div>
        </header >
    )
}

export default memo(Header)