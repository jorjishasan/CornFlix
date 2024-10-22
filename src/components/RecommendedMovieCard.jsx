import React from "react";
import { motion } from "framer-motion";
import { IMG_CDN_URL } from "../utils/constants";

const RecommendedMovieCard = ({ movie }) => {
  const fallbackImageUrl =
    "https://images.unsplash.com/photo-1568038904349-849e9a803462?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const backdropUrl = movie.backdrop_path
    ? `${IMG_CDN_URL}${movie.backdrop_path}`
    : fallbackImageUrl;

  return (
    <motion.div
      className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={backdropUrl}
        alt={movie.title}
        className="h-auto w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="mb-2 text-xl font-bold text-white">{movie.title}</h3>
          <p className="mb-1 text-sm text-gray-300">
            Release Date: {movie.release_date}
          </p>
          <p className="line-clamp-3 text-xs text-gray-400">{movie.overview}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendedMovieCard;
