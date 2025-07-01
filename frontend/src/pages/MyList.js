import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import './MyList.css';

const MyList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyList();
  }, []);

  const fetchMyList = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/users/my-list');
      setMovies(res.data);
    } catch (error) {
      console.error('Error fetching my list:', error);
      setError('Failed to load your list');
    } finally {
      setLoading(false);
    }
  };

  const handleMyListUpdate = () => {
    fetchMyList();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="my-list">
      <div className="container">
        <div className="my-list-header">
          <h1>My List</h1>
          <p>Movies and TV shows you've saved</p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="my-list-content">
          {movies.length > 0 ? (
            <div className="movie-grid">
              {movies.map(movie => (
                <MovieCard 
                  key={movie._id} 
                  movie={movie} 
                  onMyListUpdate={handleMyListUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="empty-list">
              <h3>Your list is empty</h3>
              <p>Start adding movies and TV shows to your list to watch them later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyList;