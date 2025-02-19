import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";
import { useState, useEffect } from "react";

const VideoBackground = ({ movieId }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const trailer = useSelector((store) => store.movies.trailerMap[movieId]);
  useMovieTrailer(movieId);

  // Delay loading the iframe to prevent performance issues
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!trailer || !shouldLoad) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playlist=${trailer.key}`}
        title={trailer.name || "Movie Trailer"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoBackground;
