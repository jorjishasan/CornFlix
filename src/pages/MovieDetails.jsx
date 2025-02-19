import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { 
  FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand, 
  FaInfoCircle, FaPlus, FaThumbsUp, FaTimes, FaStar 
} from "react-icons/fa";
import useMovieTrailer from "../hooks/useMovieTrailer";
import VideoBackground from "../components/VideoBackground";
import RecommendedMovies from "../components/RecommendedMovies";
import { 
  setClickedMovie, 
  setMovieRecommendations,
  clearRecommendations 
} from "../redux/clickedMovieSlice";
import RecommendedMovieShimmer from "../components/RecommendedMovieShimmer";

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

const MovieInfo = ({ movie, isOpen, onClose }) => {
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-zinc-900 p-6 shadow-xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <FaTimes className="text-xl" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <div className="flex items-center rounded-md bg-yellow-500/10 px-3 py-2">
                  <FaStar className="mr-2 text-yellow-500" />
                  <span className="font-medium text-yellow-500">
                    {Math.round(vote_average * 10)}%
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span>{new Date(release_date).getFullYear()}</span>
                <span>2h 15m</span>
                <span className="rounded-md bg-gray-800 px-2 py-1 uppercase">
                  {original_language}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-white/10 px-3 py-1 text-sm text-white"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-gray-300">{overview}</p>

              {popularity > 100 && (
                <div className="inline-flex items-center gap-2 rounded-lg bg-purple-500/10 px-4 py-2 text-purple-400">
                  <FaThumbsUp className="text-sm" />
                  Popular on CORNFLIX
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  
  // Extract numeric ID if it's a string with a title
  const numericId = useMemo(() => {
    return typeof movieId === 'string' ? movieId.split('-')[0] : movieId;
  }, [movieId]);
  
  // Call useMovieTrailer hook with numeric ID
  useMovieTrailer(numericId);
  const trailer = useSelector((store) => store.movies?.trailerMap?.[numericId]);

  // Clear recommendations and reset state when movieId changes
  useEffect(() => {
    dispatch(clearRecommendations());
    setMovie(null);
    setIsLoading(true);
    
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${numericId}?append_to_response=credits,similar,videos`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
            },
          }
        );
        const data = await response.json();
        setMovie(data);
        dispatch(setClickedMovie(data));
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (numericId) {
      fetchMovieDetails();
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearRecommendations());
    };
  }, [numericId, dispatch]);

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <RecommendedMovieShimmer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* First Container: Video and Quick Actions */}
          <section className="space-y-6">
            {/* Video Background */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
              <VideoBackground movieId={numericId} />
            </div>

            {/* Title and Actions */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
                <div className="flex items-center rounded-md bg-yellow-500/10 px-3 py-2">
                  <FaStar className="mr-2 text-yellow-500" />
                  <span className="font-medium text-yellow-500">
                    {Math.round(movie.vote_average * 10)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInfo(true)}
                  className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <FaInfoCircle />
                  <span>About</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-md bg-white px-4 py-2 font-medium text-black transition-colors hover:bg-white/90"
                >
                  <FaPlus className="text-sm" />
                  <span>My List</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-white transition-colors hover:bg-white/10"
                >
                  <FaThumbsUp className="text-sm" />
                  <span>Rate</span>
                </motion.button>
              </div>
            </div>
          </section>

          {/* Second Container: Recommendations */}
          <section className="pb-12">
            <RecommendedMovies movie={movie} />
          </section>
        </div>
      </main>

      {/* Movie Info Modal */}
      <MovieInfo 
        movie={movie} 
        isOpen={showInfo} 
        onClose={() => setShowInfo(false)} 
      />
    </div>
  );
};

export default MovieDetails; 