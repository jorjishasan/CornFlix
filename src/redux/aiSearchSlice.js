import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showAiSearch: false,
  movieNames: null,
  moviesData: null,
  recommendations: {}, // Cache recommendations by movieId
  lastFetchTimestamp: {}, // Track when recommendations were last fetched
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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
    cacheRecommendations: (state, action) => {
      const { movieId, recommendations } = action.payload;
      state.recommendations[movieId] = recommendations;
      state.lastFetchTimestamp[movieId] = Date.now();
    },
    clearStaleCache: (state) => {
      const now = Date.now();
      Object.keys(state.lastFetchTimestamp).forEach(movieId => {
        if (now - state.lastFetchTimestamp[movieId] > CACHE_DURATION) {
          delete state.recommendations[movieId];
          delete state.lastFetchTimestamp[movieId];
        }
      });
    },
  },
});

export const { 
  toggleAiSearchComponent, 
  setMovieNames, 
  setMoviesData,
  cacheRecommendations,
  clearStaleCache
} = aiSearchSlice.actions;

export default aiSearchSlice.reducer;
