
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';

// Pages
import AuthPage from './pages/AuthPage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CreateEditBlogPage from './pages/CreateEditBlogPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navigation from './components/Navigation';

type AppPage = 'auth' | 'blogs' | 'blog-detail' | 'create-blog' | 'edit-blog' | 'profile' | 'admin';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<AppPage>('blogs');
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Handle navigation
  const handleNavigate = (page: AppPage, blogId?: string) => {
    setCurrentPage(page);
    if (blogId) {
      setSelectedBlogId(blogId);
    }
  };

  const handleSelectBlog = (blogId: string) => {
    setSelectedBlogId(blogId);
    setCurrentPage('blog-detail');
  };

  const handleAuthSuccess = () => {
    setCurrentPage('blogs');
  };

  const handleBackToBlogs = () => {
    setSelectedBlogId(null);
    setCurrentPage('blogs');
  };

  const handleBlogSaved = () => {
    setCurrentPage('blogs');
  };

  const handleEditBlog = (blogId: string) => {
    setSelectedBlogId(blogId);
    setCurrentPage('edit-blog');
  };

  // Show auth page if not authenticated (unless browsing as guest)
  if (!isAuthenticated && currentPage !== 'blogs' && currentPage !== 'blog-detail') {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - show for authenticated users or guests browsing blogs */}
      {(isAuthenticated || currentPage === 'blogs' || currentPage === 'blog-detail') && (
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {/* Main Content */}
      <main>
        {currentPage === 'auth' && <AuthPage onAuthSuccess={handleAuthSuccess} />}
        
        {currentPage === 'blogs' && (
          <BlogListPage onSelectBlog={handleSelectBlog} />
        )}
        
        {currentPage === 'blog-detail' && selectedBlogId && (
          <BlogDetailPage
            blogId={selectedBlogId}
            onBack={handleBackToBlogs}
            onEdit={handleEditBlog}
          />
        )}
        
        {currentPage === 'create-blog' && isAuthenticated && (
          <CreateEditBlogPage
            onBack={handleBackToBlogs}
            onSave={handleBlogSaved}
          />
        )}
        
        {currentPage === 'edit-blog' && selectedBlogId && isAuthenticated && (
          <CreateEditBlogPage
            blogId={selectedBlogId}
            onBack={handleBackToBlogs}
            onSave={handleBlogSaved}
          />
        )}
        
        {currentPage === 'profile' && isAuthenticated && (
          <ProfilePage onSelectBlog={handleSelectBlog} />
        )}
        
        {currentPage === 'admin' && user?.role === 'admin' && (
          <AdminDashboard />
        )}

        {/* Redirect to auth for protected pages when not authenticated */}
        {!isAuthenticated && ['create-blog', 'edit-blog', 'profile', 'admin'].includes(currentPage) && (
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        )}
      </main>

      <Toaster />
      <Sonner />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
