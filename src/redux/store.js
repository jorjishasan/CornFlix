import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";
import langReducer from "./langSlice";
import clickedMovieReducer from "./clickedMovieSlice";
import creditReducer from "./creditSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
    lang: langReducer,
    clickedMovie: clickedMovieReducer,
    credits: creditReducer,
  },
});

export default store;
