'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

interface Feedback {
  uuid: string;
  text: string;
  sentimentScore: number;
  sentimentLabel: 'Good' | 'Bad' | 'Neutral';
  createdAt: string;
}

export default function FeedbackPage() {
  const router = useRouter();
  const [feedbackText, setFeedbackText] = useState('');
  const [userFeedbacks, setUserFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    loadUserFeedback();
  }, [router]);

  const loadUserFeedback = async () => {
    try {
      const feedbacks = await api.getUserFeedback();
      setUserFeedbacks(feedbacks);
    } catch (err) {
      setError('Failed to load feedback');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingFeedback) {
        await api.updateFeedback(editingFeedback, { text: feedbackText });
        toast.success('Feedback updated successfully');
      } else {
        await api.submitFeedback({ text: feedbackText });
        toast.success('Feedback submitted successfully');
      }
      setFeedbackText('');
      setEditingFeedback(null);
      loadUserFeedback();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit feedback';
      toast.error(message);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (feedback: Feedback) => {
    setFeedbackText(feedback.text);
    setEditingFeedback(feedback.uuid);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await api.deleteFeedback(id);
      setUserFeedbacks(userFeedbacks.filter(f => f.uuid !== id));
      toast.success('Feedback deleted successfully');
    } catch (err) {
      toast.error('Failed to delete feedback');
      setError('Failed to delete feedback');
    }
  };

  const handleCancel = () => {
    setFeedbackText('');
    setEditingFeedback(null);
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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Customer Feedback</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}
          <div className="mb-4">
            <label 
              htmlFor="feedback" 
              className="block text-sm font-medium text-foreground mb-2"
            >
              Your Feedback
            </label>
            <textarea
              id="feedback"
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share your thoughts (max 1000 characters)"
              required
            />
            <div className="text-sm text-gray-500 mt-1">
              {feedbackText.length}/1000 characters
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {editingFeedback ? 'Update Feedback' : 'Submit Feedback'}
            </button>
            {editingFeedback && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Previous Feedback */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Your Previous Feedback</h2>
          {userFeedbacks.length === 0 ? (
            <p className="text-gray-500">No feedback submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {userFeedbacks.map((feedback) => (
                <div
                  key={feedback.uuid}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-foreground">{feedback.text}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(feedback)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(feedback.uuid)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className={getSentimentColor(feedback.sentimentLabel)}>
                      Sentiment: {feedback.sentimentLabel}
                    </span>
                    <span className="ml-4">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 