import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import BlogListPage from './BlogListPage';
import AuthPage from './AuthPage';

const Index = () => {
  const { isAuthenticated } = useAuth();

  const handleAuthSuccess = () => {
    // This will be handled by the auth context
  };

  const handleSelectBlog = (blogId: string) => {
    // For now, we'll just log it since we're on the index page
    console.log('Selected blog:', blogId);
  };

  // If user is authenticated or browsing as guest, show blog list
  // Otherwise show auth page
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return <BlogListPage onSelectBlog={handleSelectBlog} />;
};

export default Index;
