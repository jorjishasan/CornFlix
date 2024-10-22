import { useSelector } from "react-redux";
import AiSearch from "../components/AiSearch";
import MainContainer from "../components/MainContainer";
import SecondaryContainer from "../components/SecondaryContainer";
import useMoviesByCategory from "../hooks/useMoviesByCategory";
import MOVIE_CATEGORIES from "../config/movieCategory";

const setMovieDataByCategoryToStore = () => {
  MOVIE_CATEGORIES.forEach((category) => useMoviesByCategory(category));
};

const Browse = () => {
  setMovieDataByCategoryToStore();
  const showAiComponent = useSelector(
    (store) => store.aiSearch.showAiSearchComponent,
  );

  /* 
  Main Container
    - Video Background
    - Video title, short desc, action buttons
  Secondary Container
    - MovieList * n
      - cards * n
  
  */
  return showAiComponent ? (
    <AiSearch />
  ) : (
    <>
      <MainContainer />
      <SecondaryContainer />
    </>
  );
};

export default Browse;
