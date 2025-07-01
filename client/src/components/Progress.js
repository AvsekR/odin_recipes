import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Calendar, TrendingUp, Clock, BarChart3 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Progress = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [progressData, setProgressData] = useState({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const [dailyRes, weeklyRes, monthlyRes] = await Promise.all([
        axios.get('/api/progress/daily?days=30'),
        axios.get('/api/progress/weekly?weeks=12'),
        axios.get('/api/progress/monthly?months=12')
      ]);

      setProgressData({
        daily: dailyRes.data,
        weekly: weeklyRes.data,
        monthly: monthlyRes.data
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString, period) => {
    const date = new Date(dateString);
    if (period === 'daily') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (period === 'weekly') {
      return `Week ${dateString.split('-')[1]}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  };

  const getChartData = (data, period) => {
    const labels = data.map(item => {
      if (period === 'daily') return formatDate(item.date, period);
      if (period === 'weekly') return formatDate(item.week, period);
      return formatDate(item.month, period);
    }).reverse();

    const totalAttempts = data.map(item => item.total_attempts).reverse();
    const solvedCount = data.map(item => item.solved_count).reverse();
    const avgTime = data.map(item => Math.round(item.avg_time || 0)).reverse();

    return {
      labels,
      datasets: [
        {
          label: 'Total Attempts',
          data: totalAttempts,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Solved Problems',
          data: solvedCount,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
        }
      ],
    };
  };

  const getTimeChartData = (data, period) => {
    const labels = data.map(item => {
      if (period === 'daily') return formatDate(item.date, period);
      if (period === 'weekly') return formatDate(item.week, period);
      return formatDate(item.month, period);
    }).reverse();

    const avgTime = data.map(item => Math.round(item.avg_time || 0)).reverse();

    return {
      labels,
      datasets: [
        {
          label: 'Average Time (minutes)',
          data: avgTime,
          backgroundColor: 'rgba(168, 85, 247, 0.8)',
          borderColor: 'rgb(168, 85, 247)',
          borderWidth: 1,
        }
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const getSuccessRate = (data) => {
    const totalAttempts = data.reduce((sum, item) => sum + item.total_attempts, 0);
    const totalSolved = data.reduce((sum, item) => sum + item.solved_count, 0);
    return totalAttempts > 0 ? Math.round((totalSolved / totalAttempts) * 100) : 0;
  };

  const getAverageTime = (data) => {
    const validTimes = data.filter(item => item.avg_time > 0);
    if (validTimes.length === 0) return 0;
    const totalTime = validTimes.reduce((sum, item) => sum + item.avg_time, 0);
    return Math.round(totalTime / validTimes.length);
  };

  const getTotalAttempts = (data) => {
    return data.reduce((sum, item) => sum + item.total_attempts, 0);
  };

  const getTotalSolved = (data) => {
    return data.reduce((sum, item) => sum + item.solved_count, 0);
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

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

  const currentData = progressData[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Progress Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your coding progress over time with detailed analytics
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { key: 'daily', label: 'Daily (30 days)', icon: Calendar },
              { key: 'weekly', label: 'Weekly (12 weeks)', icon: TrendingUp },
              { key: 'monthly', label: 'Monthly (12 months)', icon: BarChart3 }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`${
                  activeTab === key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats for current period */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard
              title="Total Attempts"
              value={getTotalAttempts(currentData)}
              icon={BarChart3}
              color="text-blue-500"
              subtitle={`In last ${activeTab === 'daily' ? '30 days' : activeTab === 'weekly' ? '12 weeks' : '12 months'}`}
            />
            <StatCard
              title="Problems Solved"
              value={getTotalSolved(currentData)}
              icon={TrendingUp}
              color="text-green-500"
              subtitle="Successfully completed"
            />
            <StatCard
              title="Success Rate"
              value={`${getSuccessRate(currentData)}%`}
              icon={TrendingUp}
              color="text-purple-500"
              subtitle="Solved vs attempted"
            />
            <StatCard
              title="Avg Solve Time"
              value={formatTime(getAverageTime(currentData))}
              icon={Clock}
              color="text-orange-500"
              subtitle="Per successful attempt"
            />
          </div>

          {currentData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attempts Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Attempts & Solutions Over Time
                </h3>
                <div className="h-64">
                  <Line
                    data={getChartData(currentData, activeTab)}
                    options={chartOptions}
                  />
                </div>
              </div>

              {/* Time Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Average Solve Time
                </h3>
                <div className="h-64">
                  <Bar
                    data={getTimeChartData(currentData, activeTab)}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No data available
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start solving problems to see your progress analytics.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Performance Insights */}
      {currentData.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Performance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">
                  Most Active Period
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {currentData.reduce((max, item) => 
                  item.total_attempts > max.total_attempts ? item : max, 
                  currentData[0]
                )?.date || currentData.reduce((max, item) => 
                  item.total_attempts > max.total_attempts ? item : max, 
                  currentData[0]
                )?.week || currentData.reduce((max, item) => 
                  item.total_attempts > max.total_attempts ? item : max, 
                  currentData[0]
                )?.month || 'N/A'}
              </p>
              <p className="text-sm text-blue-700">
                {Math.max(...currentData.map(item => item.total_attempts))} attempts
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-900">
                  Best Performance
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {Math.max(...currentData.map(item => 
                  item.total_attempts > 0 ? Math.round((item.solved_count / item.total_attempts) * 100) : 0
                ))}%
              </p>
              <p className="text-sm text-green-700">
                Success rate in a single period
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-900">
                  Consistency
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {currentData.filter(item => item.total_attempts > 0).length}
              </p>
              <p className="text-sm text-purple-700">
                Active periods out of {currentData.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;