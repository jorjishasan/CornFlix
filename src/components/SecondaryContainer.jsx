import { useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import MovieList from "./MovieList";
import MOVIE_CATEGORIES from "../config/movieCategory";
import { useMediaQuery } from "../hooks/useMediaQuery";

const SecondaryContainer = () => {
  const movies = useSelector((store) => store.movies);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Memoize category titles
  const categoryTitles = useMemo(() => 
    MOVIE_CATEGORIES.map(category => ({
      id: category,
      title: category
        .toLowerCase()
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    })),
    []
  );

  if (!movies) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-b from-black via-black/95 to-zinc-900"
    >
      <div className={`relative ${!isMobile ? "lg:-mt-56" : ""}`}>
        {categoryTitles.map(({ id, title }) => (
          <MovieList
            key={id}
            title={title}
            movies={movies[id]}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SecondaryContainer;
