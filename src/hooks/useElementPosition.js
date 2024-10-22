import { useState, useCallback } from "react";

const useElementPosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const updatePosition = useCallback((element) => {
    if (element) {
      const rect = element.getBoundingClientRect();
      setPosition({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  return [position, updatePosition];
};

export default useElementPosition;
