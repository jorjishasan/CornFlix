import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand, FaClock, FaStar, FaCalendar, FaPlus, FaThumbsUp } from "react-icons/fa";
import useMovieTrailer from "../hooks/useMovieTrailer";
import RecommendedMovies from "../components/RecommendedMovies";

const VideoPlayer = ({ trailer, title }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleMute = () => setIsMuted(!isMuted);
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      {trailer ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&playsinline=1${isPlaying ? '' : '&pause=1'}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <FaPlay className="text-4xl text-white/50" />
        </div>
      )}

      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlayPause}
              className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMute}
              className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFullscreen}
            className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <FaExpand />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const MovieInfo = ({ movie }) => {
  const {
    title,
    overview,
    vote_average,
    release_date,
    original_language,
    popularity,
    genres
  } = movie;

  return (
    <div className="space-y-8">
      {/* Title and Rating */}
      <div className="flex items-start justify-between gap-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white"
        >
          {title}
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center rounded-md bg-yellow-500/10 px-3 py-2"
        >
          <FaStar className="mr-2 text-yellow-500" />
          <span className="text-lg font-medium text-yellow-500">
            {Math.round(vote_average * 10)}%
          </span>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-6 text-gray-400"
      >
        <div className="flex items-center gap-2">
          <FaCalendar className="text-gray-500" />
          <span>{new Date(release_date).getFullYear()}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-gray-500" />
          <span>2h 15m</span>
        </div>
        <div className="flex items-center gap-2 capitalize">
          <span className="rounded-md bg-gray-800 px-3 py-1">
            {original_language}
          </span>
        </div>
      </motion.div>

      {/* Genres */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {genres?.map((genre) => (
          <span
            key={genre.id}
            className="rounded-full bg-white/10 px-4 py-1 text-sm text-white backdrop-blur-sm"
          >
            {genre.name}
          </span>
        ))}
      </motion.div>

      {/* Overview */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg leading-relaxed text-gray-300"
      >
        {overview}
      </motion.p>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-md bg-white px-6 py-3 text-base font-medium text-black transition-colors hover:bg-white/90"
        >
          <FaPlus className="text-sm" />
          Add to My List
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-md border border-white/20 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
        >
          <FaThumbsUp className="text-sm" />
          Rate
        </motion.button>
      </motion.div>

      {/* Popularity Badge */}
      {popularity > 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-500/10 px-4 py-2 text-purple-400"
        >
          <FaThumbsUp className="text-sm" />
          Popular on CORNFLIX
        </motion.div>
      )}
    </div>
  );
};

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  useMovieTrailer(movieId);
  const trailer = useSelector((store) => store.movies?.trailerMap?.[movieId]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits,similar,videos`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
            },
          }
        );
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* First Container: Video Player Section */}
          <section className="space-y-8">
            <VideoPlayer trailer={trailer} title={movie.title} />
            <MovieInfo movie={movie} />
          </section>

          {/* Second Container: Recommendations Section */}
          <section className="pb-12">
            <RecommendedMovies movie={movie} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default MovieDetails; 