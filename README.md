# Netflix Clone - MERN Stack

A full-featured Netflix clone built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a RESTful API architecture.

## 🎯 Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Protected routes
- Admin role management

### 🎬 Movie Management
- Browse movies and TV shows
- Search and filter functionality
- Genre-based categorization
- Trending and new releases sections
- Movie details with video player
- Like/dislike system
- View tracking

### 👤 User Features
- Personal movie list (My List)
- Watch history tracking
- User profile management
- Subscription plans
- Responsive design

### 🎨 UI/UX
- Netflix-inspired design
- Modern, responsive interface
- Mobile-friendly navigation
- Smooth animations and transitions
- Video player integration

## 🏗️ Project Structure

```
netflix-clone/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Movie.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── movies.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── package.json
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── MovieCard.js
│   │   │   └── Loading.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Browse.js
│   │   │   ├── MovieDetail.js
│   │   │   ├── MyList.js
│   │   │   ├── Profile.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd netflix-clone
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   npm run install-server

   # Install frontend dependencies
   npm run install-client
   ```

3. **Environment Setup**
   ```bash
   # Copy and configure backend environment
   cd backend
   cp .env.example .env
   ```

   Edit `backend/.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/netflix-clone
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev

   # Or run separately:
   # Backend only
   npm run server

   # Frontend only
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Movie Routes
- `GET /api/movies` - Get movies with filters/pagination
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/new-releases` - Get new releases
- `GET /api/movies/genres` - Get all genres
- `GET /api/movies/:id` - Get single movie
- `POST /api/movies` - Create movie (admin only)
- `PUT /api/movies/:id` - Update movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)
- `POST /api/movies/:id/like` - Like/unlike movie
- `POST /api/movies/:id/dislike` - Dislike movie

### User Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/my-list` - Get user's movie list
- `POST /api/users/my-list/:movieId` - Add movie to list
- `DELETE /api/users/my-list/:movieId` - Remove movie from list
- `GET /api/users/watch-history` - Get watch history
- `POST /api/users/watch-history/:movieId` - Add to watch history

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Media management

### Frontend
- **React** - Frontend framework
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **React Player** - Video player
- **React Icons** - Icon library

## 🎨 Styling
- Custom CSS with Netflix-inspired design
- Responsive grid layouts
- Mobile-first approach
- Smooth animations and transitions

## 🔧 Development Scripts

```bash
# Install all dependencies
npm run install-all

# Run development environment
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client

# Build frontend for production
npm run build
```

## 📱 Features Overview

### Home Page
- Hero section with featured movie
- Trending movies carousel
- New releases section
- Responsive movie grid

### Browse Page
- Advanced filtering options
- Search functionality
- Pagination
- Genre and category filters

### Movie Detail Page
- Full movie information
- Video player integration
- Add to list functionality
- Like/dislike system
- Cast and crew details

### User Features
- Personal movie list management
- Watch history tracking
- Profile customization
- Subscription management

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create Heroku app
2. Set environment variables
3. Deploy with Git
4. Connect to MongoDB Atlas

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend
2. Deploy to hosting platform
3. Configure environment variables
4. Set up redirects for SPA

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎬 Demo

The application includes:
- Full authentication system
- Movie browsing and search
- Video streaming capabilities
- User profile management
- Responsive design for all devices

## 🐛 Known Issues

- Video URLs need to be properly configured
- Image URLs should be updated with actual movie posters
- Real payment integration needed for subscription plans

## 📞 Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ using the MERN stack