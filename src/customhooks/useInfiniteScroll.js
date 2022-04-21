import { useCallback, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

const useInfiniteScroll = (
  isLoading,
  nextPagePath,
  getDataCallback,
  threshold = 400
) => {
  const observer = useRef(null);
  const history = useHistory();
  const loadMoreData = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (
            typeof getDataCallback === "function" &&
            entries &&
            entries[0].isIntersecting &&
            !isLoading &&
            nextPagePath !== null
          ) {
            getDataCallback();
          }
        },
        {
          rootMargin:
            typeof threshold === "number" ? threshold + "px" : "400px",
        }
      );
      if (node) observer.current.observe(node);
    },
    [getDataCallback, isLoading, nextPagePath, threshold]
  );

  useEffect(() => {
    if (typeof getDataCallback === "function") getDataCallback();
  }, [getDataCallback, history]);

  return { loadMoreData };
};

export default useInfiniteScroll;
