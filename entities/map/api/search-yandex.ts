import { YandexGeocodeResponse } from "../model/types";


export async function searchYandex(query: string): Promise<YandexGeocodeResponse> {
    const response = await fetch(
        `/api/geocode?geocode=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error("Ошибка поиска");
    }

    return response.json();
}