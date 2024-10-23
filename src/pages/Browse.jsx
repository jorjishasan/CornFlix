import { useSelector } from "react-redux";
import AiSearch from "../components/AiSearch";
import MainContainer from "../components/MainContainer";
import SecondaryContainer from "../components/SecondaryContainer";
import useAllMovieCategories from "../hooks/useAllMovieCategories";

const Browse = () => {
  const showAiComponent = useSelector(
    (store) => store.aiSearch.showAiSearchComponent,
  );

  useAllMovieCategories();

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
