import { useState } from 'react';
import { useLocation } from 'wouter';
import { X, Play, Plus, ThumbsUp } from 'lucide-react';
import { Movie } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface MovieDetailModalProps {
  movie: Movie;
  similarMovies: Movie[];
  onClose: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, similarMovies, onClose }) => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const handlePlay = () => {
    setLocation(`/watch/${movie.id}`);
  };

  const handleAddToList = async () => {
    try {
      await apiRequest('POST', '/api/my-list', { movieId: movie.id });
      queryClient.invalidateQueries({ queryKey: ['/api/my-list'] });
    } catch (error) {
      console.error('Failed to add to my list:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto" onClick={onClose}>
      <div className="relative mx-auto mt-16 max-w-4xl bg-[#181818] rounded overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Movie Banner */}
        <div className="relative h-[50vh]">
          <img 
            src={movie.bannerUrl || movie.thumbnailUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>
          
          {/* Movie Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-col">
              <h1 className="text-white text-2xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              <div className="flex space-x-3 mb-4">
                <button 
                  className="flex items-center bg-white text-black py-2 px-6 rounded font-medium hover:bg-opacity-80"
                  onClick={handlePlay}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Play
                </button>
                <button 
                  className="flex items-center text-white border border-white py-2 px-4 rounded font-medium hover:bg-white hover:bg-opacity-10"
                  onClick={handleAddToList}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  My List
                </button>
                <button className="flex items-center text-white border border-white p-2 rounded-full font-medium hover:bg-white hover:bg-opacity-10">
                  <ThumbsUp className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 text-white hover:text-[#E5E5E5] bg-black bg-opacity-50 rounded-full p-1"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Movie Details */}
        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            {movie.matchPercentage && (
              <div className="text-green-500 font-bold">{movie.matchPercentage}% Match</div>
            )}
            <div className="text-[#E5E5E5]">{movie.year}</div>
            {movie.rating && (
              <div className="text-[#E5E5E5] border border-[#E5E5E5] px-1 text-xs flex items-center">{movie.rating}</div>
            )}
            <div className="text-[#E5E5E5]">{movie.duration} min</div>
          </div>
          
          <p className="text-[#E5E5E5] mb-4">
            {movie.description}
          </p>
          
          <div className="mb-6">
            {movie.cast && movie.cast.length > 0 && (
              <div className="text-gray-400 mb-1">Cast: <span className="text-[#E5E5E5]">{movie.cast.join(', ')}</span></div>
            )}
            {movie.categories && movie.categories.length > 0 && (
              <div className="text-gray-400 mb-1">Genres: <span className="text-[#E5E5E5]">{movie.categories.join(', ')}</span></div>
            )}
            {movie.director && (
              <div className="text-gray-400">Director: <span className="text-[#E5E5E5]">{movie.director}</span></div>
            )}
          </div>
          
          {/* Similar Movies */}
          {similarMovies && similarMovies.length > 0 && (
            <div>
              <h3 className="text-white text-lg font-bold mb-2">More Like This</h3>
              <div className="grid grid-cols-3 gap-2">
                {similarMovies.slice(0, 3).map((similarMovie) => (
                  <div 
                    key={similarMovie.id}
                    className="aspect-video bg-[#141414] rounded overflow-hidden cursor-pointer"
                    onClick={() => {
                      setLocation(`/movie/${similarMovie.id}`);
                    }}
                  >
                    <img 
                      src={similarMovie.thumbnailUrl} 
                      alt={similarMovie.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
