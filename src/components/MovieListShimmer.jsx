import { motion } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";

const ShimmerCard = () => (
  <div className="relative aspect-[2/3] w-[150px] overflow-hidden rounded-lg bg-zinc-800/50 sm:w-[180px]">
    <motion.div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
      animate={{ translateX: ["100%", "-100%"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const MovieListShimmer = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const itemsToShow = isMobile ? 3 : 6;

  return (
    <div className="px-4 py-6 md:px-6">
      {/* Title Shimmer */}
      <div className="mb-4 h-6 w-48 rounded-md bg-zinc-800/50" />
      
      {/* Cards Container */}
      <div className="flex gap-4">
        {Array.from({ length: itemsToShow }).map((_, i) => (
          <div key={i} className="flex-shrink-0">
            <ShimmerCard />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieListShimmer; 