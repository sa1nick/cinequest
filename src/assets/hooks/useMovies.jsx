import { useState, useEffect } from "react";

const apiKey = "86da22b8";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error(
              "Something went wrong with fetching datas. Check your internet connection."
            );

          const data = await res.json();
          if (data.Response === "False")
            throw new Error(`No results found for "${query}"`);

          setMovies(data.Search);
          setError("");

          // console.log(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
            console.log(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //   handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
