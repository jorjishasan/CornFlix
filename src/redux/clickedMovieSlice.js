import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movieData: null,
  recommendations: null,
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
    clearMovieData: (state) => {
      state.movieData = null;
      state.recommendations = null;
    },
  },
});

export const { setClickedMovie, setMovieRecommendations, clearMovieData } = clickedMovieSlice.actions;
export default clickedMovieSlice.reducer; 