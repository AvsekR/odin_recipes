const express = require('express');
const Movie = require('../models/Movie');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/movies
// @desc    Get all movies with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      genre, 
      year, 
      category, 
      search,
      trending,
      newReleases 
    } = req.query;

    const query = {};
    
    if (genre) query.genre = { $in: [genre] };
    if (year) query.releaseYear = year;
    if (category) query.category = category;
    if (trending === 'true') query.isTrending = true;
    if (newReleases === 'true') query.isNewRelease = true;
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    
    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalMovies: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/movies/trending
// @desc    Get trending movies
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const movies = await Movie.find({ isTrending: true })
      .sort({ views: -1 })
      .limit(10);

    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/movies/new-releases
// @desc    Get new release movies
// @access  Public
router.get('/new-releases', async (req, res) => {
  try {
    const movies = await Movie.find({ isNewRelease: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/movies/genres
// @desc    Get all unique genres
// @access  Public
router.get('/genres', async (req, res) => {
  try {
    const genres = await Movie.distinct('genre');
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Increment views
    movie.views += 1;
    await movie.save();

    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/movies
// @desc    Create new movie (admin only)
// @access  Private (Admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    
    res.status(201).json({
      message: 'Movie created successfully',
      movie
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/movies/:id
// @desc    Update movie (admin only)
// @access  Private (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({
      message: 'Movie updated successfully',
      movie
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete movie (admin only)
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/movies/:id/like
// @desc    Like/Unlike movie
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const userId = req.user._id;
    const isLiked = movie.likes.includes(userId);
    const isDisliked = movie.dislikes.includes(userId);

    if (isLiked) {
      // Remove like
      movie.likes = movie.likes.filter(id => !id.equals(userId));
    } else {
      // Add like
      movie.likes.push(userId);
      // Remove from dislikes if present
      if (isDisliked) {
        movie.dislikes = movie.dislikes.filter(id => !id.equals(userId));
      }
    }

    await movie.save();

    res.json({
      message: isLiked ? 'Like removed' : 'Movie liked',
      likes: movie.likes.length,
      dislikes: movie.dislikes.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/movies/:id/dislike
// @desc    Dislike/Remove dislike movie
// @access  Private
router.post('/:id/dislike', auth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const userId = req.user._id;
    const isLiked = movie.likes.includes(userId);
    const isDisliked = movie.dislikes.includes(userId);

    if (isDisliked) {
      // Remove dislike
      movie.dislikes = movie.dislikes.filter(id => !id.equals(userId));
    } else {
      // Add dislike
      movie.dislikes.push(userId);
      // Remove from likes if present
      if (isLiked) {
        movie.likes = movie.likes.filter(id => !id.equals(userId));
      }
    }

    await movie.save();

    res.json({
      message: isDisliked ? 'Dislike removed' : 'Movie disliked',
      likes: movie.likes.length,
      dislikes: movie.dislikes.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;