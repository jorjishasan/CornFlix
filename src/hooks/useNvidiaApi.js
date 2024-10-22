import { useState } from "react";
import { useDispatch } from "react-redux";
import { setMovieNames } from "../redux/aiSearchSlice";
import nvidiaClient from "../config/nvidiaConfig";

const useNvidiaApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchResult = async (query) => {
    if (!query) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await nvidiaClient.post("/nim", {
        model: "meta/llama-3.1-405b-instruct",
        messages: [{ role: "user", content: query }],
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: 1024,
      });

      const movieList = response.choices[0].message.content
        .split(",")
        .map((movie) => movie.trim());
      dispatch(setMovieNames(movieList));
    } catch (err) {
      console.error("Error calling NVIDIA NIM API:", err);
      setError("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, fetchResult };
};

export default useNvidiaApi;
