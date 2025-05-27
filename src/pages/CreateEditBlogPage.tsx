
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBlogPosts } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Save, Eye, Tag, X } from 'lucide-react';

interface CreateEditBlogPageProps {
  blogId?: string;
  onBack: () => void;
  onSave: () => void;
}

const CreateEditBlogPage: React.FC<CreateEditBlogPageProps> = ({ blogId, onBack, onSave }) => {
  const { user } = useAuth();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: [] as string[]
  });

  const isEditing = !!blogId;
  const existingPost = isEditing ? mockBlogPosts.find(p => p.id === blogId) : null;

  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title,
        content: existingPost.content,
        excerpt: existingPost.excerpt,
        tags: [...existingPost.tags]
      });
    }
  }, [existingPost]);

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Auto-generate excerpt if not provided
    if (!formData.excerpt.trim()) {
      const firstParagraph = formData.content.split('\n\n')[0];
      formData.excerpt = firstParagraph.substring(0, 200) + (firstParagraph.length > 200 ? '...' : '');
    }

    console.log('Saving blog post:', {
      ...formData,
      id: isEditing ? blogId : String(Date.now()),
      authorId: user?.id,
      author: user,
      createdAt: isEditing ? existingPost?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: isEditing ? existingPost?.views : 0,
      commentsCount: isEditing ? existingPost?.commentsCount : 0
    });

    setIsSaving(false);
    onSave();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const formatPreviewContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-4">{line.slice(3)}</h2>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        if (line.includes('`') && !line.startsWith('```')) {
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsPreview(!isPreview)}
            variant="outline"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.title.trim() || !formData.content.trim() || isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor */}
        <div className={isPreview ? 'hidden lg:block' : ''}>
          <Card>
            <CardHeader>
              <CardTitle>Write Your Blog</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter your blog title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="text-lg"
                />
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of your blog post (optional - will auto-generate if empty)"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Current Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog content here... 

You can use:
## For headings
`code` for inline code
```
code blocks
```

Just write naturally and it will be formatted!"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={20}
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className={!isPreview ? 'hidden lg:block' : ''}>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.title || formData.content ? (
                <article className="prose prose-lg max-w-none">
                  {/* Title */}
                  {formData.title && (
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {formData.title}
                    </h1>
                  )}

                  {/* Excerpt */}
                  {formData.excerpt && (
                    <p className="text-lg text-gray-600 mb-6 italic">
                      {formData.excerpt}
                    </p>
                  )}

                  {/* Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Content */}
                  {formData.content && (
                    <div className="border-t border-gray-200 pt-6">
                      {formatPreviewContent(formData.content)}
                    </div>
                  )}
                </article>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Start writing to see your preview here...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Preview Toggle */}
      <div className="lg:hidden mt-8">
        <Button
          onClick={() => setIsPreview(!isPreview)}
          variant="outline"
          className="w-full"
        >
          <Eye className="w-4 h-4 mr-2" />
          {isPreview ? 'Back to Editor' : 'Preview Post'}
        </Button>
      </div>
    </div>
  );
};

export default CreateEditBlogPage;
