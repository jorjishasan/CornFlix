import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useOpenAiChat from "../hooks/useOpenAiChat";
import useSearchMoviesByName from "../hooks/useSearchMoviesByName";
import { 
  setClickedMovie, 
  clearRecommendations 
} from "../redux/clickedMovieSlice";
import RecommendedMoviesGrid from "./RecommendedMoviesGrid";
import RecommendedMovieShimmer from "./RecommendedMovieShimmer";
import CreditPurchasePrompt from "./CreditPurchasePrompt";

const RecommendedMovies = ({ movie }) => {
  const dispatch = useDispatch();
  const { isLoading: isLoadingRecommendations, error, fetchRecommendations } = useOpenAiChat();
  const { searchMovies } = useSearchMoviesByName();
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [processedMovies, setProcessedMovies] = useState([]);
  
  const credits = useSelector((store) => store.credits.count);
  const recommendedTitles = useSelector((store) => store.clickedMovie.recommendations);
  const globalError = useSelector((store) => store.credits.error);
  const currentMovieId = useSelector((store) => store.clickedMovie.movieData?.id);

  // Get AI recommendations when movie changes
  useEffect(() => {
    const getRecommendations = async () => {
      if (!movie || credits <= 0) return;
      
      // Only fetch if movie changed or no recommendations
      if (movie.id !== currentMovieId || !recommendedTitles?.length) {
        dispatch(clearRecommendations());
        setProcessedMovies([]);
        dispatch(setClickedMovie(movie));
        await fetchRecommendations();
      }
    };

    getRecommendations();
  }, [movie?.id, credits, currentMovieId, dispatch, fetchRecommendations, recommendedTitles?.length]);

  // Process recommended movies
  useEffect(() => {
    const processMovies = async () => {
      if (!recommendedTitles?.length) return;
      
      setIsLoadingMovies(true);
      try {
        const movies = await Promise.all(
          recommendedTitles.map(title => searchMovies(title))
        );
        setProcessedMovies(movies.filter(Boolean));
      } catch (error) {
        console.error("Error processing movies:", error);
      } finally {
        setIsLoadingMovies(false);
      }
    };

    processMovies();
  }, [recommendedTitles, searchMovies]);

  // Handle loading and error states
  if (credits <= 0 || globalError?.includes("Insufficient credits")) {
    return <CreditPurchasePrompt />;
  }

  if (isLoadingRecommendations || isLoadingMovies) {
    return (
      <div className="px-6">
        <h2 className="mb-4 text-lg font-medium text-white md:text-xl">
          {isLoadingRecommendations ? "Getting AI Recommendations..." : "Loading Movies..."}
        </h2>
        <RecommendedMovieShimmer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6">
        <h2 className="mb-4 text-lg font-medium text-red-500 md:text-xl">
          {error}
        </h2>
      </div>
    );
  }

  if (!processedMovies.length) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-white md:text-xl">
          AI Recommended Movies
        </h2>
        
        {/* Movie Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {movie.genres?.map((genre) => (
            <span
              key={genre.id}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 px-3 py-1 text-sm text-gray-300 ring-1 ring-inset ring-white/10 backdrop-blur-sm"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>

      <RecommendedMoviesGrid movies={processedMovies} />
    </div>
  );
};

export default RecommendedMovies; 