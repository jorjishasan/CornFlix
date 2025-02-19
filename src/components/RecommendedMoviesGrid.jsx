import { useMediaQuery } from "../hooks/useMediaQuery";
import RecommendedMoviesCarousel from "./RecommendedMoviesCarousel";
import RecommendedMoviesDesktop from "./RecommendedMoviesDesktop";

const RecommendedMoviesGrid = ({ movies }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <RecommendedMoviesCarousel movies={movies} />
  ) : (
    <RecommendedMoviesDesktop movies={movies} />
  );
};

export default RecommendedMoviesGrid; 