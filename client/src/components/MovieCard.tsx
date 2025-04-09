import { useState } from 'react';
import { useLocation } from 'wouter';
import { Play, Plus, ThumbsUp } from 'lucide-react';
import { Movie } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface MovieCardProps {
  movie: Movie;
  showProgress?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, showProgress }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocation(`/watch/${movie.id}`);
  };

  const handleAddToList = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiRequest('POST', '/api/my-list', { movieId: movie.id });
      queryClient.invalidateQueries({ queryKey: ['/api/my-list'] });
    } catch (error) {
      console.error('Failed to add to my list:', error);
    }
  };

  const handleCardClick = () => {
    setLocation(`/movie/${movie.id}`);
  };

  return (
    <div 
      className="movie-card w-[160px] md:w-[200px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <img 
        src={movie.thumbnailUrl} 
        alt={movie.title} 
        className="rounded-sm w-full h-[120px] md:h-[150px] object-cover"
      />
      
      {showProgress && movie.progress && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600">
          <div 
            className="h-full bg-[#E50914]" 
            style={{ width: `${movie.progress.progressPercentage}%` }}
          ></div>
        </div>
      )}
      
      <div className={`absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-end p-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center mb-1">
          <button 
            className="text-white bg-[#E50914] rounded-full p-1 mr-1"
            onClick={handlePlay}
          >
            <Play className="h-4 w-4" />
          </button>
          <button 
            className="text-white border border-white rounded-full p-1 mr-1"
            onClick={handleAddToList}
          >
            <Plus className="h-4 w-4" />
          </button>
          <button className="text-white border border-white rounded-full p-1">
            <ThumbsUp className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-white">{movie.title}</p>
      </div>
    </div>
  );
};

export default MovieCard;
