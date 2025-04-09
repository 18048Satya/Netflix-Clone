import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import MovieDetailModal from '@/components/MovieDetailModal';
import { Skeleton } from '@/components/ui/skeleton';

const MovieDetail = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/movie/:id');
  const movieId = params?.id ? parseInt(params.id) : null;
  
  const { data: movie, isLoading: movieLoading } = useQuery({
    queryKey: [`/api/movies/${movieId}`],
    enabled: !!movieId,
  });
  
  const { data: similarMovies, isLoading: similarLoading } = useQuery({
    queryKey: [`/api/movies/${movieId}/similar`],
    enabled: !!movieId,
  });
  
  const handleClose = () => {
    setLocation('/');
  };
  
  if (movieLoading || !movie) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50">
        <div className="relative mx-auto mt-16 max-w-4xl bg-[#181818] rounded overflow-hidden">
          <Skeleton className="w-full h-[50vh]" />
          <div className="p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />
            
            <Skeleton className="h-6 w-48 mb-3" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="aspect-video" />
              <Skeleton className="aspect-video" />
              <Skeleton className="aspect-video" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <MovieDetailModal 
      movie={movie}
      similarMovies={similarMovies || []}
      onClose={handleClose}
    />
  );
};

export default MovieDetail;
