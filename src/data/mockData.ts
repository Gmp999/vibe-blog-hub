
import { BlogPost, Comment, Notification, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    bio: 'Platform administrator with years of experience in content management.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    bio: 'Tech enthusiast and blogger passionate about web development.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    bio: 'UI/UX designer who loves sharing design insights.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    content: `React with TypeScript is a powerful combination that brings type safety to your React applications. In this comprehensive guide, we'll explore how to set up a React project with TypeScript and best practices for development.

## Setting Up Your Project

First, you'll want to create a new React project with TypeScript template:

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

## Type Safety Benefits

TypeScript provides excellent IntelliSense support and catches errors at compile time rather than runtime. This leads to more robust applications and better developer experience.

## Component Props

When defining React components, you can specify the types for props:

\`\`\`typescript
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary' }) => {
  return (
    <button className={variant} onClick={onClick}>
      {text}
    </button>
  );
};
\`\`\`

This ensures that components are used correctly throughout your application.`,
    excerpt: 'Learn how to set up and use React with TypeScript for better type safety and developer experience.',
    authorId: '2',
    author: mockUsers[1],
    tags: ['React', 'TypeScript', 'Web Development'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    views: 245,
    commentsCount: 8
  },
  {
    id: '2',
    title: 'Modern CSS Grid Layout Techniques',
    content: `CSS Grid is a powerful layout system that allows you to create complex, responsive layouts with ease. In this article, we'll explore modern CSS Grid techniques that every web developer should know.

## Understanding Grid Containers

A grid container is created by setting \`display: grid\` on an element. This establishes a new grid formatting context for its children.

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
\`\`\`

## Grid Areas

One of the most powerful features of CSS Grid is the ability to define named grid areas:

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

This creates a semantic and maintainable layout structure.`,
    excerpt: 'Discover powerful CSS Grid techniques for creating modern, responsive layouts.',
    authorId: '3',
    author: mockUsers[2],
    tags: ['CSS', 'Web Design', 'Layout'],
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z',
    views: 189,
    commentsCount: 5
  },
  {
    id: '3',
    title: 'Building Scalable APIs with Node.js',
    content: `Creating scalable APIs is crucial for modern web applications. In this guide, we'll explore best practices for building robust, scalable APIs using Node.js and Express.

## Project Structure

A well-organized project structure is the foundation of any scalable application:

\`\`\`
src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
└── utils/
\`\`\`

## Error Handling

Proper error handling is essential for API reliability:

\`\`\`javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    success: false,
    error: message
  });
});
\`\`\`

## Database Optimization

Efficient database queries are crucial for performance:

- Use indexes strategically
- Implement connection pooling
- Consider caching for frequently accessed data
- Use pagination for large datasets`,
    excerpt: 'Learn best practices for building scalable and maintainable APIs with Node.js.',
    authorId: '2',
    author: mockUsers[1],
    tags: ['Node.js', 'API', 'Backend', 'JavaScript'],
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    views: 312,
    commentsCount: 12
  }
];

export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    authorId: '3',
    author: mockUsers[2],
    content: 'Great article! I\'ve been looking for a comprehensive guide on React with TypeScript. The component props section was particularly helpful.',
    createdAt: '2024-01-15T11:30:00Z'
  },
  {
    id: '2',
    postId: '1',
    authorId: '1',
    author: mockUsers[0],
    content: 'Thanks for sharing this. Would love to see a follow-up article on advanced TypeScript patterns in React.',
    createdAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '3',
    postId: '2',
    authorId: '2',
    author: mockUsers[1],
    content: 'CSS Grid has been a game-changer for me. The named grid areas approach is so much cleaner than traditional layout methods.',
    createdAt: '2024-01-14T16:45:00Z'
  },
  {
    id: '4',
    postId: '3',
    authorId: '3',
    author: mockUsers[2],
    content: 'Excellent points on API scalability. The error handling pattern you showed is exactly what I needed for my current project.',
    createdAt: '2024-01-13T10:30:00Z'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '2',
    message: 'Jane Smith commented on your post "Getting Started with React and TypeScript"',
    isRead: false,
    createdAt: '2024-01-15T11:30:00Z',
    type: 'comment'
  },
  {
    id: '2',
    userId: '2',
    message: 'Your post "Building Scalable APIs with Node.js" received a new comment',
    isRead: false,
    createdAt: '2024-01-13T10:30:00Z',
    type: 'comment'
  },
  {
    id: '3',
    userId: '3',
    message: 'Admin User commented on your post "Modern CSS Grid Layout Techniques"',
    isRead: true,
    createdAt: '2024-01-14T16:45:00Z',
    type: 'comment'
  }
];
