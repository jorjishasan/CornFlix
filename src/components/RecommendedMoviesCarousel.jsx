import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import RecommendedMovieCard from "./RecommendedMovieCard";

const SCROLL_INTERVAL = 3000; // 3 seconds
const ITEMS_PER_VIEW = 2;

const RecommendedMoviesCarousel = ({ movies }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef(null);
  const autoScrollRef = useRef(null);

  const totalPages = Math.ceil(movies.length / ITEMS_PER_VIEW);
  const allPages = Array.from({ length: totalPages }, (_, i) =>
    movies.slice(i * ITEMS_PER_VIEW, (i + 1) * ITEMS_PER_VIEW)
  );

  const startAutoScroll = () => {
    autoScrollRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, SCROLL_INTERVAL);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [totalPages]);

  const handleNext = () => {
    stopAutoScroll();
    setCurrentPage((prev) => (prev + 1) % totalPages);
    startAutoScroll();
  };

  const handlePrev = () => {
    stopAutoScroll();
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    startAutoScroll();
  };

  // Touch handling for swipe
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    stopAutoScroll();
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = null;
    startAutoScroll();
  };

  return (
    <div className="relative px-4">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="flex"
          animate={{ x: `${-currentPage * 100}%` }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
        >
          {allPages.map((pageMovies, pageIndex) => (
            <motion.div
              key={pageIndex}
              className="flex w-full flex-shrink-0 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {pageMovies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="w-1/2 px-2 first:pl-0 last:pr-0"
                  style={{ minWidth: '180px' }}
                >
                  <RecommendedMovieCard movie={movie} />
                </div>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <FaChevronLeft />
        </button>
        
        {/* Progress Bar */}
        <div className="relative h-1 flex-1 mx-4 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="absolute h-full bg-gradient-to-r from-red-600 to-purple-600 rounded-full"
            style={{
              width: `${((currentPage + 1) / totalPages) * 100}%`,
            }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
          />
        </div>

        <button
          onClick={handleNext}
          className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default RecommendedMoviesCarousel; 