"use client"

import { useRef } from "react"
import { Provider } from "react-redux"
import { makeStore, type AppStore } from "./store"

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>(null)
  if (!storeRef.current) {
    // Tạo instance store lần đầu tiên component này render
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
