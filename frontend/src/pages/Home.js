import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import './Home.css';

const Home = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch trending movies
        const trendingRes = await axios.get('/api/movies/trending');
        setTrendingMovies(trendingRes.data);
        
        // Set first trending movie as featured
        if (trendingRes.data.length > 0) {
          setFeaturedMovie(trendingRes.data[0]);
        }
        
        // Fetch new releases
        const newReleasesRes = await axios.get('/api/movies/new-releases');
        setNewReleases(newReleasesRes.data);
        
      } catch (error) {
        console.error('Error fetching home data:', error);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      {featuredMovie && (
        <section className="hero">
          <div className="hero-background">
            <img 
              src={featuredMovie.backdropImage} 
              alt={featuredMovie.title}
              className="hero-image"
            />
            <div className="hero-gradient"></div>
          </div>
          
          <div className="hero-content">
            <div className="container">
              <h1 className="hero-title">{featuredMovie.title}</h1>
              <p className="hero-description">
                {featuredMovie.description}
              </p>
              <div className="hero-meta">
                <span className="hero-year">{featuredMovie.releaseYear}</span>
                <span className="hero-rating">{featuredMovie.rating}</span>
                <span className="hero-duration">{featuredMovie.duration}m</span>
              </div>
              <div className="hero-actions">
                <Link 
                  to={`/movie/${featuredMovie._id}`} 
                  className="btn btn-primary hero-btn"
                >
                  <FaPlay />
                  Play
                </Link>
                <Link 
                  to={`/movie/${featuredMovie._id}`} 
                  className="btn btn-secondary hero-btn"
                >
                  <FaInfoCircle />
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Sections */}
      <div className="content-sections">
        <div className="container">
          {/* Trending Now */}
          {trendingMovies.length > 0 && (
            <section className="movie-section">
              <h2 className="section-title">Trending Now</h2>
              <div className="movie-grid">
                {trendingMovies.map(movie => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            </section>
          )}

          {/* New Releases */}
          {newReleases.length > 0 && (
            <section className="movie-section">
              <h2 className="section-title">New Releases</h2>
              <div className="movie-grid">
                {newReleases.map(movie => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;