import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movieData: null,
  recommendations: [],
};

const clickedMovieSlice = createSlice({
  name: "clickedMovie",
  initialState,
  reducers: {
    setClickedMovie: (state, action) => {
      state.movieData = action.payload;
    },
    setMovieRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
    },
  },
});

export const { 
  setClickedMovie, 
  setMovieRecommendations, 
  clearRecommendations 
} = clickedMovieSlice.actions;

export default clickedMovieSlice.reducer; 