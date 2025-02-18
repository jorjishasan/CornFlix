import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import useOpenAiChat from "../hooks/useOpenAiChat";
import { setClickedMovie } from "../redux/clickedMovieSlice";
import MovieCard from "./MovieCard";
import MovieShimmer from "./MovieShimmer";

const RecommendedMovies = ({ movie }) => {
  const dispatch = useDispatch();
  const { isLoading, fetchAndProcessRecommendations } = useOpenAiChat();
  const recommendations = useSelector((store) => store?.clickedMovie?.recommendations);

  // Memoize movie data to prevent unnecessary re-renders
  const movieData = useMemo(() => ({
    id: movie?.id,
    title: movie?.title,
    genres: movie?.genres?.map(g => g.name) || []
  }), [movie?.id, movie?.title, movie?.genres]);

  useEffect(() => {
    if (movieData.title && movieData.genres.length) {
      dispatch(setClickedMovie(movieData));
      fetchAndProcessRecommendations();
    }
  }, [movieData, dispatch, fetchAndProcessRecommendations]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white"
      >
        More Like This
      </motion.h2>

      {/* Genre Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {movie?.genres?.map((genre, index) => (
          <span
            key={index}
            className="rounded-full bg-white/10 px-4 py-1 text-sm text-white backdrop-blur-sm"
          >
            {genre.name}
          </span>
        ))}
      </motion.div>

      {/* Movies Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isLoading ? 'loading' : 'content'}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {isLoading ? (
            // Shimmer Loading State with flex-grow
            Array(12).fill(null).map((_, index) => (
              <motion.div
                key={`shimmer-${index}`}
                variants={itemVariants}
                className="flex aspect-[2/3] w-full"
              >
                <div className="flex-grow">
                  <MovieShimmer />
                </div>
              </motion.div>
            ))
          ) : (
            // Actual Movies
            recommendations?.map((movie, index) => (
              <motion.div
                key={`movie-${movie.id}-${index}`}
                variants={itemVariants}
                className="flex aspect-[2/3] w-full"
              >
                <div className="flex-grow">
                  <MovieCard movie={movie} />
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RecommendedMovies; 