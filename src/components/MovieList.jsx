import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MovieCard from "./MovieCard";

const ScrollButton = ({ direction, onClick, isVisible }) => (
  <motion.button
    initial={{ opacity: 0 }}
    animate={{ opacity: isVisible ? 1 : 0 }}
    whileHover={{ scale: 1.1 }}
    onClick={onClick}
    className={`absolute top-1/2 z-10 flex h-full w-12 -translate-y-1/2 items-center justify-center bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 ${
      direction === "left" ? "left-0" : "right-0"
    }`}
  >
    {direction === "left" ? (
      <FaChevronLeft className="text-2xl" />
    ) : (
      <FaChevronRight className="text-2xl" />
    )}
  </motion.button>
);

const MovieList = ({ title, movies }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftScroll(container.scrollLeft > 0);
      setShowRightScroll(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -container.clientWidth : container.clientWidth;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!movies?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative px-4 py-6 text-white md:px-6"
    >
      <h2 className="mb-4 text-xl font-medium md:text-2xl">{title}</h2>
      
      <div className="group relative">
        <ScrollButton
          direction="left"
          onClick={() => scroll("left")}
          isVisible={showLeftScroll}
        />

        <div
          className="no-scrollbar relative flex gap-4 overflow-x-scroll scroll-smooth"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {movies.map((movie) => (
            <Link 
              key={movie.id} 
              to={`/browse/${movie.id}`}
              className="flex-shrink-0"
            >
              <MovieCard movie={movie} />
            </Link>
          ))}
        </div>

        <ScrollButton
          direction="right"
          onClick={() => scroll("right")}
          isVisible={showRightScroll}
        />
      </div>
    </motion.div>
  );
};

export default MovieList;
