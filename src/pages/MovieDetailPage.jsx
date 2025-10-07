import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookRow from "../components/BookRow";
import "./MovieDetail.css";

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);
  const [booksByTitle, setBooksByTitle] = useState([]);
  const [booksByGenre, setBooksByGenre] = useState([]);
  const [booksByDescription, setBooksByDescription] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiKey = "fcd51437a7ba421ef6d37e8a2a25c893";

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const [movieRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=watch/providers`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`)
        ]);

        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 10));

        if (movieData["watch/providers"]?.results?.IN?.flatrate) {
          setWatchProviders(movieData["watch/providers"].results.IN.flatrate);
        }
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  // 🔍 Fetch books based on different criteria
  useEffect(() => {
    if (!movie) return;

    const fetchBooks = async () => {
      try {
        // --- 1️⃣ By Title ---
        const titleQuery = movie.title || movie.original_title;
        const titleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(titleQuery)}&maxResults=10`);
        const titleData = await titleRes.json();
        setBooksByTitle(titleData.items || []);

        // --- 2️⃣ By Genre ---
        const genreNames = movie.genres?.map((g) => g.name).join(" ") || "fiction";
        const genreRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(genreNames)}&maxResults=10`);
        const genreData = await genreRes.json();
        setBooksByGenre(genreData.items || []);

        // --- 3️⃣ By Description ---
        const overview = movie.overview?.split(" ").slice(0, 6).join(" ") || movie.title;
        const descRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(overview)}&maxResults=10`);
        const descData = await descRes.json();
        setBooksByDescription(descData.items || []);
      } catch (err) {
        console.error("Error fetching related books:", err);
      }
    };

    fetchBooks();
  }, [movie]);

  if (loading) return <div className="loading-container">Finding your movie...</div>;
  if (!movie) return <div className="loading-container">Could not find this movie.</div>;

  const backgroundStyle = {
    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
  };

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-backdrop" style={backgroundStyle}></div>
      <div className="movie-detail-content">
        <button className="back-btn" onClick={() => navigate(-1)}>
          &larr; Back to Movies
        </button>

        {/* 🎬 Movie Info */}
        <div className="movie-main-info">
          <div className="movie-poster">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} Poster`}
            />
          </div>
          <div className="movie-header-details">
            <h1>{movie.title}</h1>
            <div className="movie-meta">
              <span>{movie.release_date?.split("-")[0]}</span>
              <span>|</span>
              <span>{movie.genres?.map((g) => g.name).join(", ")}</span>
              <span>|</span>
              <span>
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            </div>
            <div className="movie-rating">
              <span className="rating-value">⭐ {movie.vote_average?.toFixed(1)}</span> / 10
            </div>
            <h3>Overview</h3>
            <p className="movie-overview">{movie.overview}</p>
          </div>
        </div>

        {/* 👥 Cast */}
        <div className="detail-section">
          <h2>Top Billed Cast</h2>
          <div className="cast-list">
            {cast.map((actor) => (
              <div key={actor.id} className="cast-card">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : "https://via.placeholder.com/200x300?text=No+Image"
                  }
                  alt={actor.name}
                />
                <p className="actor-name">{actor.name}</p>
                <p className="character-name">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 📺 Watch Providers */}
        <div className="detail-section">
          <h2>Available On</h2>
          <div className="ott-list">
            {watchProviders.length > 0 ? (
              watchProviders.map((provider) => (
                <div key={provider.provider_id} className="ott-card">
                  <img
                    src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                    alt={provider.provider_name}
                  />
                  <span>{provider.provider_name}</span>
                </div>
              ))
            ) : (
              <p>Not currently available for streaming in your region.</p>
            )}
          </div>
        </div>

        {/* 📚 Recommended Books */}
        <div className="detail-section">
          <BookRow title="Books Matching Title" books={booksByTitle} />
          <BookRow title="Books Matching Genre" books={booksByGenre} />
          <BookRow title="Books Matching Description" books={booksByDescription} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
