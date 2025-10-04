"use client"

import * as React from "react"

type Toast = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastAction = (id: string) => void

const ToastContext = React.createContext<{
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: ToastAction
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2)
    setToasts((prev) => [...prev, { id, ...toast }])
    setTimeout(() => removeToast(id), 3000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg shadow-md px-4 py-2 ${
              toast.variant === "destructive"
                ? "bg-red-600 text-white"
                : "bg-emerald-600 text-white"
            }`}
          >
            {toast.title && <p className="font-semibold">{toast.title}</p>}
            {toast.description && <p className="text-sm">{toast.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
