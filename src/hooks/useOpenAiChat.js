import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMovieRecommendations } from "../redux/clickedMovieSlice";
import openAiClient from "../config/openAiConfig";
import useSearchMoviesByName from "./useSearchMoviesByName";

const useOpenAiChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { searchMovies } = useSearchMoviesByName();
  const clickedMovie = useSelector((store) => store?.clickedMovie?.movieData ?? null);
  const recommendations = useSelector((store) => store?.clickedMovie?.recommendations ?? null);

  const fetchAndProcessRecommendations = useCallback(async () => {
    if (!clickedMovie?.title || !clickedMovie?.genres?.length) return;

    // If we already have recommendations for this movie, return early
    if (recommendations?.length > 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, get movie recommendations from OpenAI
      const genreNames = clickedMovie.genres.join(", ");
      const prompt = `You are a movie recommendation system, based on these genres ${genreNames} and the movie "${clickedMovie.title}" suggest 12 movies. Provide only movie titles as a comma-separated list.`;
      
      const response = await openAiClient.post("/chat", {
        messages: [
          {
            role: "system",
            content: "You are a movie recommendation assistant. Provide only movie titles as a comma-separated list."
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        model: "gpt-3.5-turbo-16k",
        store: true,
      });

      const movieTitles = response.choices[0].message.content
        .split(",")
        .map(title => title.trim())
        .filter(title => title.length > 0);

      // Then, fetch movie details in parallel
      const searchResults = await Promise.all(
        movieTitles.slice(0, 12).map(async (title) => {
          const result = await searchMovies(title);
          return result;
        })
      );

      // Filter out null results and ensure we have valid movies
      const validMovies = searchResults.filter(movie => movie !== null);

      if (validMovies.length > 0) {
        dispatch(setMovieRecommendations(validMovies));
        setIsLoading(false);
      } else {
        // If no valid movies found, keep the loading state and set error
        setError("Could not find details for the recommended movies.");
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("An error occurred while processing your request.");
      // Don't set isLoading to false on error, keep showing shimmer
    }
  }, [dispatch, clickedMovie, recommendations, searchMovies]);

  return { isLoading, error, fetchAndProcessRecommendations };
};

export default useOpenAiChat; 