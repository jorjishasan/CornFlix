import React from "react";
import { useSelector } from "react-redux";
import MovieList from "./MovieList";
import MOVIE_CATEGORIES from "../config/movieCategory";

const SecondaryContainer = () => {
  const movies = useSelector((store) => store.movies);

  return (
    movies && (
      <div className="bg-black">
        <div className="relative -mt-40 pl-10">
          {MOVIE_CATEGORIES.map((category) => (
            <MovieList
              key={category}
              title={category}
              movies={movies[category]}
            />
          ))}
        </div>
      </div>
    )
  );
};

export default SecondaryContainer;
