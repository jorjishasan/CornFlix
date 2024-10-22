/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from "react-redux";
import { TMDB_API_OPTIONS } from "../utils/constants";
import { addMoviesByCategory } from "../redux/moviesSlice";
import { useEffect } from "react";

const useMoviesByCategory = (category) => {
  const dispatch = useDispatch();

  const getMoviesByCategory = async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${category}?page=1`,
        TMDB_API_OPTIONS,
      );
      const json = await data.json();
      dispatch(addMoviesByCategory({ category, movies: json.results }));
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
    }
  };

  useEffect(() => {
    getMoviesByCategory();
  }, [category]);
};

export default useMoviesByCategory;
