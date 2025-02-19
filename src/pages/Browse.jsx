import MainContainer from "../components/MainContainer";
import SecondaryContainer from "../components/SecondaryContainer";
import Features from "../components/Features";
import useMoviesByCategory from "../hooks/useMoviesByCategory";
import RecommendedMovieShimmer from "../components/RecommendedMovieShimmer";
import { useSelector } from "react-redux";

const Browse = () => {
  useMoviesByCategory();
  const movies = useSelector((store) => store.movies);
  const isLoading = !movies || Object.values(movies).every(category => !category?.length);

  /* 
  Main Container
    - Video Background
    - Video title, short desc, action buttons
  Secondary Container
    - MovieList * n
      - cards * n
  
  */
  return (

        <>
          <MainContainer />
          {isLoading ? (
        <div className="min-h-screen bg-black pt-20">
          <RecommendedMovieShimmer />
        </div>
      ) : (
          <SecondaryContainer />
      )}
      <Features />
        </>
  );
};

export default Browse;
