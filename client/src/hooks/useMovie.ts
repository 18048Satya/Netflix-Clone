import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Movie } from '@/lib/types';

export const useMovie = (movieId: number | null) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const addToMyList = async () => {
    if (!movieId) return;
    
    setLoading(true);
    try {
      await apiRequest('POST', '/api/my-list', { movieId });
      queryClient.invalidateQueries({ queryKey: ['/api/my-list'] });
    } catch (error) {
      console.error('Failed to add to my list:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const removeFromMyList = async () => {
    if (!movieId) return;
    
    setLoading(true);
    try {
      await apiRequest('DELETE', `/api/my-list/${movieId}`);
      queryClient.invalidateQueries({ queryKey: ['/api/my-list'] });
    } catch (error) {
      console.error('Failed to remove from my list:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const saveProgress = async (progressPercentage: number, lastWatched: number) => {
    if (!movieId) return;
    
    try {
      await apiRequest('POST', '/api/progress', {
        movieId,
        progressPercentage,
        lastWatched,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };
  
  return {
    loading,
    addToMyList,
    removeFromMyList,
    saveProgress,
  };
};
