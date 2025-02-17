import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";
import { FaPlay, FaPlus, FaThumbsUp, FaClock, FaStar, FaCalendar } from "react-icons/fa";

const PopupMovieDetails = ({ movie, x }) => {
  useMovieTrailer(movie?.id);
  const trailer = useSelector((store) => store.movies?.trailerMap?.[movie?.id]);

  if (!movie || x === null) return null;

  const {
    title,
    overview,
    vote_average,
    release_date,
    original_language,
    popularity
  } = movie;

  const style = {
    left: `${Math.min(Math.max(x, 0), window.innerWidth - 400)}px`,
    zIndex: 1000,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={style}
      className="pointer-events-none absolute top-0 w-[400px] select-none overflow-hidden rounded-xl bg-zinc-900/95 shadow-xl backdrop-blur-sm ring-1 ring-white/10"
    >
      {/* Trailer Section */}
      <div className="relative aspect-video w-full overflow-hidden">
        {trailer ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
            title={trailer.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black/50">
            <FaPlay className="text-4xl text-white/50" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/95 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Rating */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <div className="flex items-center rounded-md bg-yellow-500/10 px-2 py-1">
            <FaStar className="mr-1 text-yellow-500" />
            <span className="font-medium text-yellow-500">
              {Math.round(vote_average * 10)}%
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <FaCalendar className="text-gray-500" />
            <span>{new Date(release_date).getFullYear()}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock className="text-gray-500" />
            <span>2h 15m</span>
          </div>
          <div className="flex items-center gap-1 capitalize">
            <span className="rounded bg-gray-800 px-2 py-0.5 text-xs">
              {original_language}
            </span>
          </div>
        </div>

        {/* Overview */}
        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-gray-300">
          {overview}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            <FaPlay className="text-xs" />
            Play
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <FaPlus className="text-xs" />
            My List
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <FaThumbsUp className="text-xs" />
            Rate
          </motion.button>
        </div>

        {/* Popularity Badge */}
        {popularity > 100 && (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-purple-500/10 p-2 text-sm text-purple-400">
            <FaThumbsUp className="text-xs" />
            Popular on CORNFLIX
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PopupMovieDetails;
