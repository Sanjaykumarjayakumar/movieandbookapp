import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Movies.css';

const MovieRow = ({ title, movies }) => {
  const navigate = useNavigate();

  const MovieCard = ({ movie }) => {
    const { title, poster_path, vote_average } = movie;
    const imageUrl = `https://image.tmdb.org/t/p/w500${poster_path}`;

    return (
      <div className="movie-card" onClick={() => navigate(`/movies/${movie.id}`)}>
        <img src={imageUrl} alt={title} />
        <div className="movie-card-overlay">
          <h3 className="movie-card-title">{title}</h3>
          <span className="movie-card-rating">⭐ {vote_average.toFixed(1)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="movie-row">
      <h2>{title}</h2>
      <div className="movie-row-content">
        {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </div>
  );
};

export default MovieRow;
