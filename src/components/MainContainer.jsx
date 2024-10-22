import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";

const MainContainer = () => {
  const movies = useSelector((store) => store.movies.upcoming);

  if (!movies || movies.length === 0) return null;

  const mainMovie = movies[0];

  if (!mainMovie) return null;

  const { original_title, overview, id } = mainMovie;

  return (
    <div className="relative w-full overflow-hidden bg-black">
      <VideoBackground movieId={id} />
      <VideoTitle title={original_title} description={overview} />
    </div>
  );
};

export default MainContainer;
