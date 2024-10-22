import { createSlice } from "@reduxjs/toolkit";

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    trailerMap: {},
  },
  reducers: {
    addMoviesByCategory: (state, action) => {
      const { category, movies } = action.payload;
      state[category] = movies;
    },
    addTrailer: (state, action) => {
      const { movieId, trailer } = action.payload;
      state.trailerMap[movieId] = trailer;
    },
  },
});

export const { addMoviesByCategory, addTrailer } = moviesSlice.actions;

export default moviesSlice.reducer;
