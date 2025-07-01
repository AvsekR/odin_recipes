import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import './Browse.css';

const Browse = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    category: searchParams.get('category') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchGenres = async () => {
    try {
      const res = await axios.get('/api/movies/genres');
      setGenres(res.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const res = await axios.get(`/api/movies?${params.toString()}`);
      setMovies(res.data.movies);
      setPagination(res.data.pagination);
      
      // Update URL
      setSearchParams(params);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      genre: '',
      year: '',
      category: '',
      page: 1
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="browse">
      <div className="container">
        <div className="browse-header">
          <h1>Browse Movies & TV Shows</h1>
          
          {/* Filters */}
          <div className="filters">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search movies..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="filter-input search-filter"
              />
            </div>
            
            <div className="filter-group">
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="filter-select"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                <option value="movie">Movies</option>
                <option value="tv-show">TV Shows</option>
                <option value="documentary">Documentaries</option>
              </select>
            </div>
            
            <div className="filter-group">
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="filter-select"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <button onClick={clearFilters} className="btn btn-outline clear-filters">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="browse-content">
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="results-header">
                <p className="results-count">
                  {pagination.totalMovies || 0} results found
                  {filters.search && ` for "${filters.search}"`}
                </p>
              </div>

              {movies.length > 0 ? (
                <>
                  <div className="movie-grid">
                    {movies.map(movie => (
                      <MovieCard key={movie._id} movie={movie} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="btn btn-outline pagination-btn"
                      >
                        Previous
                      </button>
                      
                      <span className="pagination-info">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="btn btn-outline pagination-btn"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-results">
                  <h3>No movies found</h3>
                  <p>Try adjusting your search criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;