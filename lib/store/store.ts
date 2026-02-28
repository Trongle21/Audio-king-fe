import { configureStore } from "@reduxjs/toolkit"

import exampleReducer from "./slices/exampleSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Thêm các reducers của bạn vào đây
      example: exampleReducer,
    },
  })
}

// Suy luận kiểu của makeStore
export type AppStore = ReturnType<typeof makeStore>
// Suy luận kiểu `RootState` và `AppDispatch` từ store
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
