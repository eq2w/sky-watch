import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("geocode");

    if (!query?.trim()) {
        return NextResponse.json([]);
    }

    const apiKey = process.env.YANDEX_GEOCODER_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "YANDEX_GEOCODER_API_KEY is not configured" },
            { status: 500 }
        );
    }

    const httpApiUrl = "https://geocode-maps.yandex.ru/1.x";

    const queryString = new URLSearchParams({
        apikey: apiKey,
        geocode: query.trim(),
        format: "json",
        lang: "ru_RU",
    }).toString();

    const fullUrl = `${httpApiUrl}?${queryString}`;

    const response = await fetch(fullUrl);

    if (!response.ok) {
        const error = await response.text();

        console.error("Yandex Geocoder error:", error);

        return NextResponse.json(
            { error },
            { status: response.status }
        );
    }

    const data = await response.json();

    return NextResponse.json(data);
}