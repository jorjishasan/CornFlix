import React from "react";
import { useSelector } from "react-redux";
import MovieList from "./MovieList";
import MOVIE_CATEGORIES from "../config/movieCategory";

const SecondaryContainer = () => {
  const movies = useSelector((store) => store.movies);

  return (
    movies && (
      <div className="bg-black">
        <div className="relative sm:m-0 lg:-mt-56 lg:pl-10">
          {MOVIE_CATEGORIES.map((category) => (
            <MovieList
              key={category}
              title={category
                .toLowerCase()
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              movies={movies[category]}
            />
          ))}
        </div>
      </div>
    )
  );
};

export default SecondaryContainer;
