#!/bin/bash

echo "🎬 Netflix Clone Setup Script"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed locally. You can:"
    echo "   1. Install MongoDB locally"
    echo "   2. Use MongoDB Atlas (cloud)"
    echo "   3. Update the MONGODB_URI in backend/.env"
fi

echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install frontend dependencies
echo "⚛️  Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Create backend .env file
echo "📝 Setting up environment variables..."
cd backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created backend/.env file"
    echo "⚠️  Please update the environment variables in backend/.env"
else
    echo "✅ backend/.env already exists"
fi
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your MongoDB URI and JWT secret"
echo "2. Start MongoDB (if using local installation)"
echo "3. Seed the database: cd backend && npm run seed"
echo "4. Start the application: npm run dev"
echo ""
echo "🌐 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "👤 Admin credentials (after seeding):"
echo "   Email:    admin@netflix.com"
echo "   Password: admin123"
echo ""
echo "🚀 Happy coding!"