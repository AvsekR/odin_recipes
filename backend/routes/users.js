const express = require('express');
const User = require('../models/User');
const Movie = require('../models/Movie');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('myList')
      .populate('watchHistory.movie');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, avatar, subscription } = req.body;
    
    const updateFields = {};
    if (name) updateFields.name = name;
    if (avatar) updateFields.avatar = avatar;
    if (subscription) updateFields.subscription = subscription;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/my-list
// @desc    Get user's movie list
// @access  Private
router.get('/my-list', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('myList');
    res.json(user.myList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/my-list/:movieId
// @desc    Add movie to user's list
// @access  Private
router.post('/my-list/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const movie = await Movie.findById(req.params.movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    if (user.myList.includes(req.params.movieId)) {
      return res.status(400).json({ message: 'Movie already in your list' });
    }

    user.myList.push(req.params.movieId);
    await user.save();

    res.json({ message: 'Movie added to your list' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/my-list/:movieId
// @desc    Remove movie from user's list
// @access  Private
router.delete('/my-list/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.myList.includes(req.params.movieId)) {
      return res.status(400).json({ message: 'Movie not in your list' });
    }

    user.myList = user.myList.filter(movieId => 
      !movieId.equals(req.params.movieId)
    );
    await user.save();

    res.json({ message: 'Movie removed from your list' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/watch-history
// @desc    Get user's watch history
// @access  Private
router.get('/watch-history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('watchHistory.movie')
      .select('watchHistory');

    const watchHistory = user.watchHistory
      .sort((a, b) => b.watchedAt - a.watchedAt)
      .slice(0, 50); // Last 50 watched movies

    res.json(watchHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/watch-history/:movieId
// @desc    Add movie to watch history
// @access  Private
router.post('/watch-history/:movieId', auth, async (req, res) => {
  try {
    const { watchTime = 0 } = req.body;
    const user = await User.findById(req.user._id);
    const movie = await Movie.findById(req.params.movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if movie already exists in watch history
    const existingIndex = user.watchHistory.findIndex(
      item => item.movie.equals(req.params.movieId)
    );

    if (existingIndex !== -1) {
      // Update existing entry
      user.watchHistory[existingIndex].watchedAt = new Date();
      user.watchHistory[existingIndex].watchTime = watchTime;
    } else {
      // Add new entry
      user.watchHistory.push({
        movie: req.params.movieId,
        watchTime,
        watchedAt: new Date()
      });
    }

    await user.save();

    res.json({ message: 'Watch history updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/watch-history/:movieId
// @desc    Remove movie from watch history
// @access  Private
router.delete('/watch-history/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.watchHistory = user.watchHistory.filter(
      item => !item.movie.equals(req.params.movieId)
    );
    
    await user.save();

    res.json({ message: 'Movie removed from watch history' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;