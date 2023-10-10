import { useEffect, useRef, useState } from "react";
import { Waveform } from "@uiball/loaders";
import StarRating from "./StarRating";
import { TiArrowBack } from "react-icons/ti";
import { useKey } from "../hooks/useKey";
import { apiKey } from "../../App";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
  movie,
  setMovie,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const WatchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Plot: plot,
    imdbRating,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  var newWatchedMovie = {};
  function handleAdd() {
    newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie);

  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (e.code === "Escape") {
  //         onCloseMovie();
  //       }
  //     }
  //     document.addEventListener("keydown", callback);
  //     return function () {
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [onCloseMovie]
  // );
  useEffect(
    function () {
      async function getMoviesDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`
        );

        var data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMoviesDetails();
    },
    [selectedId, setMovie]
  );

  // console.log(movie.Genre.split(","));
  // console.log(Number(userRating));
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      //cleanup function
      return function () {
        document.title = "usePopcorn";

        // console.log(`Clean up effect for movie: ${title}`);
        // title's value will be saved even after component's
        // state were destroyed coz of closure
      };
    },

    [title]
  );

  // const isObj = Object.keys(movie).length === 0 && movie.constructor === Object;
  // console.log(isObj);
  // console.log(genre);
  return (
    <div className="details">
      {isLoading ? (
        <Waveform size={40} speed={1} color="#187c9e" className="loader" />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              {/* &larr; */}
              <TiArrowBack size={22} />
            </button>
            {/* <TiArrowBack
                      className="btn-back"
                      onClick={onCloseMovie}
                      size={90}
                      color="#2B9CBF"
                    /> */}
            <img src={poster} alt={title} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              {/* <p>
                      {movieGenre.map((gen) => (
                        <b className="genre-chip">
                          <span className="genre-text">{gen}</span>
                        </b>
                      ))}
                    </p> */}
              <p>
                {genre &&
                  genre.split(",").map((gen) => (
                    <b className="genre-chip" key={gen}>
                      <span className="genre-text">{gen}</span>
                    </b>
                  ))}
              </p>
              {/* <p>{genre}</p> */}
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      +Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie ⭐{WatchedUserRating}/10</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>
              <strong>Stars : </strong>
              {actors}
            </p>

            <p>
              <strong>Director : </strong>
              {director}
            </p>
          </section>
        </>
      )}

      {/* {selectedId} */}
    </div>
  );
}
