import { useState, useCallback } from "react";

const useHoverCoordinates = () => {
  const [hoverX, setHoverX] = useState(null);

  const handleMouseEnter = useCallback((event) => {
    const rect = event.target.getBoundingClientRect();
    let x = rect.left + window.scrollX;

    // Set boundary for x coordinate
    if (x < 0) {
      x = 0;
    } else if (x > 1800) {
      x = 1780;
    }

    setHoverX(x);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverX(null);
  }, []);

  return [hoverX, handleMouseEnter, handleMouseLeave];
};

export default useHoverCoordinates;
