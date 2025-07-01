import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { BarChart3, Target, Clock, TrendingUp, Plus } from 'lucide-react';

// Import components
import Dashboard from './components/Dashboard';
import Problems from './components/Problems';
import Progress from './components/Progress';
import TopicSkills from './components/TopicSkills';
import AddProblem from './components/AddProblem';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-gray-900">
                    LeetCode Tracker
                  </h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-primary-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`
                    }
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/problems"
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-primary-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`
                    }
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Problems
                  </NavLink>
                  <NavLink
                    to="/progress"
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-primary-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`
                    }
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Progress
                  </NavLink>
                  <NavLink
                    to="/skills"
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-primary-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`
                    }
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Skills
                  </NavLink>
                </div>
              </div>
              <div className="flex items-center">
                <NavLink
                  to="/add-problem"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Problem
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/skills" element={<TopicSkills />} />
              <Route path="/add-problem" element={<AddProblem />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;