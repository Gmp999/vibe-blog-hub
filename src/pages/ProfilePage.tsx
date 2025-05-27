
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBlogPosts } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { User, Edit, Save, X, Calendar, Eye, MessageCircle } from 'lucide-react';
import BlogCard from '../components/BlogCard';

interface ProfilePageProps {
  onSelectBlog: (blogId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onSelectBlog }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  const userPosts = mockBlogPosts.filter(post => post.authorId === user?.id);
  
  const stats = {
    totalPosts: userPosts.length,
    totalViews: userPosts.reduce((sum, post) => sum + post.views, 0),
    totalComments: userPosts.reduce((sum, post) => sum + post.commentsCount, 0)
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = {
      ...user,
      name: profileForm.name,
      bio: profileForm.bio,
      avatar: profileForm.avatar
    };
    
    updateUser(updatedUser);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setProfileForm({
      name: user?.name || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profile</CardTitle>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  {/* Avatar */}
                  <div>
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                      id="avatar"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      rows={4}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving || !profileForm.name.trim()}
                      className="flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  {/* Avatar */}
                  <div className="mb-4">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                        <User className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  
                  {user.bio && (
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                      {user.bio}
                    </p>
                  )}

                  {/* Member Since */}
                  <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </div>

                  {/* Role Badge */}
                  <div className="mt-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? '👑 Admin' : '✍️ Writer'}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Edit className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Posts</span>
                  </div>
                  <span className="font-semibold">{stats.totalPosts}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Total Views</span>
                  </div>
                  <span className="font-semibold">{stats.totalViews}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Comments</span>
                  </div>
                  <span className="font-semibold">{stats.totalComments}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User's Blog Posts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Blog Posts ({userPosts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {userPosts.length > 0 ? (
                <div className="space-y-6">
                  {userPosts.map(post => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      onClick={() => onSelectBlog(post.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Edit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No blog posts yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start sharing your thoughts and ideas with the community!
                  </p>
                  <Button onClick={() => window.location.href = '#create-blog'}>
                    Write Your First Post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
