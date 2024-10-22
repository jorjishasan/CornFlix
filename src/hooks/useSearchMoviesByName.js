import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMoviesData } from "../redux/aiSearchSlice";
import { TMDB_API_OPTIONS } from "../utils/constants";

const useSearchMoviesByName = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const movieNames = useSelector((state) => state.aiSearch.movieNames);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!movieNames || movieNames.length === 0) return;

      setIsLoading(true);
      setError(null);

      // Instead of clearing, we'll just overwrite with new data
      try {
        const moviePromises = movieNames.map(async (movieName) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
              movieName,
            )}&include_adult=false&language=en-US&page=1`,
            TMDB_API_OPTIONS,
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          return data.results;
        });

        const moviesData = await Promise.all(moviePromises);
        dispatch(setMoviesData(moviesData));
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("An error occurred while fetching movie data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [movieNames, dispatch]);

  return { isLoading, error };
};

export default useSearchMoviesByName;
