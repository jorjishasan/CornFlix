import React from "react";
import { IMG_CDN_URL } from "../utils/constants";

const MovieCard = ({ movie: { poster_path } }) => {
  return (
    <div className="w-[180px] flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-105">
      <img className="w-full" src={IMG_CDN_URL + poster_path} alt="poster" />
    </div>
  );
};

export default MovieCard;
