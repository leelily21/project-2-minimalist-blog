'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string;
}

// Make sure this URL matches your backend API route and the backend server is running
const API_URL = 'http://localhost:8000/api/posts';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(API_URL);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Get unique categories from posts
  const categories = Array.from(new Set(posts.map(post => post.category)));

  // Filter posts by selected category
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-5xl font-bold mb-8 text-center text-gray-800">
          Минималистичный Блог
        </h1>

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1 rounded-full border ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border-blue-600'
            }`}
          >
            Барлығы
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1 rounded-full border ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 border-blue-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Загрузка постов...</p>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <h2 className="text-2xl font-semibold text-blue-600">
                  {post.title}
                </h2>
                <p className="text-sm text-blue-600 mt-1">
                  Author - {post.author}. Date - {post.date}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Category - {post.category}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
