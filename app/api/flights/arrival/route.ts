import { openSkyFetch } from '@/shared/api/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const begin = searchParams.get('begin')
        const end = searchParams.get('end')
        const airport = searchParams.get('airport')

        if (!begin || !end || !airport) {
            return NextResponse.json(
                { error: 'begin, end and airport are required' },
                { status: 400 }
            )
        }
        const qs = new URLSearchParams({
            airport,
            begin,
            end,
        })
        const res = await openSkyFetch(`https://opensky-network.org/api/flights/arrival?${qs}`)


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
        console.error('OpenSky arrivals error:', error)

        return NextResponse.json(
            { error: 'Failed to get arrivals' },
            { status: 500 }
        )
    }
}