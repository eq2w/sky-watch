type CachedToken = {
    access_token: string
    expires_at: number
}

let cache: CachedToken | null = null
let inflight: Promise<string> | null = null


export async function getOpenSkyToken(force = false) {
    if (cache && Date.now() < cache.expires_at - 60000 && !force) {
        return cache.access_token
    }
    if (inflight && !force) return inflight

    inflight = (async () => {
        const clientId = process.env.OPENSKY_CLIENT_ID
        const clientSecret = process.env.OPENSKY_CLIENT_SECRET

        if (!clientId || !clientSecret) {
            throw new Error('OpenSky credentials are not configured')
        }

        const response =
            await fetch('https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        grant_type: 'client_credentials',
                        client_id: clientId,
                        client_secret: clientSecret,
                    }),
                })

        if (!response.ok) {
            throw new Error(
                `OpenSky authentication failed: ${response.status}`
            )
        }
        const data = (await response.json()) as { access_token: string, expires_in: number }

        cache = {
            access_token: data.access_token,
            expires_at: Date.now() + data.expires_in * 1000
        }

        return cache.access_token
    })().finally(() => {
        inflight = null
    })
    return inflight
}

export function invalidateOpenSkyToken() {
    cache = null
}

export async function openSkyFetch(url: string, init?: RequestInit) {
    const token = await getOpenSkyToken()

    let result = await fetch(url, {
        ...init,
        headers: {
            ...init?.headers,
            Authorization: `Bearer ${token}`
        }
    })

    if (result.status === 401) {
        invalidateOpenSkyToken()
        const fresh = await getOpenSkyToken(true)
        result = await fetch(url, {
            ...init,
            headers: {
                ...init?.headers,
                Authorization: `Bearer ${fresh}`
            }
        })
    }
    return result
}