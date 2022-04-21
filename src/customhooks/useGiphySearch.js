import { useEffect, useState } from "react";
import axios from "axios";

export default function useGiphySearch(query, pageNumber, perPage) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [giphys, setGiphys] = useState([false]);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(1);

  useEffect(() => {
    setGiphys([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "https://api.giphy.com/v1/gifs/search",
      params: {
        api_key: "WsbfJWd5Rk4n9TDr6x0xOVKvPi67JFhm",
        q: query,
        offset: pageNumber * perPage,
        limit: perPage,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setGiphys((prevGiphys) => {
          return [...new Set([...prevGiphys, ...res.data.data])];
        });
        setOffset(res.data.pagination.offset);
        setHasMore(
          res.data.pagination.total_count >
            (offset + 1) * res.data.pagination.count
        );
        setLoading(false);
        console.log(res.data);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });

    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, giphys, hasMore };
}
