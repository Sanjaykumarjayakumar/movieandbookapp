import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetail.css";

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      const apiKey = "fcd51437a7ba421ef6d37e8a2a25c893";
      try {
        // Fetch movie details
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
        );
        const data = await res.json();
        setMovie(data);

        // Fetch movie credits for cast
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
        );
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast.slice(0, 5)); // Top 5 cast members
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <div className="movie-detail-container">Loading...</div>;
  if (!movie) return <div className="movie-detail-container">Movie not found.</div>;

  return (
    <div className="movie-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
      <h3>⭐ Rating: {movie.vote_average}/10</h3>

      {/* Cast */}
      <div className="cast-section">
        <h3>Cast</h3>
        <div className="cast-list">
          {cast.map((actor) => (
            <div key={actor.id} className="cast-card">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "https://via.placeholder.com/80x100?text=No+Image"
                }
                alt={actor.name}
              />
              <p>{actor.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* OTT Platforms (watch providers) */}
      <div className="ott-section">
        <h3>Available On</h3>
        <div className="ott-list">
          {movie["watch/providers"]?.results?.IN?.flatrate
            ? movie["watch/providers"].results.IN.flatrate.map((provider) => (
                <div key={provider.provider_id} className="ott-card">
                  {provider.provider_name}
                </div>
              ))
            : <p>Not available on OTT platforms</p>}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
