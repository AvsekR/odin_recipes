import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Search,
  Plus,
  Tag
} from 'lucide-react';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAttemptModal, setShowAttemptModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [attemptForm, setAttemptForm] = useState({
    status: 'solved',
    time_taken: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [problemsRes, attemptsRes] = await Promise.all([
        axios.get('/api/problems'),
        axios.get('/api/attempts')
      ]);

      setProblems(problemsRes.data);
      setAttempts(attemptsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching problems data:', error);
      setLoading(false);
    }
  };

  const handleAttempt = (problem) => {
    setSelectedProblem(problem);
    setShowAttemptModal(true);
    setAttemptForm({
      status: 'solved',
      time_taken: '',
      notes: ''
    });
  };

  const submitAttempt = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/attempts', {
        problem_id: selectedProblem.id,
        status: attemptForm.status,
        time_taken: parseInt(attemptForm.time_taken) || null,
        notes: attemptForm.notes
      });

      setShowAttemptModal(false);
      setSelectedProblem(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error submitting attempt:', error);
    }
  };

  const getProblemStatus = (problemId) => {
    const problemAttempts = attempts.filter(a => a.problem_id === problemId);
    if (problemAttempts.length === 0) return 'Not Attempted';
    
    const hasSolved = problemAttempts.some(a => a.status === 'solved');
    if (hasSolved) return 'Solved';
    
    return 'Attempted';
  };

  const getLastAttemptTime = (problemId) => {
    const problemAttempts = attempts.filter(a => a.problem_id === problemId);
    if (problemAttempts.length === 0) return null;
    
    const lastAttempt = problemAttempts[0]; // Already sorted by date desc
    return lastAttempt.time_taken;
  };

  const getDifficultyBadge = (difficulty) => {
    const classes = {
      Easy: 'difficulty-easy',
      Medium: 'difficulty-medium',
      Hard: 'difficulty-hard'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes[difficulty]}`}>
        {difficulty}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const classes = {
      'Solved': 'status-solved',
      'Attempted': 'status-attempted',
      'Not Attempted': 'border-gray-300 bg-gray-100 text-gray-800'
    };
    const icons = {
      'Solved': CheckCircle,
      'Attempted': Clock,
      'Not Attempted': AlertCircle
    };
    const Icon = icons[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes[status]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.leetcode_id.toString().includes(searchTerm);
    const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
    const problemStatus = getProblemStatus(problem.id);
    const matchesStatus = statusFilter === 'All' || problemStatus === statusFilter;
    
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Problems</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your LeetCode problems and track attempts
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="mt-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Difficulty
            </label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Solved">Solved</option>
              <option value="Attempted">Attempted</option>
              <option value="Not Attempted">Not Attempted</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProblems.map((problem) => {
            const status = getProblemStatus(problem.id);
            const lastTime = getLastAttemptTime(problem.id);
            const tags = JSON.parse(problem.tags || '[]');
            
            return (
              <li key={problem.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">
                        #{problem.leetcode_id}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {problem.title}
                      </h3>
                      {getDifficultyBadge(problem.difficulty)}
                      {getStatusBadge(status)}
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {lastTime && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Last: {formatTime(lastTime)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAttempt(problem)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Record Attempt
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        
        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No problems found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Attempt Modal */}
      {showAttemptModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Record Attempt - {selectedProblem?.title}
            </h3>
            
            <form onSubmit={submitAttempt} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={attemptForm.status}
                  onChange={(e) => setAttemptForm({...attemptForm, status: e.target.value})}
                  required
                >
                  <option value="solved">Solved</option>
                  <option value="attempted">Attempted</option>
                  <option value="stuck">Stuck</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time Taken (minutes)
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter time in minutes"
                  value={attemptForm.time_taken}
                  onChange={(e) => setAttemptForm({...attemptForm, time_taken: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes (optional)
                </label>
                <textarea
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  rows="3"
                  placeholder="Add any notes about your attempt..."
                  value={attemptForm.notes}
                  onChange={(e) => setAttemptForm({...attemptForm, notes: e.target.value})}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Save Attempt
                </button>
                <button
                  type="button"
                  onClick={() => setShowAttemptModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Problems;