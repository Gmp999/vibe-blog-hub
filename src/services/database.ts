
import { supabase } from '../integrations/supabase/client';
import { BlogPost, Comment, User } from '../types';

// Profile operations
export const createProfile = async (userData: { id: string; name: string; email: string; bio?: string; avatar_url?: string }) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(userData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Blog post operations
export const getBlogPosts = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:profiles(*),
      comments:comments(count)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return data.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    authorId: post.author_id,
    author: {
      id: post.author.id,
      name: post.author.name,
      email: post.author.email,
      role: post.author.role as 'admin' | 'user',
      bio: post.author.bio || '',
      avatar: post.author.avatar_url,
      createdAt: post.author.created_at
    },
    tags: post.tags || [],
    image: post.image_url,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    views: post.views || 0,
    commentsCount: post.comments?.[0]?.count || 0
  }));
};

export const getBlogPost = async (postId: string) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:profiles(*)
    `)
    .eq('id', postId)
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    authorId: data.author_id,
    author: {
      id: data.author.id,
      name: data.author.name,
      email: data.author.email,
      role: data.author.role as 'admin' | 'user',
      bio: data.author.bio || '',
      avatar: data.author.avatar_url,
      createdAt: data.author.created_at
    },
    tags: data.tags || [],
    image: data.image_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    views: data.views || 0,
    commentsCount: 0
  };
};

export const createBlogPost = async (postData: {
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  tags?: string[];
  image_url?: string;
}) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(postData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateBlogPost = async (postId: string, updates: {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  image_url?: string;
}) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', postId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteBlogPost = async (postId: string) => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', postId);
  
  if (error) throw error;
};

export const incrementPostViews = async (postId: string) => {
  const { error } = await supabase.rpc('increment_post_views', { post_id: postId });
  if (error) console.error('Error incrementing views:', error);
};

// Comment operations
export const getComments = async (postId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles(*)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  return data.map(comment => ({
    id: comment.id,
    postId: comment.post_id,
    authorId: comment.author_id,
    author: {
      id: comment.author.id,
      name: comment.author.name,
      email: comment.author.email,
      role: comment.author.role as 'admin' | 'user',
      bio: comment.author.bio || '',
      avatar: comment.author.avatar_url,
      createdAt: comment.author.created_at
    },
    content: comment.content,
    createdAt: comment.created_at
  }));
};

export const createComment = async (commentData: {
  post_id: string;
  author_id: string;
  content: string;
}) => {
  const { data, error } = await supabase
    .from('comments')
    .insert(commentData)
    .select(`
      *,
      author:profiles(*)
    `)
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    postId: data.post_id,
    authorId: data.author_id,
    author: {
      id: data.author.id,
      name: data.author.name,
      email: data.author.email,
      role: data.author.role as 'admin' | 'user',
      bio: data.author.bio || '',
      avatar: data.author.avatar_url,
      createdAt: data.author.created_at
    },
    content: data.content,
    createdAt: data.created_at
  };
};
