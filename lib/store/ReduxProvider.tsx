"use client"

import { useState } from "react"

import { Provider } from "react-redux"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"

import { makeStore, type AppStore } from "./store"

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [store] = useState<AppStore>(() => makeStore())
  const [persistor] = useState(() => persistStore(store))

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
