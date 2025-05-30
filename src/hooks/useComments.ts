
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment } from '../services/database';

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.postId] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
};
