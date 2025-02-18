import { useState, useCallback } from "react";
import { TMDB_API_OPTIONS } from "../utils/constants";

const useSearchMoviesByName = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchMovies = useCallback(async (movieName) => {
    if (!movieName) return null;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          movieName
        )}&include_adult=false&language=en-US&page=1`,
        TMDB_API_OPTIONS
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Return the first (most relevant) result
      return data.results?.[0] || null;
    } catch (err) {
      console.error(`Error searching for movie "${movieName}":`, err);
      return null;
    }
  }, []);

  return { isLoading, error, searchMovies };
};

export default useSearchMoviesByName;
