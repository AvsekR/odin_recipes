import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import axios from 'axios';
import './MovieCard.css';

const MovieCard = ({ movie, onMyListUpdate }) => {
  const [isInMyList, setIsInMyList] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToList = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      if (isInMyList) {
        await axios.delete(`/api/users/my-list/${movie._id}`);
        setIsInMyList(false);
      } else {
        await axios.post(`/api/users/my-list/${movie._id}`);
        setIsInMyList(true);
      }
      
      if (onMyListUpdate) {
        onMyListUpdate();
      }
    } catch (error) {
      console.error('Error updating my list:', error);
    }
    setLoading(false);
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await axios.post(`/api/movies/${movie._id}/like`);
    } catch (error) {
      console.error('Error liking movie:', error);
    }
  };

  const handleDislike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await axios.post(`/api/movies/${movie._id}/dislike`);
    } catch (error) {
      console.error('Error disliking movie:', error);
    }
  };

  return (
    <Link to={`/movie/${movie._id}`} className="movie-card">
      <div className="movie-card-image">
        <img src={movie.thumbnail} alt={movie.title} />
        <div className="movie-card-overlay">
          <div className="movie-card-actions">
            <button className="action-btn play-btn">
              <FaPlay />
            </button>
            <button 
              className="action-btn list-btn"
              onClick={handleAddToList}
              disabled={loading}
            >
              {isInMyList ? <FaCheck /> : <FaPlus />}
            </button>
            <button className="action-btn like-btn" onClick={handleLike}>
              <FaThumbsUp />
            </button>
            <button className="action-btn dislike-btn" onClick={handleDislike}>
              <FaThumbsDown />
            </button>
          </div>
        </div>
      </div>
      
      <div className="movie-card-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span className="movie-year">{movie.releaseYear}</span>
          <span className="movie-rating">{movie.rating}</span>
          <span className="movie-duration">{movie.duration}m</span>
        </div>
        <div className="movie-genres">
          {movie.genre.slice(0, 3).map((genre, index) => (
            <span key={index} className="genre-tag">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;