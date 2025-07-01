const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const User = require('../models/User');
require('dotenv').config();

// Sample movie data
const sampleMovies = [
  {
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    duration: 142,
    releaseYear: 1994,
    genre: ["Drama", "Crime"],
    director: "Frank Darabont",
    cast: [
      { name: "Tim Robbins", character: "Andy Dufresne" },
      { name: "Morgan Freeman", character: "Ellis Boyd 'Red' Redding" }
    ],
    rating: "R",
    imdbRating: 9.3,
    thumbnail: "https://images.unsplash.com/photo-1489599577372-f76c51ed1c5d?w=400",
    poster: "https://images.unsplash.com/photo-1489599577372-f76c51ed1c5d?w=300",
    backdropImage: "https://images.unsplash.com/photo-1489599577372-f76c51ed1c5d?w=1200",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    isTrending: true,
    isNewRelease: false,
    category: "movie",
    language: "English",
    country: "USA",
    views: 1250000
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    duration: 152,
    releaseYear: 2008,
    genre: ["Action", "Crime", "Drama"],
    director: "Christopher Nolan",
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne / Batman" },
      { name: "Heath Ledger", character: "Joker" }
    ],
    rating: "PG-13",
    imdbRating: 9.0,
    thumbnail: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300",
    backdropImage: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1200",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    isTrending: true,
    isNewRelease: false,
    category: "movie",
    language: "English",
    country: "USA",
    views: 2100000
  },
  {
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    duration: 50,
    releaseYear: 2016,
    genre: ["Drama", "Fantasy", "Horror"],
    director: "The Duffer Brothers",
    cast: [
      { name: "Millie Bobby Brown", character: "Eleven" },
      { name: "Finn Wolfhard", character: "Mike Wheeler" }
    ],
    rating: "TV-14",
    imdbRating: 8.7,
    thumbnail: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300",
    backdropImage: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    isTrending: true,
    isNewRelease: false,
    category: "tv-show",
    language: "English",
    country: "USA",
    views: 1800000
  },
  {
    title: "Breaking Bad",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    duration: 47,
    releaseYear: 2008,
    genre: ["Crime", "Drama", "Thriller"],
    director: "Vince Gilligan",
    cast: [
      { name: "Bryan Cranston", character: "Walter White" },
      { name: "Aaron Paul", character: "Jesse Pinkman" }
    ],
    rating: "TV-MA",
    imdbRating: 9.5,
    thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300",
    backdropImage: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    isTrending: false,
    isNewRelease: false,
    category: "tv-show",
    language: "English",
    country: "USA",
    views: 2500000
  },
  {
    title: "The Matrix",
    description: "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
    duration: 136,
    releaseYear: 1999,
    genre: ["Action", "Sci-Fi"],
    director: "The Wachowskis",
    cast: [
      { name: "Keanu Reeves", character: "Neo" },
      { name: "Laurence Fishburne", character: "Morpheus" }
    ],
    rating: "R",
    imdbRating: 8.7,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300",
    backdropImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    isTrending: false,
    isNewRelease: false,
    category: "movie",
    language: "English",
    country: "USA",
    views: 1650000
  },
  {
    title: "Avatar: The Way of Water",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their planet.",
    duration: 192,
    releaseYear: 2022,
    genre: ["Action", "Adventure", "Fantasy"],
    director: "James Cameron",
    cast: [
      { name: "Sam Worthington", character: "Jake Sully" },
      { name: "Zoe Saldana", character: "Neytiri" }
    ],
    rating: "PG-13",
    imdbRating: 7.9,
    thumbnail: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400",
    poster: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300",
    backdropImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    isTrending: true,
    isNewRelease: true,
    category: "movie",
    language: "English",
    country: "USA",
    views: 890000
  },
  {
    title: "Wednesday",
    description: "Follows Wednesday Addams' years as a student at Nevermore Academy, where she attempts to master her emerging psychic ability, thwart a monstrous killing spree that has terrorized the local town, and solve the murder mystery that embroiled her parents.",
    duration: 45,
    releaseYear: 2022,
    genre: ["Comedy", "Crime", "Family"],
    director: "Alfred Gough",
    cast: [
      { name: "Jenna Ortega", character: "Wednesday Addams" },
      { name: "Hunter Doohan", character: "Tyler Galpin" }
    ],
    rating: "TV-14",
    imdbRating: 8.1,
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    backdropImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    isTrending: true,
    isNewRelease: true,
    category: "tv-show",
    language: "English",
    country: "USA",
    views: 1200000
  },
  {
    title: "Planet Earth II",
    description: "David Attenborough returns with a new wildlife documentary that shows life in a variety of habitats.",
    duration: 60,
    releaseYear: 2016,
    genre: ["Documentary", "Nature"],
    director: "David Attenborough",
    cast: [
      { name: "David Attenborough", character: "Narrator" }
    ],
    rating: "TV-G",
    imdbRating: 9.5,
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    poster: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300",
    backdropImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    isTrending: false,
    isNewRelease: false,
    category: "documentary",
    language: "English",
    country: "UK",
    views: 750000
  }
];

// Create admin user
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@netflix.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@netflix.com',
      password: 'admin123',
      isAdmin: true,
      subscription: 'premium'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Seed movies
const seedMovies = async () => {
  try {
    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    // Insert sample movies
    await Movie.insertMany(sampleMovies);
    console.log(`${sampleMovies.length} movies seeded successfully`);
  } catch (error) {
    console.error('Error seeding movies:', error);
  }
};

// Main seeder function
const runSeeder = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/netflix-clone');
    console.log('Connected to MongoDB');

    // Create admin user
    await createAdminUser();

    // Seed movies
    await seedMovies();

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeder:', error);
    process.exit(1);
  }
};

// Run the seeder
runSeeder();