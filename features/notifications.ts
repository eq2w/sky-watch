import { create } from 'zustand'

export type Toast = {
    id: string
    title: string
    message: string
}

type NotificationsStore = {
    toasts: Toast[]
    push: (toast: Omit<Toast, 'id'>) => void
    dismiss: (id: string) => void
}

export const useNotifications = create<NotificationsStore>((set) => ({
    toasts: [],
    push: (toast) =>
        set((state) => ({
            toasts: [
                ...state.toasts,
                { ...toast, id: crypto.randomUUID() },
            ].slice(-3),
        })),
    dismiss: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
}))