import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaPlus, FaThumbsUp } from "react-icons/fa";
import { IMG_CDN_URL } from "../utils/constants";

const MovieCard = ({ movie }) => {
  const { id, poster_path, title, vote_average } = movie;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/browse/${id}`);
  };

  return (
    <motion.div
      className="group relative w-[180px] flex-shrink-0 cursor-pointer overflow-hidden rounded-lg"
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
    >
      {/* Poster Image */}
      <motion.img 
        className="h-full w-full object-cover transition-transform duration-300 group-hover:brightness-75"
        src={IMG_CDN_URL + poster_path} 
        alt={title}
        loading="lazy"
      />

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        {/* Top Section - Rating */}
        <div className="flex items-center justify-end">
          <div className="flex items-center rounded-md bg-black/60 px-2 py-1 backdrop-blur-sm">
            <FaThumbsUp className="mr-1 text-xs text-yellow-500" />
            <span className="text-xs font-medium text-yellow-500">
              {Math.round(vote_average * 10)}%
            </span>
          </div>
        </div>

        {/* Bottom Section - Title and Actions */}
        <div className="space-y-3">
          <h3 className="line-clamp-2 text-sm font-medium text-white">
            {title}
          </h3>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full bg-white p-2 text-black transition-transform hover:bg-white/90"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/browse/${id}`);
              }}
            >
              <FaPlay className="text-xs" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full border border-white/30 p-2 text-white transition-transform hover:border-white"
              onClick={(e) => e.stopPropagation()}
            >
              <FaPlus className="text-xs" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MovieCard;
