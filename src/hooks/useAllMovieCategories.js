import { useMemo } from "react";
import useMoviesByCategory from "./useMoviesByCategory";
import MOVIE_CATEGORIES from "../config/movieCategory";

const useAllMovieCategories = () => {
  const categoryHooks = useMemo(() => {
    return MOVIE_CATEGORIES.map((category) => useMoviesByCategory(category));
  }, []);

  return categoryHooks;
};

export default useAllMovieCategories;
