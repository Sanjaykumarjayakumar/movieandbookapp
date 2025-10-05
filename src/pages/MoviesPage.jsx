import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Movies.css";

const MoviesPage = () => {
  const navigate = useNavigate();
  const [latestMovies, setLatestMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const preferredLanguage = localStorage.getItem("preferredLanguage") || "en";
  const preferredGenre = localStorage.getItem("preferredGenre") || "";

  useEffect(() => {
    const apiKey = "fcd51437a7ba421ef6d37e8a2a25c893";
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Latest releases (already released movies)
    const fetchLatestMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=${preferredLanguage}&release_date.lte=${today}&sort_by=release_date.desc&region=IN`
        );
        const data = await res.json();
        setLatestMovies(data.results.slice(0, 10));
      } catch (err) {
        console.error(err);
      }
    };

    // Movies of selected genre & language (already released)
    const fetchGenreMovies = async () => {
      if (!preferredGenre) return setGenreMovies([]);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=${preferredLanguage}&with_genres=${preferredGenre}&release_date.lte=${today}&sort_by=popularity.desc&region=IN`
        );
        const data = await res.json();
        setGenreMovies(data.results.slice(0, 10));
      } catch (err) {
        console.error(err);
      }
    };

    // Upcoming movies (not yet released)
    const fetchUpcomingMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=${preferredLanguage}&release_date.gte=${today}&sort_by=release_date.asc&region=IN`
        );
        const data = await res.json();
        setUpcomingMovies(data.results.slice(0, 10));
      } catch (err) {
        console.error(err);
      }
    };

    // Trending movies (already released)
    const fetchTrendingMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&region=IN`
        );
        const data = await res.json();
        setTrendingMovies(data.results.slice(0, 10));
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchLatestMovies(),
        fetchGenreMovies(),
        fetchUpcomingMovies(),
        fetchTrendingMovies(),
      ]);
      setLoading(false);
    };

    fetchAll();
  }, [preferredLanguage, preferredGenre]);

  if (loading) return <div className="movies-container">Loading movies...</div>;

  const renderMovieRow = (title, movies) => (
    <section>
      <h2>{title}</h2>
      <div className="movie-grid">
        {movies.length ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <p>{movie.title}</p>
            </div>
          ))
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </section>
  );

  return (
    <div className="movies-container">
      <nav className="movies-nav">
        <span onClick={() => navigate("/movies")}>Movies</span>
        <span onClick={() => navigate("/books")}>Books</span>
        <span onClick={() => navigate("/foryou")}>For You</span>
        <span onClick={() => navigate("/chat")}>Chat</span>
        <div className="profile-icon" onClick={() => navigate("/preferences")}>👤</div>
      </nav>

      {renderMovieRow(`Coming Up (${preferredLanguage})`, upcomingMovies)}
      {renderMovieRow(`Latest Releases (${preferredLanguage})`, latestMovies)}
      {preferredGenre && renderMovieRow(`Genre: ${preferredGenre} (${preferredLanguage})`, genreMovies)}
      {renderMovieRow("Trending in India", trendingMovies)}
    </div>
  );
};

export default MoviesPage;
