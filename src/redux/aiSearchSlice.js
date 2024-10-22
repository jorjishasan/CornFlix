import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showAiSearchComponent: false,
  movieNames: null,
  moviesData: null,
};

const aiSearchSlice = createSlice({
  name: "aiSearch",
  initialState,
  reducers: {
    toggleAiSearchComponent: (state) => {
      state.showAiSearchComponent = !state.showAiSearchComponent;
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
