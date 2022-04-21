import "./App.css";
import { useState, useRef, useCallback } from "react";
import useGiphySearch from "./customhooks/useGiphySearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { giphys, hasMore, loading, error } = useGiphySearch(
    query,
    pageNumber,
    perPage
  );

  const observer = useRef();
  const lastGifElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
    setPerPage(50);
  };

  return (
    <div className="list-page">
      <div className="search-containier">
        <input type="text" value={query} onChange={handleSearch} />
      </div>
      {giphys.map((gif, index) => {
        if (giphys.length === index + 1) {
          return (
            <div ref={lastGifElement} key={gif.id}>
              <img src={gif?.url} />
            </div>
          );
        } else {
          return (
            <div key={gif.id}>
              <img src={gif?.url} />
            </div>
          );
        }
      })}
      <div>{loading && "Loading....."}</div>
      <div>{error && "Error....."}</div>
    </div>
  );
}

export default App;
