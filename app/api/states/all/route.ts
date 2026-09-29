import { openSkyFetch } from '@/shared/api/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await openSkyFetch('https://opensky-network.org/api/states/all')

    if (!res.ok) {
      const message = await res.text()
      return NextResponse.json(
        { error: 'OpenSky request failed', status: res.status, message },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('OpenSky states error:', error)
    return NextResponse.json(
      { error: 'Failed to get flight states' },
      { status: 500 }
    )
  }
}