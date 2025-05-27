
import React, { useState } from 'react';
import { mockBlogPosts, mockComments } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, User, Eye, MessageCircle, Tag, ArrowLeft, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader } from '../components/ui/card';

interface BlogDetailPageProps {
  blogId: string;
  onBack: () => void;
  onEdit: (blogId: string) => void;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ blogId, onBack, onEdit }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(mockComments);

  const post = mockBlogPosts.find(p => p.id === blogId);
  const postComments = comments.filter(c => c.postId === blogId);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment = {
      id: String(Date.now()),
      postId: blogId,
      authorId: user.id,
      author: user,
      content: newComment.trim(),
      createdAt: new Date().toISOString()
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{line.slice(3)}</h2>;
        }
        if (line.startsWith('```')) {
          return null; // Handle code blocks separately
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        if (line.includes('`') && !line.startsWith('```')) {
          // Handle inline code
          const parts = line.split('`');
          return (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {parts.map((part, i) => 
                i % 2 === 0 ? part : <code key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">{part}</code>
              )}
            </p>
          );
        }
        return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{line}</p>;
      });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blogs
      </Button>

      {/* Article Header */}
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          {/* Title and Actions */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{post.title}</h1>
            {user && (user.id === post.authorId || user.role === 'admin') && (
              <Button
                onClick={() => onEdit(post.id)}
                variant="outline"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-200">
            {/* Author */}
            <div className="flex items-center space-x-3">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{post.author.name}</p>
                <p className="text-sm text-gray-500">{post.author.bio}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{formatDate(post.createdAt)}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-gray-500">
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span className="text-sm">{post.views} views</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{postComments.length} comments</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {formatContent(post.content)}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({postComments.length})
        </h3>

        {/* Add Comment Form */}
        {user ? (
          <Card className="mb-8">
            <CardHeader>
              <h4 className="text-lg font-semibold">Add a comment</h4>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitComment}>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this blog post..."
                  className="min-h-[100px] mb-4"
                  required
                />
                <Button type="submit" disabled={!newComment.trim()}>
                  Post Comment
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">Please sign in to leave a comment.</p>
            </CardContent>
          </Card>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {postComments.length > 0 ? (
            postComments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {comment.author.avatar ? (
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-semibold text-gray-900">{comment.author.name}</p>
                        <span className="text-gray-500">•</span>
                        <p className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h4>
                <p className="text-gray-600">Be the first to share your thoughts on this blog post!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
