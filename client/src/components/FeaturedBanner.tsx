import { useState } from 'react';
import { useLocation } from 'wouter';
import { Info, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from '@/lib/types';

interface FeaturedBannerProps {
  movie: Movie;
}

const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ movie }) => {
  const [, setLocation] = useLocation();

  const handlePlay = () => {
    setLocation(`/watch/${movie.id}`);
  };

  const handleMoreInfo = () => {
    setLocation(`/movie/${movie.id}`);
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${movie.bannerUrl})` }}
      >
        <div className="absolute inset-0 netflix-gradient"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
      </div>
      <div className="relative h-full flex flex-col justify-end p-4 md:p-16 pb-10 md:pb-32 max-w-2xl">
        <div className="mb-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
          <p className="text-lg md:text-xl text-[#E5E5E5] mb-4">
            {movie.description}
          </p>
          <div className="flex space-x-3">
            <Button 
              onClick={handlePlay}
              className="flex items-center bg-white text-black py-2 px-6 rounded font-medium hover:bg-opacity-80"
            >
              <Play className="h-5 w-5 mr-2" />
              Play
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleMoreInfo}
              className="flex items-center bg-gray-600 bg-opacity-70 text-white py-2 px-6 rounded font-medium hover:bg-opacity-50"
            >
              <Info className="h-5 w-5 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBanner;
