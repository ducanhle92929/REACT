import { createSlice, createAction } from '@reduxjs/toolkit';
export const RESET_COUNTER = createAction('RESET_COUNTER');

const initialState = {
  value: 0,
};

// Tạo slice
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state, action) => {
      state.value += action.payload;
    },

    decrement: (state, action) => {
      state.value -= action.payload;
    },

    multiply: (state, action) => {
      state.value *= action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_COUNTER, (state) => {
      state.value = 0;
    });
  },
});

export const { increment, decrement, multiply } = counterSlice.actions;
export default counterSlice;
