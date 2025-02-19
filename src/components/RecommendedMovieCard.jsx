import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaStar, FaRobot } from "react-icons/fa";
import { IMG_CDN_URL } from "../utils/constants";

const RecommendedMovieCard = ({ movie }) => {
  const { id, poster_path, title, vote_average, overview, release_date } = movie;

  return (
    <Link to={`/browse/${id}`}>
      <motion.div
        className="group relative h-[280px] w-[200px] cursor-pointer overflow-hidden rounded-lg bg-zinc-900"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {/* AI Badge */}
        <div className="absolute right-2 top-2 z-10">
          <motion.div 
            className="flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-indigo-600/90 px-3 py-1.5 text-xs font-medium shadow-lg shadow-purple-500/20 backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="animate-pulse text-purple-200">✨</span>
            <span className="bg-gradient-to-r from-purple-100 via-white to-purple-100 bg-clip-text font-semibold text-transparent">
              CornflixAI
            </span>
            <span className="animate-pulse text-purple-200 [animation-delay:200ms]">✨</span>
          </motion.div>
        </div>

        {/* Poster Image */}
        <div className="relative h-full w-full">
          <img
            className="h-full w-full object-cover transition-all duration-300 group-hover:brightness-50"
            src={IMG_CDN_URL + poster_path}
            alt={title}
            loading="lazy"
          />
          
          {/* Hover Info Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black via-black/50 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 backdrop-blur-sm">
                <FaStar className="text-xs text-yellow-500" />
                <span className="text-xs font-medium text-yellow-500">
                  {Math.round(vote_average * 10)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="line-clamp-2 text-sm font-medium text-white">
                {title}
              </h3>
              <p className="line-clamp-2 text-xs text-gray-300">
                {overview}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(release_date).getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default RecommendedMovieCard;
