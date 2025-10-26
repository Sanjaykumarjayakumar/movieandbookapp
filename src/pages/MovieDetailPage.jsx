import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BookRow from "../components/BookRow";
import "./MovieDetail.css";
import MOVIE_API_KEY from "../movieApiKey";

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToWatchlist, removeFromWatchlist, getWatchlist } = useAuth();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);
  const [booksByGenre, setBooksByGenre] = useState([]);
  const [booksByDescription, setBooksByDescription] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [error, setError] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  const apiKey = MOVIE_API_KEY;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const [movieRes, creditsRes, videosRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=watch/providers`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`)
        ]);

        if (!movieRes.ok) {
          console.error("Failed to fetch movie:", movieRes.status, movieRes.statusText);
          setError(`Failed to fetch movie: ${movieRes.statusText}`);
          setLoading(false);
          return;
        }

        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();
        const videosData = await videosRes.json();

        // Check if the response has an error or if the movie data is invalid
        if (movieData.status_code === 34 || movieData.status_code === 1 || !movieData.id) {
          console.error("Invalid movie data:", movieData);
          setError(movieData.status_message || "Movie not found");
          setLoading(false);
          return;
        }

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 10));

        if (movieData["watch/providers"]?.results?.IN?.flatrate) {
          setWatchProviders(movieData["watch/providers"].results.IN.flatrate);
        }

        // Find trailer video
        const trailer = videosData.results?.find(video => 
          video.type === 'Trailer' && video.site === 'YouTube'
        );
        console.log('trailer:', trailer);
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setError("Network error. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id, apiKey]);

  // 🔍 Fetch books based on different criteria
  useEffect(() => {
    if (!movie) return;

    const fetchBooks = async () => {
      try {
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

  // Check if movie is in watchlist on mount and when movie changes
  useEffect(() => {
    if (movie && user) {
      const watchlist = getWatchlist();
      setIsInWatchlist(watchlist.some(item => item.id === movie.id));
    }
  }, [movie, user, getWatchlist]);

  // Handle adding/removing from watchlist
  const handleWatchlistToggle = () => {
    if (!movie || !user) return;
    
    if (isInWatchlist) {
      // Remove from watchlist
      const result = removeFromWatchlist(movie.id);
      if (result.success) {
        setIsInWatchlist(false);
      }
    } else {
      // Add to watchlist
      const movieData = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average
      };
      const result = addToWatchlist(movieData);
      if (result.success) {
        setIsInWatchlist(true);
      }
    }
  };

  // Handle watch trailer
  const handleWatchTrailer = () => {
    if (trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
    }
  };

  if (loading) return <div className="loading-container">Finding your movie...</div>;
  if (error || !movie) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Could not find this movie</h2>
          <p>{error || "The movie you're looking for doesn't exist or couldn't be loaded."}</p>
          <button className="back-btn" onClick={() => navigate('/movies')}>
            &larr; Back to Movies
          </button>
        </div>
      </div>
    );
  }

  const backgroundStyle = movie.backdrop_path ? {
    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
  } : {
    background: '#111',
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
            <div className="movie-actions">
              <button 
                onClick={handleWatchlistToggle}
                className={`watchlist-btn ${isInWatchlist ? 'in-watchlist' : ''}`}
              >
                {isInWatchlist ? '✓ Added to Watchlist' : '+ Add to Watchlist'}
              </button>
              <button 
                onClick={handleWatchTrailer}
                className="trailer-btn"
                disabled={!trailerKey}
              >
                ▶ Watch Trailer
              </button>
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
                      : "https://placehold.co/200x300?text=No+Image"
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
          <BookRow title="Books Matching Genre" books={booksByGenre} />
          <BookRow title="Books Matching Description" books={booksByDescription} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
age;
