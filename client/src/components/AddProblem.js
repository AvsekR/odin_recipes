import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Tag, Hash, BookOpen, Save, X } from 'lucide-react';

const AddProblem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leetcode_id: '',
    title: '',
    difficulty: 'Easy',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const commonTags = [
    'Array', 'String', 'Hash Table', 'Dynamic Programming', 'Math',
    'Two Pointers', 'Greedy', 'Sorting', 'Depth-First Search', 'Breadth-First Search',
    'Binary Search', 'Tree', 'Binary Tree', 'Heap', 'Stack', 'Queue',
    'Linked List', 'Graph', 'Backtracking', 'Sliding Window',
    'Union Find', 'Trie', 'Bit Manipulation', 'Design', 'Simulation',
    'Recursion', 'Divide and Conquer', 'Memoization', 'Binary Search Tree',
    'Matrix', 'Prefix Sum', 'Topological Sort', 'Monotonic Stack'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/problems', formData);
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          leetcode_id: '',
          title: '',
          difficulty: 'Easy',
          tags: []
        });
        setSuccess(false);
        navigate('/problems');
      }, 2000);
    } catch (error) {
      console.error('Error adding problem:', error);
      alert('Error adding problem. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput.trim());
      setTagInput('');
    }
  };

  const handleCommonTagClick = (tag) => {
    addTag(tag);
  };

  if (success) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <Save className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Problem Added Successfully!
          </h2>
          <p className="mt-2 text-gray-600">
            Redirecting to problems page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Problem</h1>
          <p className="mt-1 text-sm text-gray-600">
            Add a LeetCode problem to your tracking list
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* LeetCode ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline w-4 h-4 mr-1" />
                LeetCode Problem ID
              </label>
              <input
                type="number"
                name="leetcode_id"
                value={formData.leetcode_id}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 1"
                required
                min="1"
              />
              <p className="mt-1 text-xs text-gray-500">
                The numeric ID from LeetCode (e.g., 1 for "Two Sum")
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="inline w-4 h-4 mr-1" />
                Problem Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Two Sum"
                required
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                Topic Tags
              </label>
              
              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 border border-primary-300"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag Input */}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Type a tag and press Enter"
              />
              <p className="mt-1 text-xs text-gray-500">
                Add relevant topic tags like "Array", "Dynamic Programming", etc.
              </p>

              {/* Common Tags */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Common Tags (click to add):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {commonTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleCommonTagClick(tag)}
                      disabled={formData.tags.includes(tag)}
                      className={`text-sm px-3 py-1 rounded-md border text-left ${
                        formData.tags.includes(tag)
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Problem
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/problems')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            💡 Tips for Adding Problems
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Find the problem ID in the LeetCode URL (e.g., /problems/two-sum/ → ID is 1)</li>
            <li>• Use the exact problem title from LeetCode for consistency</li>
            <li>• Add relevant topic tags to help track your skill development</li>
            <li>• You can always edit or add more details later</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProblem;