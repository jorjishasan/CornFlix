import { createSlice } from "@reduxjs/toolkit";
import lang from "../config/languages";

const langSlice = createSlice({
  name: "lang",
  initialState: {
    langSelected: Object.keys(lang)[0],
  },
  reducers: {
    switchLanguage: (state, action) => {
      state.langSelected = action.payload;
    },
  },
});

export const { switchLanguage } = langSlice.actions;
export default langSlice.reducer;
