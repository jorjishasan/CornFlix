const MovieShimmer = () => {
  return (
    <div className="group relative h-full w-full cursor-wait overflow-hidden rounded-lg bg-white/5">
      {/* Poster Shimmer */}
      <div className="h-full w-full animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
      
      {/* Hover Overlay Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
        <div className="flex h-full flex-col justify-between">
          {/* Top Rating Shimmer */}
          <div className="flex justify-end">
            <div className="h-6 w-16 animate-pulse rounded-md bg-white/10">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Bottom Content Shimmer */}
          <div className="space-y-3">
            {/* Title Lines */}
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded-full bg-white/10">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-white/10">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-white/10">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>
              <div className="h-8 w-8 animate-pulse rounded-full bg-white/10">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieShimmer; 