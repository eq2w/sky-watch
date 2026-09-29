'use client';
import * as ReactDOM from 'react-dom';
import { ReactifiedModule } from '@yandex/ymaps3-types/reactify/reactify';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ReactifiedApi = ReactifiedModule<typeof ymaps3> & {
  YMapClusterer: ReactifiedModule<typeof import('@yandex/ymaps3-clusterer')>['YMapClusterer']
  clusterByGrid: typeof import('@yandex/ymaps3-clusterer').clusterByGrid,
}

const YMapApiContext = createContext<ReactifiedApi | null>(null)

export function YMapApiProvider({
  api,
  children,
}: {
  api: ReactifiedApi
  children: React.ReactNode
}) {
  return (
    <YMapApiContext.Provider value={api}>{children}</YMapApiContext.Provider>
  )
}

export function useYMap() {
  const api = useContext(YMapApiContext)
  if (!api) throw new Error('YMapApiContext not found')
  return api
}

export function useLoadMapApi() {
  const [api, setApi] = useState<ReactifiedApi | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [ymaps3React] = await Promise.all([
          ymaps3.import('@yandex/ymaps3-reactify'),
          ymaps3.ready
        ])

        const ymaps3Clusterer = await import('@yandex/ymaps3-clusterer')

        if (cancelled) return

        const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);
        const { YMapClusterer } = reactify.module(ymaps3Clusterer)

        setApi({
          ...reactify.module(ymaps3),
          YMapClusterer,
          clusterByGrid: ymaps3Clusterer.clusterByGrid,
        } as ReactifiedApi)
      } catch (error) {
        if (!cancelled) {
          console.error(
            'Failed to load Yandex Maps Api'
            , error)
          setError(
            error instanceof Error ? error.message : 'Unknown error'
          )
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, []);

  return { api, error }
};

