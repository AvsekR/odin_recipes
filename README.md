# LeetCode Progress Tracker

A full-stack web application to track your LeetCode progress and actively judge your performance based on topics, timing, and consistency. Get personalized feedback on your coding journey!

## 🚀 Features

### Core Functionality
- **Problem Management**: Add and track LeetCode problems with difficulty levels and topic tags
- **Attempt Tracking**: Record your attempts with status (solved/attempted/stuck), time taken, and notes
- **Skill Assessment**: Get judged on your performance across different coding topics like Dynamic Programming, Sliding Window, etc.
- **Progress Analytics**: Track daily, weekly, and monthly progress with beautiful charts
- **Performance Insights**: Get personalized feedback and recommendations

### Smart Judging System
- **Topic-based Skill Tracking**: Automatically calculates skill levels for each coding topic
- **Performance Feedback**: Get honest assessments like "You're crushing this topic! 🔥" or "This topic is giving you trouble"
- **Recommendations**: Receive tailored advice on which problems to tackle next
- **Consistency Tracking**: Monitor your coding consistency over time

### Detailed Analytics
- **Time Tracking**: Monitor how long you take to solve problems
- **Success Rate**: Track your solve rate across different topics and difficulties
- **Progress Charts**: Visualize your improvement with interactive charts
- **Performance Insights**: Identify your strongest and weakest areas

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database for data storage
- **RESTful API** design
- **Moment.js** for date handling

### Frontend
- **React** with modern hooks
- **Tailwind CSS** for styling
- **Chart.js** with react-chartjs-2 for analytics
- **React Router** for navigation
- **Lucide React** for icons
- **Axios** for API calls

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd leetcode-progress-tracker
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   This will install dependencies for the root, server, and client.

3. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both the backend server (port 5000) and React frontend (port 3000).

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Alternative Setup (Manual)

If you prefer to set up manually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..

# Start backend (in one terminal)
cd server
npm run dev

# Start frontend (in another terminal)
cd client
npm start
```

## 🎯 How to Use

### 1. Add Problems
- Navigate to "Add Problem" in the top navigation
- Enter the LeetCode problem ID, title, difficulty, and relevant tags
- Use the common tags or add custom ones

### 2. Record Attempts
- Go to the "Problems" page
- Click "Record Attempt" on any problem
- Select status (solved/attempted/stuck), enter time taken, and add notes

### 3. Track Progress
- **Dashboard**: Overview of your performance with recent activity
- **Progress**: Detailed analytics with charts for daily/weekly/monthly progress
- **Skills**: Topic-based skill assessment with personalized feedback

### 4. Get Judged! 💀
The app will actively judge your performance:
- **Excellent mastery**: "You're crushing this topic! 🔥"
- **Need improvement**: "This topic is giving you trouble. Consider reviewing fundamentals."
- **Recommendations**: "Focus on medium-hard problems to reach expert level."

## 📊 Skill Calculation

The skill level for each topic is calculated based on:
- **Success Rate**: Percentage of problems solved in that topic
- **Confidence Factor**: Based on number of attempts (max confidence at 10+ attempts)
- **Formula**: `skill_level = (success_rate × confidence_factor)`

Skill levels are categorized as:
- **Expert** (80%+): You've mastered this topic
- **Advanced** (60-79%): Strong understanding
- **Intermediate** (40-59%): Decent progress
- **Beginner** (20-39%): Getting started
- **Novice** (<20%): Early stages

## 🗂️ Project Structure

```
leetcode-progress-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔄 API Endpoints

### Problems
- `GET /api/problems` - Get all problems
- `POST /api/problems` - Add a new problem

### Attempts
- `GET /api/attempts` - Get all attempts with problem details
- `POST /api/attempts` - Record a new attempt

### Analytics
- `GET /api/summary` - Get overall statistics
- `GET /api/progress/daily` - Get daily progress data
- `GET /api/progress/weekly` - Get weekly progress data
- `GET /api/progress/monthly` - Get monthly progress data
- `GET /api/topic-skills` - Get skill levels for all topics

## 🎨 Features in Detail

### Dashboard
- Overall statistics (total problems, success rate, average time)
- Recent attempts with status and timing
- Top skills with progress bars
- Performance insights

### Problems Page
- Search and filter problems by difficulty, status, and text
- Track attempt history for each problem
- Quick attempt recording with modal
- Problem status indicators (solved/attempted/not attempted)

### Progress Analytics
- Interactive charts for daily, weekly, and monthly progress
- Success rate trends over time
- Average solve time tracking
- Performance insights and consistency metrics

### Skills Assessment
- Detailed breakdown of skills across all coding topics
- Personalized feedback and recommendations
- Skill development strategy with weak areas identification
- Progress tracking with visual indicators

## 🔮 Future Enhancements

- **LeetCode API Integration**: Automatically fetch problem details
- **Goal Setting**: Set and track coding goals
- **Difficulty Progression**: Smart recommendations for next problems
- **Study Plans**: Structured learning paths
- **Social Features**: Compare progress with friends
- **Export Data**: Export progress reports
- **Dark Mode**: Theme customization
- **Mobile App**: React Native version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- LeetCode for providing amazing coding problems
- React and Node.js communities for excellent tools
- Chart.js for beautiful analytics
- Tailwind CSS for rapid UI development

---

**Start tracking your LeetCode journey today and get the honest feedback you need to improve! 💪**