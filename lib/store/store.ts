import { combineReducers, configureStore } from "@reduxjs/toolkit"
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist"
import storage from "redux-persist/lib/storage"

import authReducer from "./slices/authSlice"
import cartReducer from "./slices/cartSlice"
import exampleReducer from "./slices/exampleSlice"

const rootReducer = combineReducers({
  example: exampleReducer,
  auth: authReducer,
  cart: cartReducer,
})

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"] as string[],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

