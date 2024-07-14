import React, { useState, useEffect } from "react";

const LoadingEllipsis = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots + 1) % 4);
    }, 500); // Change dot every 500ms

    return () => clearInterval(interval);
  }, []);

  return <span>{".".repeat(dots)}</span>;
};

export default LoadingEllipsis;
