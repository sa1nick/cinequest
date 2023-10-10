import { useState } from "react";
import { Waveform } from "@uiball/loaders";

import { useMovies } from "../src/assets/hooks/useMovies";
import { useLocalStorageState } from "../src/assets/hooks/useLocalStorageState";
import ErrorMessage from "./assets/components/ErrorMessage";
import NavBar from "./assets/components/NavBar";
import Search from "./assets/components/Search";
import Box from "./assets/components/Box";
import MovieList from "./assets/components/MovieList";
import MovieDetails from "./assets/components/MovieDetails";
import WatchedSummary from "./assets/components/WatchedSummary";
import WatchedMoviesList from "./assets/components/WatchedMoviesList";
import Main from "./assets/components/Main";

export const apiKey = "86da22b8";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [movie, setMovie] = useState({});
  const [selectedId, SetSelectedId] = useState("");

  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  const [toggleBox, setToggleBox] = useState(false);

  function handleSelectMovie(id) {
    SetSelectedId((selectedId) => (id === selectedId ? null : id));
    setToggleBox((toggleBox) => !toggleBox);
  }

  function handleCloseMovie() {
    SetSelectedId("");
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  function handleCloseWatchedBox() {
    setToggleBox(false);
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
      </NavBar>

      {/* <NumResults movies={movies} /> */}
      <Main>
        {query && (
          <Box>
            {isLoading && (
              <Waveform
                size={40}
                speed={1}
                color="#187c9e"
                className="loader"
              />
            )}

            {!isLoading && !error && (
              <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
            )}
            {error && <ErrorMessage message={error} />}
          </Box>
        )}

        {toggleBox && (
          <Box>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
                movie={movie}
                setMovie={setMovie}
              />
            ) : (
              <>
                <WatchedSummary
                  watched={watched}
                  onCloseWatched={handleCloseWatchedBox}
                />
                <WatchedMoviesList
                  watched={watched}
                  onDeleteWatched={handleDeleteWatched}
                />
              </>
            )}
          </Box>
        )}
      </Main>
    </>
  );
}
