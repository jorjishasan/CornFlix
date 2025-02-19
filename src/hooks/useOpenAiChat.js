import { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMovieRecommendations, clearRecommendations } from "../redux/clickedMovieSlice";
import openAiClient from "../config/openAiConfig";
import { setError as setGlobalError } from "../redux/creditSlice";
import { getUserCredits, deductCredit } from "../services/creditService";

const useOpenAiChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const clickedMovie = useSelector((store) => store?.clickedMovie?.movieData);
  const user = useSelector((store) => store.user);
  const requestInProgress = useRef(false);
  const lastProcessedMovieId = useRef(null);

  // Clear recommendations when unmounting
  useEffect(() => {
    return () => {
      dispatch(clearRecommendations());
      requestInProgress.current = false;
      lastProcessedMovieId.current = null;
    };
  }, [dispatch]);

  const fetchRecommendations = useCallback(async () => {
    if (!clickedMovie?.title || !user?.uid) {
      setError("Required data is missing");
      return;
    }

    // Prevent duplicate processing for the same movie
    if (requestInProgress.current || lastProcessedMovieId.current === clickedMovie.id) {
      return;
    }

    setIsLoading(true);
    setError(null);
    dispatch(setGlobalError(null));
    dispatch(clearRecommendations());
    requestInProgress.current = true;

    try {
      // Check credits
      const currentCredits = await getUserCredits(user.uid);
      if (currentCredits <= 0) {
        throw new Error("Insufficient credits");
      }

      // Get recommendations
      const genreNames = clickedMovie.genres
        .map(genre => genre.name || genre)
        .filter(Boolean)
        .join(", ");

      const { recommendations } = await openAiClient.post("/chat", {
        movieTitle: clickedMovie.title,
        genres: genreNames
      });

      // Deduct credit only after successful API call
      await deductCredit(user.uid);

      // Update Redux store
      dispatch(setMovieRecommendations(recommendations));
      lastProcessedMovieId.current = clickedMovie.id;
      return recommendations;

    } catch (err) {
      const errorMessage = err.message.includes("Insufficient credits")
        ? "Please purchase more credits to continue"
        : "Failed to get recommendations. Please try again.";
      
      setError(errorMessage);
      dispatch(setGlobalError(errorMessage));
      return null;

    } finally {
      setIsLoading(false);
      requestInProgress.current = false;
    }
  }, [clickedMovie, dispatch, user]);

  return { isLoading, error, fetchRecommendations };
};

export default useOpenAiChat; 