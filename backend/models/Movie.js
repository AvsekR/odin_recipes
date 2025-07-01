const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true // in minutes
  },
  releaseYear: {
    type: Number,
    required: true
  },
  genre: [{
    type: String,
    required: true
  }],
  director: {
    type: String,
    required: true
  },
  cast: [{
    name: String,
    character: String
  }],
  rating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'],
    required: true
  },
  imdbRating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  thumbnail: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  backdropImage: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isNewRelease: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['movie', 'tv-show', 'documentary'],
    default: 'movie'
  },
  language: {
    type: String,
    default: 'English'
  },
  country: {
    type: String,
    default: 'USA'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for better search performance
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ releaseYear: -1 });
movieSchema.index({ isTrending: -1 });

module.exports = mongoose.model('Movie', movieSchema);