import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showAiSearch: false,
  movieNames: null,
  moviesData: null,
};

const aiSearchSlice = createSlice({
  name: "aiSearch",
  initialState,
  reducers: {
    toggleAiSearchComponent: (state) => {
      state.showAiSearch = !state.showAiSearch;
    },
    setMovieNames: (state, action) => {
      state.movieNames = action.payload;
    },
    setMoviesData: (state, action) => {
      state.moviesData = action.payload;
    },
  },
});

export const { toggleAiSearchComponent, setMovieNames, setMoviesData } =
  aiSearchSlice.actions;

export default aiSearchSlice.reducer;
