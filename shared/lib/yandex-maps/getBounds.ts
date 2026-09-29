import { LngLat, LngLatBounds } from "@yandex/ymaps3-types";

export function getBounds(coordinates: LngLat[], paddingRatio = 0.25): LngLatBounds {
    let minLat = Infinity,
        minLng = Infinity;
    let maxLat = -Infinity,
        maxLng = -Infinity;

    for (const coords of coordinates) {
        const lat = coords[1];
        const lng = coords[0];

        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
    }

    let lngSpan = maxLng - minLng
    let latSpan = maxLat - minLat

    const MIN_SPAN = 0.02
    if (lngSpan < MIN_SPAN) lngSpan = MIN_SPAN
    if (latSpan < MIN_SPAN) latSpan = MIN_SPAN
    const padLng = lngSpan * paddingRatio
    const padLat = latSpan * paddingRatio

    return [
        [minLng - padLng, minLat - padLat],
        [maxLng + padLng, maxLat + padLat]
    ];
}