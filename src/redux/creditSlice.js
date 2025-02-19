import { createSlice } from "@reduxjs/toolkit";

const creditSlice = createSlice({
  name: "credits",
  initialState: {
    count: 0,
    isLoading: false,
    error: null,
    showWelcomeModal: false,
  },
  reducers: {
    setCredits: (state, action) => {
      state.count = action.payload;
    },
    deductCredit: (state) => {
      state.count -= 1;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setShowWelcomeModal: (state, action) => {
      state.showWelcomeModal = action.payload;
    },
  },
});

export const { 
  setCredits, 
  deductCredit, 
  setLoading, 
  setError,
  setShowWelcomeModal,
} = creditSlice.actions;

export default creditSlice.reducer; 