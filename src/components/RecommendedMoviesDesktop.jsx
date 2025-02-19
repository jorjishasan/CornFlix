import { useMemo } from "react";
import RecommendedMovieCard from "./RecommendedMovieCard";

const ROWS = 2;

const RecommendedMoviesDesktop = ({ movies }) => {
  // Split movies into rows with flexible distribution
  const rows = useMemo(() => {
    const itemsPerRow = Math.ceil(movies.length / ROWS);
    return Array.from({ length: ROWS }, (_, i) =>
      movies.slice(i * itemsPerRow, (i + 1) * itemsPerRow)
    );
  }, [movies]);

  return (
    <div className="space-y-12">
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex flex-wrap justify-start gap-6"
          style={{
            // Ensure cards take up available space while maintaining aspect ratio
            '--min-card-width': '200px',
            '--gap': '1.5rem', // 6 in Tailwind
          }}
        >
          {row.map((movie) => (
            <div
              key={movie.id}
              className="flex-grow"
              style={{
                flexBasis: 'var(--min-card-width)',
                maxWidth: '300px', // Prevent cards from getting too wide
                minWidth: 'var(--min-card-width)',
              }}
            >
              <RecommendedMovieCard movie={movie} />
            </div>
          ))}
          {/* Add empty flex items to maintain consistent spacing */}
          {[...Array(4)].map((_, i) => (
            <div
              key={`spacer-${i}`}
              className="flex-grow-0"
              style={{
                flexBasis: 'var(--min-card-width)',
                maxWidth: '300px',
                minWidth: 'var(--min-card-width)',
                height: 0,
                margin: 0,
                padding: 0,
                visibility: 'hidden',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default RecommendedMoviesDesktop; 