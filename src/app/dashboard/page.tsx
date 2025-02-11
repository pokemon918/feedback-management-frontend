'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

interface Feedback {
  uuid: string;
  text: string;
  sentimentScore: number;
  sentimentLabel: 'Good' | 'Bad' | 'Neutral';
  createdAt: string;
  userId: string;
  username: string;
}

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Good' | 'Bad' | 'Neutral'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'sentiment'>('date');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    loadAllFeedback();
  }, [router]);

  const loadAllFeedback = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAllFeedback();
      setFeedbacks(data);
    } catch (err) {
      setError('Failed to load feedback. Admin access required.');
      // If unauthorized, redirect to feedback page
      if (err instanceof Error && err.message.includes('403')) {
        router.push('/feedback');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await api.adminDeleteFeedback(id);
      setFeedbacks(feedbacks.filter(f => f.uuid !== id));
      toast.success('Feedback deleted successfully');
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete feedback');
      setError('Failed to delete feedback');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'Good':
        return 'text-green-600';
      case 'Bad':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredAndSortedFeedback = () => {
    let result = [...feedbacks];
    
    // Apply filter
    if (filter !== 'all') {
      result = result.filter(f => f.sentimentLabel === filter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return b.sentimentScore - a.sentimentScore;
      }
    });
    
    return result;
  };

  const getFeedbackStats = () => {
    const total = feedbacks.length;
    const good = feedbacks.filter(f => f.sentimentLabel === 'Good').length;
    const bad = feedbacks.filter(f => f.sentimentLabel === 'Bad').length;
    const neutral = feedbacks.filter(f => f.sentimentLabel === 'Neutral').length;

    return { total, good, bad, neutral };
  };

  const stats = getFeedbackStats();

  // Add chart data configurations
  const barChartData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        label: 'Feedback Distribution',
        data: [stats.good, stats.bad, stats.neutral],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',  // green
          'rgba(239, 68, 68, 0.5)',  // red
          'rgba(156, 163, 175, 0.5)', // gray
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(156, 163, 175)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [stats.good, stats.bad, stats.neutral],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Feedback</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-green-500 text-sm">Positive</h3>
            <p className="text-2xl font-bold">{stats.good}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-red-500 text-sm">Negative</h3>
            <p className="text-2xl font-bold">{stats.bad}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Neutral</h3>
            <p className="text-2xl font-bold">{stats.neutral}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm mb-4">Feedback Distribution (Bar)</h3>
            <Bar data={barChartData} options={chartOptions} />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm mb-4">Feedback Distribution (Pie)</h3>
            <div className="h-[300px]">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="bg-white dark:bg-gray-800 border rounded px-3 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Sentiments</option>
            <option value="Good">Positive</option>
            <option value="Bad">Negative</option>
            <option value="Neutral">Neutral</option>
          </select>

          <select
            className="bg-white dark:bg-gray-800 border rounded px-3 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'sentiment')}
          >
            <option value="date">Sort by Date</option>
            <option value="sentiment">Sort by Sentiment</option>
          </select>
        </div>

        {/* Feedback List */}
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedFeedback().map((feedback) => (
              <div
                key={feedback.uuid}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      User: {feedback.username || 'Unknown'}
                    </p>
                    <p className="text-foreground">{feedback.text}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(feedback.uuid)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className={getSentimentColor(feedback.sentimentLabel)}>
                    Sentiment: {feedback.sentimentLabel} ({feedback.sentimentScore.toFixed(2)})
                  </span>
                  <span className="text-gray-500">
                    {new Date(feedback.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 