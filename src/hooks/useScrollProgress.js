import { useState, useEffect } from "react";

const useScrollProgress = (ref) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateProgress = () => {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      const scrollProgress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setProgress(scrollProgress);
    };

    element.addEventListener("scroll", updateProgress);
    return () => element.removeEventListener("scroll", updateProgress);
  }, [ref]);

  return progress;
};

export default useScrollProgress;
