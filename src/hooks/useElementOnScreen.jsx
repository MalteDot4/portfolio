import { useRef, useState, useEffect } from "react";

export const useElementOnScreen = () => {
  const containerRef = useRef(null);
  const [isVisible, setIsvisible] = useState(false);

  const callbackFn = (entries) => {
    const [entry] = entries;

    setIsvisible(entry.isIntersecting);
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFn, options);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return [containerRef, isVisible];
};
