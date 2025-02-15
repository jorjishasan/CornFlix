import { useState } from "react";
import { useDispatch } from "react-redux";
import { setMovieNames } from "../redux/aiSearchSlice";
import openAiClient from "../config/openAiConfig";

const useOpenAiChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchResult = async (query) => {
    if (!query) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await openAiClient.post("/chat", {
        messages: [
          {
            role: "system",
            content: "You are a movie recommendation assistant. Provide only movie titles as a comma-separated list."
          },
          { 
            role: "user", 
            content: query 
          }
        ],
        model: "gpt-3.5-turbo-16k",
        store: true,
      });

      const movieList = response.choices[0].message.content
        .split(",")
        .map((movie) => movie.trim());
      dispatch(setMovieNames(movieList));
    } catch (err) {
      console.error("Error calling OpenAI API:", err);
      setError("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, fetchResult };
};

export default useOpenAiChat; 