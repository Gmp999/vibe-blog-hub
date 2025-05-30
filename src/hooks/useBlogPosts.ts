
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../services/database';
import { BlogPost } from '../types';

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: getBlogPosts,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, updates }: { postId: string; updates: any }) => 
      updateBlogPost(postId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
};
