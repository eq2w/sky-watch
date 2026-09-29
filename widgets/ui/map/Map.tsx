'use client';

import type { YMap } from '@yandex/ymaps3-types';
import { useLoadMapApi, YMapApiProvider } from '@/shared/lib/yandex-maps/useYMap';
import type { YMapLocation } from '@yandex/ymaps3-types/imperative/YMap';
import { MapCameraController } from './MapCameraController';
import { mapCustomization } from './customization';
import { memo, useRef } from 'react';
import { useMapCamera } from '@/features/map-camera';
import { cn } from '@/shared/lib/cn';



type MapProps = {
    location: YMapLocation,
    children?: React.ReactNode,
    className?: string
}
const Map = ({ location, children, className }: MapProps) => {

    const { api, error } = useLoadMapApi()
    const mapRef = useRef<YMap | null>(null)
    const setZoom = useMapCamera((state) => state.setZoom)
    const lastZoom = useRef<number | null>(null)

    if (error) return (
        <div className="relative flex h-full w-full min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
            <div className="flex flex-col items-center gap-4 p-6 text-center text-text-secondary">
                <span className="text-2xl font-medium">Не удалось загрузить карту</span>
                <span className="text-lg text-text-muted">{error}</span>
                <button
                    type="button"
                    className="ui-btn ui-btn-primary p-4"
                    onClick={() => window.location.reload()}
                >
                    Обновить страницу
                </button>
            </div>
        </div>
    )

    if (!api) return (
        <div className="relative flex h-full w-full min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
            <div className="flex flex-col items-center gap-4 text-text-secondary">
                <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                <span className="text-sm font-medium">Загрузка карты…</span>
            </div>
        </div>
    )

    const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapListener } = api
    return (
        <YMapApiProvider api={api}>
            <div className={cn(" h-full w-full min-h-0 min-w-0 overflow-hidden border border-border rounded-2xl shadow-lg bg-surface", className)}>
                <YMap ref={mapRef} className="h-full w-full" theme='dark' location={location} zoomRange={{ min: 4, max: 12 }}>
                    <YMapDefaultSchemeLayer customization={mapCustomization} />
                    <YMapDefaultFeaturesLayer />
                    {children}
                    <MapCameraController mapRef={mapRef} />
                    <YMapListener onUpdate={() => {
                        const z = mapRef.current?.zoom
                        if (z == null) return
                        const rounded = Math.round(z * 2) / 2 // шаг 0.5
                        if (rounded === lastZoom.current) return
                        lastZoom.current = rounded
                        setZoom(rounded)
                    }} />
                </YMap>
            </div>
        </YMapApiProvider>
    );
};

export default memo(Map);
