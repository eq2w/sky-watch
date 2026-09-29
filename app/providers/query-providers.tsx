'use client'
import { useNotifications } from "@/features/notifications";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false
        }
    },
    queryCache: new QueryCache({
        onError: (error, query) => {
            if (query.state.data !== undefined) return
            useNotifications.getState().push({
                title: 'Ошибка загрузки',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Не удалось загрузить данные',
            })
        },
    }),
})

export function QueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}