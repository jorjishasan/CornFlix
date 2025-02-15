import React, { useState } from "react";
import { useSelector } from "react-redux";
import useOpenAiChat from "../hooks/useOpenAiChat";
import useSearchMoviesByName from "../hooks/useSearchMoviesByName";
import lang from "../config/languages";
import { FaSearch, FaRobot, FaSpinner } from "react-icons/fa";
import RecommendedMovieCard from "./RecommendedMovieCard";

const AiSearch = () => {
  const currLanguage = useSelector((store) => store.lang.langSelected);
  const movieNames = useSelector((store) => store.aiSearch.movieNames);
  const moviesData = useSelector((store) => store.aiSearch.moviesData);
  const [inputText, setInputText] = useState("");
  
  const {
    isLoading: isAiLoading,
    error: aiError,
    fetchResult,
  } = useOpenAiChat();
  
  const { isLoading: isMoviesLoading, error: moviesError } =
    useSearchMoviesByName();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      const refinedQuery = `Suggest 5 movies for: ${inputText.trim()}. Only provide movie titles as a comma-separated list.`;
      fetchResult(refinedQuery);
    }
  };

  const isLoading = isAiLoading || isMoviesLoading;
  const error = aiError || moviesError;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 pt-6">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl rounded-2xl bg-black/30 p-8 backdrop-blur-md transition-all duration-300 ease-in-out hover:bg-black/40">
          <div className="mb-8 flex flex-col items-center justify-center">
            <FaRobot className="mb-4 text-6xl text-purple-400 transition-all duration-300 ease-in-out hover:scale-110 hover:text-purple-300" />
            <h1 className="text-center text-4xl font-bold text-white transition-all duration-300 ease-in-out hover:text-purple-200">
              AI-Powered Movie Discovery
            </h1>
          </div>
          <form className="mb-8 flex" onSubmit={handleSubmit}>
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full rounded-l-full bg-white/10 p-4 pl-12 text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 ease-in-out focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder={
                  lang[currLanguage]?.searchBoxPlaceholder ||
                  "Describe your ideal movie..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
              />
              <FaRobot className="absolute left-4 top-1/2 -translate-y-1/2 transform text-purple-400 transition-all duration-300 ease-in-out group-hover:text-purple-300" />
            </div>
            <button
              className="flex items-center rounded-r-full bg-purple-600 px-6 py-2 text-white transition-all duration-300 ease-in-out hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-purple-800"
              type="submit"
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <FaSearch className="mr-2" />
                  {lang[currLanguage]?.search || "Discover"}
                </>
              )}
            </button>
          </form>
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/20 p-3 text-center text-red-200 transition-all duration-300 ease-in-out hover:bg-red-500/30">
              {error}
            </div>
          )}
          {isLoading && (
            <div className="flex justify-center">
              <FaSpinner className="animate-spin text-4xl text-purple-400" />
            </div>
          )}
          {movieNames &&
            moviesData &&
            movieNames.length === moviesData.length && (
              <div className="mt-8 space-y-8">
                {movieNames.map((movieName, index) => (
                  <div key={index}>
                    <h2 className="mb-4 text-2xl font-bold text-purple-400 transition-all duration-300 ease-in-out hover:text-purple-300">
                      {movieName}
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {moviesData[index].map((movie, movieIndex) => (
                        <RecommendedMovieCard 
                          key={movieIndex} 
                          movie={movie} 
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AiSearch;
