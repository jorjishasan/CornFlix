import { motion } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";

const ShimmerCard = () => (
  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-800">
    <motion.div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
      animate={{ translateX: ["100%", "-100%"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const RecommendedMovieShimmer = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <div className="px-4">
        <div className="flex gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="w-1/2">
              <ShimmerCard />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop layout with exactly 10 items in 2 rows
  const itemsPerRow = 5; // 5 items per row for 10 total
  return (
    <div className="space-y-8 px-6">
      {[0, 1].map((row) => (
        <div
          key={row}
          className="flex flex-wrap justify-start gap-6"
          style={{
            '--min-card-width': '200px',
            '--gap': '1.5rem',
          }}
        >
          {Array.from({ length: itemsPerRow }).map((_, i) => (
            <div
              key={`${row}-${i}`}
              className="flex-grow"
              style={{
                flexBasis: 'var(--min-card-width)',
                maxWidth: '300px',
                minWidth: 'var(--min-card-width)',
              }}
            >
              <ShimmerCard />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RecommendedMovieShimmer; 