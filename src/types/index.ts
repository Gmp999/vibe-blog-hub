
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  author: User;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  commentsCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: 'comment' | 'like' | 'mention' | 'system';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
