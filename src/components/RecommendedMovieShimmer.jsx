import { motion } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";

const ShimmerCard = () => (
  <div className="relative h-[280px] w-[200px] overflow-hidden rounded-lg bg-zinc-800">
    {/* Poster Shimmer */}
    <div className="h-full w-full">
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ translateX: ["100%", "-100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>

    {/* Content Shimmer */}
    <div className="absolute bottom-0 w-full space-y-2 bg-gradient-to-t from-black p-4">
      {/* Title Shimmer */}
      <div className="h-4 w-3/4 rounded bg-zinc-700">
        <motion.div
          className="h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ translateX: ["100%", "-100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
        />
      </div>

      {/* Rating Shimmer */}
      <div className="h-3 w-1/4 rounded bg-zinc-700">
        <motion.div
          className="h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ translateX: ["100%", "-100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.4 }}
        />
      </div>
    </div>

    {/* AI Badge Shimmer */}
    <div className="absolute right-2 top-2">
      <div className="h-6 w-20 rounded-full bg-zinc-700">
        <motion.div
          className="h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ translateX: ["100%", "-100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.6 }}
        />
      </div>
    </div>
  </div>
);

const RecommendedMovieShimmer = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-4 px-4">
        {[1, 2].map((i) => (
          <ShimmerCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 px-6">
      {[0, 1].map((row) => (
        <div
          key={row}
          className="grid grid-cols-5 gap-6"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <ShimmerCard key={`${row}-${i}`} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default RecommendedMovieShimmer; 