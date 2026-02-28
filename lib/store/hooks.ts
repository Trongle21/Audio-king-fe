import { useDispatch, useSelector, useStore } from "react-redux"
import type { AppDispatch, AppStore, RootState } from "./store"

// Sử dụng trong toàn bộ ứng dụng thay vì `useDispatch` và `useSelector` thông thường
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
