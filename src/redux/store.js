import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";
import aiSearchReducer from "./aiSearchSlice";
import langReducer from "./langSlice";
import clickedMovieReducer from "./clickedMovieSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
    aiSearch: aiSearchReducer,
    lang: langReducer,
    clickedMovie: clickedMovieReducer,
  },
});

export default store;
