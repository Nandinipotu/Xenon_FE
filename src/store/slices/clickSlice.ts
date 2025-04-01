import { createSlice } from '@reduxjs/toolkit';

interface ClickState {
  count: number;
  showRating: boolean;
}

const initialState: ClickState = {
  count: 0,
  showRating: false,
};

const clickSlice = createSlice({
  name: 'click',
  initialState,
  reducers: {
    incrementClick(state) {
      state.count += 1;
      if (state.count >= 5) {
        state.showRating = true;
      }
    },
    resetClick(state) {
      state.count = 0;
      state.showRating = false;
    },
    closeRating(state) {
      state.showRating = false;
    },
  },
});

export const { incrementClick, resetClick, closeRating } = clickSlice.actions;
export default clickSlice.reducer;
