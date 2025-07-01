import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, TrendingUp, Award, Clock, BarChart3 } from 'lucide-react';

const TopicSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('skill_level');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('/api/topic-skills');
      setSkills(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setLoading(false);
    }
  };

  const getSkillLevelColor = (level) => {
    if (level >= 0.8) return 'text-green-600 bg-green-100 border-green-300';
    if (level >= 0.6) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    if (level >= 0.4) return 'text-orange-600 bg-orange-100 border-orange-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const getSkillLevelText = (level) => {
    if (level >= 0.8) return 'Expert';
    if (level >= 0.6) return 'Advanced';
    if (level >= 0.4) return 'Intermediate';
    if (level >= 0.2) return 'Beginner';
    return 'Novice';
  };

  const getProgressBarColor = (level) => {
    if (level >= 0.8) return 'bg-green-500';
    if (level >= 0.6) return 'bg-yellow-500';
    if (level >= 0.4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getJudgment = (skill) => {
    const { skill_level, total_attempts, successful_attempts } = skill;
    const successRate = total_attempts > 0 ? successful_attempts / total_attempts : 0;
    
    if (total_attempts === 0) {
      return "Haven't tackled this topic yet. Time to start!";
    }
    
    if (skill_level >= 0.8) {
      return "Excellent mastery! You're crushing this topic. 🔥";
    } else if (skill_level >= 0.6) {
      return "Strong understanding! Keep pushing to reach expert level.";
    } else if (skill_level >= 0.4) {
      return "Decent progress, but there's room for improvement.";
    } else if (skill_level >= 0.2) {
      return "Getting started. Practice more problems in this area.";
    } else if (successRate === 0) {
      return "This topic is giving you trouble. Consider reviewing fundamentals.";
    } else {
      return "Early stages. Don't give up, consistency will pay off!";
    }
  };

  const getRecommendation = (skill) => {
    const { skill_level, total_attempts } = skill;
    
    if (total_attempts === 0) {
      return "Start with 2-3 easy problems to build confidence.";
    }
    
    if (skill_level >= 0.8) {
      return "Try harder problems or explore advanced variations.";
    } else if (skill_level >= 0.6) {
      return "Focus on medium-hard problems to reach expert level.";
    } else if (skill_level >= 0.4) {
      return "Practice more medium problems and review weak areas.";
    } else {
      return "Stick to easy-medium problems and focus on understanding.";
    }
  };

  const sortedSkills = [...skills].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'topic') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getOverallStats = () => {
    if (skills.length === 0) return { avgSkill: 0, totalAttempts: 0, mastered: 0 };
    
    const totalSkillLevel = skills.reduce((sum, skill) => sum + skill.skill_level, 0);
    const avgSkill = totalSkillLevel / skills.length;
    const totalAttempts = skills.reduce((sum, skill) => sum + skill.total_attempts, 0);
    const mastered = skills.filter(skill => skill.skill_level >= 0.8).length;
    
    return { avgSkill, totalAttempts, mastered };
  };

  const stats = getOverallStats();

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
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
        <h1 className="text-2xl font-bold text-gray-900">Topic Skills</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your proficiency across different coding topics and get personalized feedback
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Topics"
          value={skills.length}
          icon={Target}
          color="text-blue-500"
          subtitle="Areas you've practiced"
        />
        <StatCard
          title="Average Skill"
          value={`${Math.round(stats.avgSkill * 100)}%`}
          icon={BarChart3}
          color="text-purple-500"
          subtitle="Overall proficiency"
        />
        <StatCard
          title="Mastered Topics"
          value={stats.mastered}
          icon={Award}
          color="text-green-500"
          subtitle="80%+ skill level"
        />
        <StatCard
          title="Total Practice"
          value={stats.totalAttempts}
          icon={Clock}
          color="text-orange-500"
          subtitle="Problems attempted"
        />
      </div>

      {/* Skills Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Topic Breakdown</h3>
            <div className="flex space-x-3">
              <select
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="skill_level">Skill Level</option>
                <option value="topic">Topic Name</option>
                <option value="total_attempts">Total Attempts</option>
                <option value="successful_attempts">Success Count</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md focus:outline-none"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {skills.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {sortedSkills.map((skill) => (
              <div key={skill.topic} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h4 className="text-lg font-medium text-gray-900">
                        {skill.topic}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSkillLevelColor(skill.skill_level)}`}>
                        {getSkillLevelText(skill.skill_level)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round(skill.skill_level * 100)}%
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{skill.successful_attempts}/{skill.total_attempts} solved</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(skill.skill_level)}`}
                          style={{ width: `${skill.skill_level * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-blue-900 mb-1">
                          📊 Assessment
                        </h5>
                        <p className="text-sm text-blue-800">
                          {getJudgment(skill)}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-green-900 mb-1">
                          💡 Recommendation
                        </h5>
                        <p className="text-sm text-green-800">
                          {getRecommendation(skill)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(skill.skill_level * 100)}
                    </div>
                    <div className="text-sm text-gray-500">Skill Score</div>
                    <div className="mt-2 text-xs text-gray-400">
                      Updated {new Date(skill.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No skill data available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start solving problems to build your skill profile!
            </p>
          </div>
        )}
      </div>

      {/* Skill Development Tips */}
      {skills.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            🎯 Skill Development Strategy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-red-900 mb-2">
                🔴 Weak Areas (Focus Here!)
              </h4>
              <div className="space-y-1">
                {skills
                  .filter(skill => skill.skill_level < 0.4 && skill.total_attempts > 0)
                  .slice(0, 3)
                  .map(skill => (
                    <div key={skill.topic} className="text-sm text-red-800">
                      • {skill.topic} ({Math.round(skill.skill_level * 100)}%)
                    </div>
                  ))}
                {skills.filter(skill => skill.skill_level < 0.4 && skill.total_attempts > 0).length === 0 && (
                  <div className="text-sm text-red-800">No weak areas identified!</div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">
                🟡 Developing Skills
              </h4>
              <div className="space-y-1">
                {skills
                  .filter(skill => skill.skill_level >= 0.4 && skill.skill_level < 0.8)
                  .slice(0, 3)
                  .map(skill => (
                    <div key={skill.topic} className="text-sm text-yellow-800">
                      • {skill.topic} ({Math.round(skill.skill_level * 100)}%)
                    </div>
                  ))}
                {skills.filter(skill => skill.skill_level >= 0.4 && skill.skill_level < 0.8).length === 0 && (
                  <div className="text-sm text-yellow-800">No developing skills!</div>
                )}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-2">
                🟢 Strong Skills
              </h4>
              <div className="space-y-1">
                {skills
                  .filter(skill => skill.skill_level >= 0.8)
                  .slice(0, 3)
                  .map(skill => (
                    <div key={skill.topic} className="text-sm text-green-800">
                      • {skill.topic} ({Math.round(skill.skill_level * 100)}%)
                    </div>
                  ))}
                {skills.filter(skill => skill.skill_level >= 0.8).length === 0 && (
                  <div className="text-sm text-green-800">Keep practicing to master topics!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicSkills;