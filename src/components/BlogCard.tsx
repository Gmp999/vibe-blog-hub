
import React from 'react';
import { BlogPost } from '../types';
import { Calendar, User, Eye, MessageCircle, Tag } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  onClick: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300 group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </div>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Author Info */}
          <div className="flex items-center space-x-3">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {post.views}
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {post.commentsCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
