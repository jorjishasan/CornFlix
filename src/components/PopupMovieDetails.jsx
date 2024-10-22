import React from "react";
import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";
import { FaPlay, FaHeart, FaClock } from "react-icons/fa";

const PopupMovieDetails = ({ movie, x }) => {
  useMovieTrailer(movie?.id);
  const trailer = useSelector((store) => store.movies?.trailerMap?.[movie?.id]);

  if (!movie || x === null) return null;

  const style = {
    left: `${x}px`,
    zIndex: 1000,
  };

  return (
    <div
      style={style}
      className="pointer-events-none absolute top-0 w-[250px] select-none rounded-lg bg-gray-800 shadow-lg"
    >
      <div className="mb-2">
        {trailer ? (
          <iframe
            className="aspect-video w-full"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`}
            title={trailer.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        ) : (
          <div className="aspect-video w-full bg-gray-700"></div>
        )}
      </div>
      <div className="px-4 py-2">
        <h3 className="mb-2 font-bold text-white">{movie.title}</h3>
        <div className="mb-2 flex justify-between">
          <button className="rounded bg-red-600 px-4 py-1 text-white">
            <FaPlay className="mr-1 inline" /> Play Now
          </button>
          <button className="rounded bg-gray-600 px-2 py-1 text-white">
            <FaHeart className="h-6 w-6" />
          </button>
          <button className="rounded bg-gray-600 px-2 py-1 text-white">
            <FaClock className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupMovieDetails;
