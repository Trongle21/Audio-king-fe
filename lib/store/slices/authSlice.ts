import { createSlice } from "@reduxjs/toolkit"

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: Record<string, unknown> | null
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: {
        payload: {
          accessToken: string
          refreshToken: string | null
          user?: Record<string, unknown>
        }
      },
    ) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.user = action.payload.user ?? null
    },
    clearAuth: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.user = null
    },
  },
})

export const { setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer

