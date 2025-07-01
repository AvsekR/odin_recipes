#!/bin/bash

echo "🚀 Setting up LeetCode Progress Tracker..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

echo "Installing root dependencies..."
npm install

echo ""
echo "Installing server dependencies..."
cd server
npm install
cd ..

echo ""
echo "Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ All dependencies installed!"
echo ""

# Ask if user wants to seed the database
echo "🌱 Would you like to populate the database with sample data? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "Seeding database with sample problems and attempts..."
    cd server
    npm run seed
    cd ..
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development servers:"
echo "   npm run dev"
echo ""
echo "2. Open your browser and go to:"
echo "   http://localhost:3000"
echo ""
echo "3. The backend API will be running on:"
echo "   http://localhost:5000"
echo ""
echo "💡 Tips:"
echo "- Add some LeetCode problems using the 'Add Problem' button"
echo "- Record your attempts to see skill tracking in action"
echo "- Check the Progress and Skills pages for analytics"
echo ""
echo "Happy coding! 💪"