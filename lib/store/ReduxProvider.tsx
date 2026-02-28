"use client"

import { useState } from "react"

import { Provider } from "react-redux"

import { makeStore, type AppStore } from "./store"

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Tạo store một lần bằng lazy initializer của useState (tuân thủ react-hooks/refs)
  const [store] = useState<AppStore>(() => makeStore())

  return <Provider store={store}>{children}</Provider>
}
