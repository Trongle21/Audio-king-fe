import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// Interface định nghĩa state của slice
interface ExampleState {
  value: number
}

// State ban đầu
const initialState: ExampleState = {
  value: 0,
}

// Tạo slice với các reducers
export const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    // Tăng giá trị lên 1
    increment: (state) => {
      state.value += 1
    },
    // Giảm giá trị xuống 1
    decrement: (state) => {
      state.value -= 1
    },
    // Tăng giá trị theo số lượng được truyền vào
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

// Export các actions để sử dụng trong components
export const { increment, decrement, incrementByAmount } = exampleSlice.actions

// Export reducer để thêm vào store
export default exampleSlice.reducer
