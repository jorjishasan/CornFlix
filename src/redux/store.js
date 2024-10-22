import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";
import aiSearchReducer from "./aiSearchSlice";
import langReducer from "./langSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
    aiSearch: aiSearchReducer,
    lang: langReducer,
  },
});

export default store;
