'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/feedback');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <Image
            className="mx-auto dark:invert"
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
          <h1 className="text-4xl font-bold">
            Sentiment Analysis
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Get insights from your customer feedback
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/signin"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
          >
            Sign Up
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Submit Feedback</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Share your thoughts about our products and services
            </p>
          </div>
          
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Instant Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get immediate sentiment analysis of your feedback
            </p>
          </div>
          
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Track Insights</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor feedback trends and sentiment over time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
