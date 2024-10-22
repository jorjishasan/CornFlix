import React, { useRef, useState } from "react";
import MovieCard from "./MovieCard";
import useScrollProgress from "../hooks/useScrollProgress";
import useHoverCoordinates from "../hooks/useHoverCoordinates";
import PopupMovieDetails from "./PopupMovieDetails";

const MovieList = ({ title, movies }) => {
  const scrollContainerRef = useRef(null);
  const scrollProgress = useScrollProgress(scrollContainerRef);
  const [hoverX, handleMouseEnter, handleMouseLeave] = useHoverCoordinates();
  const [hoveredMovie, setHoveredMovie] = useState(null);

  const handleCardHover = (event, movie) => {
    handleMouseEnter(event);
    setHoveredMovie(movie);
  };

  const handleCardLeave = () => {
    handleMouseLeave();
    setHoveredMovie(null);
  };

  return (
    <div className="relative px-6 text-white">
      <h1 className="py-4 text-lg md:text-3xl">{title}</h1>
      <div className="relative">
        <div
          className="scrollbar-hide overflow-x-scroll"
          ref={scrollContainerRef}
        >
          <div className="flex gap-4 pb-4">
            {movies && movies.length > 0 ? (
              movies.map((movie) => (
                <div
                  key={movie.id}
                  onMouseEnter={(e) => handleCardHover(e, movie)}
                  onMouseLeave={handleCardLeave}
                >
                  <MovieCard movie={movie} />
                </div>
              ))
            ) : (
              <p>No movies available</p>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 h-1.5 w-[100px] -translate-x-1/2 bg-gray-300">
          <div
            className="absolute left-0 h-full bg-red-600 transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
      </div>
      {hoveredMovie && hoverX !== null && (
        <PopupMovieDetails movie={hoveredMovie} x={hoverX} />
      )}
    </div>
  );
};

export default MovieList;
