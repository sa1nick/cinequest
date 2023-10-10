// eslint-disable-next-line react-refresh/only-export-components
export default function NumResults({ movies }) {
  return (
    <>
      {movies.length ? (
        <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
      ) : null}
    </>
  );
}
