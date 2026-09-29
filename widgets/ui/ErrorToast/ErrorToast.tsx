'use client'

import { type Toast, useNotifications } from '@/features/notifications'
import { useEffect, useState } from 'react'



function ToastItem({ toast }: { toast: Toast }) {
    const dismiss = useNotifications((s) => s.dismiss)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const enter = requestAnimationFrame(() => setVisible(true))
        const timer = setTimeout(() => setVisible(false), 4000)
        return () => {
            cancelAnimationFrame(enter)
            clearTimeout(timer)
        }
    }, [])

    function handleTransitionEnd() {
        if (!visible) dismiss(toast.id)
    }

    return (
        <button
            type="button"
            role="status"
            onClick={() => setVisible(false)}
            onTransitionEnd={handleTransitionEnd}
            className={[
                'w-full text-left rounded-2xl border border-border bg-surface/95 backdrop-blur-md',
                'shadow-lg shadow-black/40 overflow-hidden transition-all duration-300 ease-out',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4',
            ].join(' ')}
        >
            <div className="flex gap-3 p-3">
                <div className="w-1 shrink-0 rounded-full bg-danger" />
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary">{toast.title}</p>
                    <p className="text-sm text-text-secondary truncate">{toast.message}</p>
                </div>
            </div>
        </button>
    )
}

export function ErrorToast() {
    const toasts = useNotifications((s) => s.toasts)

    return (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3">
            <div className="pointer-events-auto flex w-full max-w-105 flex-col gap-2">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} />
                ))}
            </div>
        </div>
    )
}