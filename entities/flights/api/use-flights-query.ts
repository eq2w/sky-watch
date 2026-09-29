'use client'
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getFlight } from "./get-flights";

type FlightsData = Awaited<ReturnType<typeof getFlight>>
export function useFlightsQuery<TData = FlightsData>(
    options?: Omit<UseQueryOptions<FlightsData, Error, TData>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: ['flights'],
        queryFn: getFlight,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchInterval: 1000 * 60 * 5,
        retry: false,
        ...options,
    })
}