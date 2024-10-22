import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TMDB_API_OPTIONS } from "../utils/constants";
import { addTrailer } from "../redux/moviesSlice";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();
  const trailerMap = useSelector((store) => store.movies.trailerMap);

  const getMovieVideos = async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
        TMDB_API_OPTIONS,
      );
      const json = await data.json();

      const filterData = json.results.filter(
        (video) => video.type === "Trailer",
      );
      const trailer = filterData.length ? filterData[0] : json.results[0];
      dispatch(addTrailer({ movieId, trailer }));
    } catch (error) {
      console.error("Error fetching movie trailer:", error);
    }
  };

  useEffect(() => {
    if (!trailerMap[movieId]) {
      getMovieVideos();
    }
  }, []);
};

export default useMovieTrailer;
