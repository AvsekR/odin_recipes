import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Award,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, attemptsRes, skillsRes] = await Promise.all([
        axios.get('/api/summary'),
        axios.get('/api/attempts?limit=5'),
        axios.get('/api/topic-skills')
      ]);

      setSummary(summaryRes.data);
      setRecentAttempts(attemptsRes.data.slice(0, 5));
      setTopSkills(skillsRes.data.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg fade-in">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
              {subtitle && (
                <dd className="text-sm text-gray-600">{subtitle}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

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
      solved: 'status-solved',
      attempted: 'status-attempted',
      stuck: 'status-stuck'
    };
    const icons = {
      solved: CheckCircle,
      attempted: Clock,
      stuck: AlertCircle
    };
    const Icon = icons[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes[status]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
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

  const getSkillLevelColor = (level) => {
    if (level >= 0.8) return 'text-green-600 bg-green-100';
    if (level >= 0.6) return 'text-yellow-600 bg-yellow-100';
    if (level >= 0.4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your LeetCode progress and improve your coding skills
        </p>
      </div>

      {/* Stats Grid */}
      {summary && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Problems"
            value={summary.total_problems}
            icon={Target}
            color="text-blue-500"
            subtitle="Problems in database"
          />
          <StatCard
            title="Success Rate"
            value={`${summary.success_rate}%`}
            icon={TrendingUp}
            color="text-green-500"
            subtitle={`${summary.solved_problems}/${summary.total_attempts} solved`}
          />
          <StatCard
            title="Avg Solve Time"
            value={formatTime(summary.avg_solve_time)}
            icon={Clock}
            color="text-purple-500"
            subtitle="Per successful attempt"
          />
          <StatCard
            title="Problems Attempted"
            value={summary.unique_problems_attempted}
            icon={Award}
            color="text-orange-500"
            subtitle="Unique problems"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attempts */}
        <div className="bg-white shadow rounded-lg fade-in">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Attempts
            </h3>
            <div className="mt-5">
              {recentAttempts.length > 0 ? (
                <div className="space-y-3">
                  {recentAttempts.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {attempt.leetcode_id}. {attempt.title}
                          </span>
                          {getDifficultyBadge(attempt.difficulty)}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(attempt.status)}
                          <span className="text-sm text-gray-500">
                            {formatTime(attempt.time_taken)}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(attempt.attempt_date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No attempts recorded yet. Start by adding some problems!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Top Skills */}
        <div className="bg-white shadow rounded-lg fade-in">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Top Skills
            </h3>
            <div className="mt-5">
              {topSkills.length > 0 ? (
                <div className="space-y-3">
                  {topSkills.map((skill) => (
                    <div key={skill.topic} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {skill.topic}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getSkillLevelColor(skill.skill_level)}`}>
                            {Math.round(skill.skill_level * 100)}%
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <span>
                            {skill.successful_attempts}/{skill.total_attempts} solved
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${skill.skill_level * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No skill data available yet. Start solving problems to see your progress!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;