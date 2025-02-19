import { useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaFilm, FaFire, FaStar, FaClock } from "react-icons/fa";
import MovieCard from "./MovieCard";
import PopupMovieDetails from "./PopupMovieDetails";
import { useMediaQuery } from "../hooks/useMediaQuery";

// Constants
const SCROLL_AMOUNT = 0.8;

// Helper function to get category icon
const getCategoryIcon = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('popular')) return FaFire;
  if (lowerTitle.includes('top') || lowerTitle.includes('rated')) return FaStar;
  if (lowerTitle.includes('upcoming') || lowerTitle.includes('now')) return FaClock;
  return FaFilm;
};

// Helper function to format movie URL
const formatMovieUrl = (movie) => {
  const { id } = movie;
  return `/browse/${id}`;
};

const MovieList = ({ title, movies }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const progress = container.scrollLeft / (container.scrollWidth - container.clientWidth);
      setScrollProgress(progress);
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  }, []);

  // Handle scroll button clicks
  const scroll = useCallback((direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" 
        ? -container.clientWidth * SCROLL_AMOUNT 
        : container.clientWidth * SCROLL_AMOUNT;
      
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    }
  }, []);

  // Handle movie hover with boundary check
  const handleMovieHover = useCallback((movie, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.top + (rect.height / 2);
    
    setHoverPosition({ x, y });
    setHoveredMovie(movie);
  }, []);

  // Add debounced hover exit
  const handleMovieLeave = useCallback(() => {
    setTimeout(() => setHoveredMovie(null), 200);
  }, []);

  const CategoryIcon = getCategoryIcon(title);

  if (!movies?.length) return null;

  return (
    <div className="relative py-6">
      <div className="mb-4 flex items-center gap-3 px-4 md:px-6">
        <CategoryIcon className="text-xl text-[#E50914]" />
        <h2 className="text-xl font-bold text-white md:text-2xl">
          {title}
        </h2>
      </div>
      
      <div className="relative">
        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute -top-2 left-0 h-[2px] bg-[#E50914]"
          style={{
            width: `${scrollProgress * 100}%`,
            zIndex: 30
          }}
        />

        {/* Scroll Buttons */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showLeftArrow ? 1 : 0 }}
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 z-20 hidden h-full w-24 items-center justify-center bg-gradient-to-r from-black via-black/80 to-transparent lg:flex"
        >
          <FaChevronLeft className="text-4xl text-white/90 transition-transform hover:scale-125" />
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showRightArrow ? 1 : 0 }}
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 z-20 hidden h-full w-24 items-center justify-center bg-gradient-to-l from-black via-black/80 to-transparent lg:flex"
        >
          <FaChevronRight className="text-4xl text-white/90 transition-transform hover:scale-125" />
        </motion.button>

        {/* Movie List */}
        <div
          className="flex gap-4 overflow-x-scroll px-4 md:px-6 scrollbar-hide"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              onMouseEnter={(e) => handleMovieHover(movie, e)}
              onMouseLeave={handleMovieLeave}
            >
              <Link to={formatMovieUrl(movie)}>
                <MovieCard movie={movie} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popup Movie Details */}
      {hoveredMovie && (
        <PopupMovieDetails
          movie={hoveredMovie}
          x={hoverPosition.x}
          y={hoverPosition.y}
          onClose={() => setHoveredMovie(null)}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default MovieList;
