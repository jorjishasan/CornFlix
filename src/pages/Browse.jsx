import MainContainer from "../components/MainContainer";
import SecondaryContainer from "../components/SecondaryContainer";
import useMoviesByCategory from "../hooks/useMoviesByCategory";

const Browse = () => {
  useMoviesByCategory();

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
      <SecondaryContainer />
    </>
  );
};

export default Browse;
