import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck, FaThumbsUp, FaThumbsDown, FaArrowLeft } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Loading from '../components/Loading';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [isInMyList, setIsInMyList] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/movies/${id}`);
      setMovie(res.data);
      
      // Add to watch history
      await axios.post(`/api/users/watch-history/${id}`);
    } catch (error) {
      console.error('Error fetching movie:', error);
      setError('Movie not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = async () => {
    try {
      if (isInMyList) {
        await axios.delete(`/api/users/my-list/${id}`);
        setIsInMyList(false);
      } else {
        await axios.post(`/api/users/my-list/${id}`);
        setIsInMyList(true);
      }
    } catch (error) {
      console.error('Error updating my list:', error);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`/api/movies/${id}/like`);
    } catch (error) {
      console.error('Error liking movie:', error);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.post(`/api/movies/${id}/dislike`);
    } catch (error) {
      console.error('Error disliking movie:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !movie) {
    return (
      <div className="error-page">
        <h2>Movie not found</h2>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="movie-detail">
      {/* Back Button */}
      <Link to="/" className="back-button">
        <FaArrowLeft />
        Back
      </Link>

      {/* Video Player Section */}
      <div className="video-section">
        {playing ? (
          <div className="video-player">
            <ReactPlayer
              url={movie.videoUrl}
              width="100%"
              height="100%"
              playing={playing}
              controls
              onEnded={() => setPlaying(false)}
            />
          </div>
        ) : (
          <div className="video-preview">
            <img src={movie.backdropImage} alt={movie.title} className="backdrop-image" />
            <div className="video-overlay">
              <button
                onClick={() => setPlaying(true)}
                className="play-button"
              >
                <FaPlay />
                <span>Play</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Movie Information */}
      <div className="movie-info">
        <div className="container">
          <div className="movie-header">
            <div className="movie-main-info">
              <h1 className="movie-title">{movie.title}</h1>
              
              <div className="movie-meta">
                <span className="movie-year">{movie.releaseYear}</span>
                <span className="movie-rating">{movie.rating}</span>
                <span className="movie-duration">{movie.duration}m</span>
                <span className="movie-category">{movie.category}</span>
              </div>

              <p className="movie-description">{movie.description}</p>

              <div className="movie-actions">
                <button
                  onClick={() => setPlaying(true)}
                  className="btn btn-primary action-btn"
                >
                  <FaPlay />
                  Play
                </button>
                
                <button
                  onClick={handleAddToList}
                  className="btn btn-secondary action-btn"
                >
                  {isInMyList ? <FaCheck /> : <FaPlus />}
                  {isInMyList ? 'Remove from List' : 'Add to List'}
                </button>
                
                <button
                  onClick={handleLike}
                  className="btn btn-outline action-btn like-btn"
                >
                  <FaThumbsUp />
                </button>
                
                <button
                  onClick={handleDislike}
                  className="btn btn-outline action-btn dislike-btn"
                >
                  <FaThumbsDown />
                </button>
              </div>
            </div>

            <div className="movie-poster">
              <img src={movie.poster} alt={movie.title} />
            </div>
          </div>

          {/* Additional Information */}
          <div className="movie-details">
            <div className="detail-section">
              <h3>Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Director:</span>
                  <span className="value">{movie.director}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Genres:</span>
                  <span className="value">{movie.genre.join(', ')}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Language:</span>
                  <span className="value">{movie.language}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Country:</span>
                  <span className="value">{movie.country}</span>
                </div>
                <div className="detail-item">
                  <span className="label">IMDb Rating:</span>
                  <span className="value">{movie.imdbRating}/10</span>
                </div>
                <div className="detail-item">
                  <span className="label">Views:</span>
                  <span className="value">{movie.views?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="detail-section">
                <h3>Cast</h3>
                <div className="cast-list">
                  {movie.cast.map((actor, index) => (
                    <div key={index} className="cast-item">
                      <span className="actor-name">{actor.name}</span>
                      {actor.character && (
                        <span className="character-name">as {actor.character}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;