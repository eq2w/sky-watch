import { openSkyFetch } from '@/shared/api/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const icao24 = searchParams.get('icao24')

        if (!icao24) {
            return NextResponse.json(
                { error: 'icao24 is required' },
                { status: 400 }
            )
        }

        const res = await openSkyFetch(`https://opensky-network.org/api/tracks/all?icao24=${encodeURIComponent(icao24)}&time=0`)

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json(
                {
                    error: 'OpenSky request failed',
                    status: res.status,
                    data,
                },
                { status: res.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('OpenSky tracks error:', error)

        return NextResponse.json(
            { error: 'Failed to get flight track' },
            { status: 500 }
        )
    }
}