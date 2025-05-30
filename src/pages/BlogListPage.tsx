
import React, { useState } from 'react';
import { useBlogPosts } from '../hooks/useBlogPosts';
import BlogCard from '../components/BlogCard';
import { Search, Filter, Tag, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

interface BlogListPageProps {
  onSelectBlog: (blogId: string) => void;
}

const BlogListPage: React.FC<BlogListPageProps> = ({ onSelectBlog }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  const { data: blogPosts, isLoading, error } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading blogs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading blogs</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  const posts = blogPosts || [];

  // Get all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  ).sort();

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === '' || post.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Latest Blogs</h1>
        <p className="text-gray-600">Discover insights, tutorials, and stories from our community</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search blogs, authors, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tag Filter */}
          <div className="lg:w-64">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="lg:w-40">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedTag) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTag && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                <Tag className="w-3 h-3 mr-1" />
                {selectedTag}
                <button
                  onClick={() => setSelectedTag('')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Counter */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'blog' : 'blogs'} found
        </p>
      </div>

      {/* Blog Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <BlogCard
              key={post.id}
              post={post}
              onClick={() => onSelectBlog(post.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-sm mx-auto">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or browse all blogs.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedTag('');
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Popular Tags */}
      {allTags.length > 0 && (
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 10).map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
