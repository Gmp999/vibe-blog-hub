
import React, { useState } from 'react';
import { mockUsers, mockBlogPosts, mockComments } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Users, 
  FileText, 
  MessageCircle, 
  Eye, 
  Calendar,
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  Trash2,
  Edit
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'posts' | 'comments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    totalUsers: mockUsers.length,
    totalPosts: mockBlogPosts.length,
    totalComments: mockComments.length,
    totalViews: mockBlogPosts.reduce((sum, post) => sum + post.views, 0),
    activeUsers: mockUsers.filter(u => u.role === 'user').length,
    adminUsers: mockUsers.filter(u => u.role === 'admin').length
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Blog Posts"
          value={stats.totalPosts}
          icon={FileText}
          color="green"
        />
        <StatCard
          title="Comments"
          value={stats.totalComments}
          icon={MessageCircle}
          color="purple"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon={Eye}
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBlogPosts.slice(0, 5).map(post => (
                <div key={post.id} className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {post.author.name} • {formatDate(post.createdAt)}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{post.views} views</span>
                      <span>{post.commentsCount} comments</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockComments.slice(0, 5).map(comment => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.author.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      {formatDate(comment.createdAt)}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>User Management</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockUsers
            .filter(user => 
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(user => (
            <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    Joined {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
                
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderPosts = () => (
    <Card>
      <CardHeader>
        <CardTitle>Blog Posts Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockBlogPosts.map(post => (
            <div key={post.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>by {post.author.name}</span>
                  <span>{formatDate(post.createdAt)}</span>
                  <span>{post.views} views</span>
                  <span>{post.commentsCount} comments</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 ml-4">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderComments = () => (
    <Card>
      <CardHeader>
        <CardTitle>Comments Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockComments.map(comment => {
            const post = mockBlogPosts.find(p => p.id === comment.postId);
            return (
              <div key={comment.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{comment.author.name}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-gray-700 mb-2">{comment.content}</p>
                
                {post && (
                  <p className="text-xs text-gray-500">
                    On: <span className="font-medium">{post.title}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your blog platform and monitor activity</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'posts', label: 'Posts', icon: FileText },
            { id: 'comments', label: 'Comments', icon: MessageCircle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'posts' && renderPosts()}
      {activeTab === 'comments' && renderComments()}
    </div>
  );
};

export default AdminDashboard;
