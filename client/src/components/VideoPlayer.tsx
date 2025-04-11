import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Play, Pause, Volume2, VolumeX, X, Maximize, Settings } from 'lucide-react';
import { Movie } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';

interface VideoPlayerProps {
  movie: Movie;
  onClose?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const resetControlsTimer = () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
      
      setShowControls(true);
      
      controlsTimerRef.current = setTimeout(() => {
        if (playing) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    resetControlsTimer();
    
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, [playing]);
  
  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;
    
    const onLoadedData = () => {
      setDuration(video.duration);
      setLoading(false);
      video.play();
    };
    
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Save progress to server every 10 seconds
      if (Math.floor(video.currentTime) % 10 === 0) {
        saveProgress(video.currentTime);
      }
    };
    
    const onEnded = () => {
      setPlaying(false);
      saveProgress(video.duration);
    };
    
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    
    return () => {
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      
      // Save progress on unmount
      if (video.currentTime > 0) {
        saveProgress(video.currentTime);
      }
    };
  }, [movie.id]);
  
  const saveProgress = async (currentTime: number) => {
    try {
      const progressPercentage = Math.floor((currentTime / duration) * 100);
      await apiRequest('POST', '/api/progress', {
        movieId: movie.id,
        progressPercentage,
        lastWatched: Math.floor(currentTime)
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    
    setPlaying(!playing);
  };
  
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !muted;
    setMuted(!muted);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    
    const video = videoRef.current;
    if (video) {
      video.volume = value;
      setMuted(value === 0);
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    
    const video = videoRef.current;
    if (video) {
      video.currentTime = value;
    }
  };
  
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    return [
      h > 0 ? h.toString().padStart(2, '0') : null,
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0')
    ].filter(Boolean).join(':');
  };
  
  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };
  
  const handleBackToHome = () => {
    if (onClose) {
      onClose();
    } else {
      setLocation('/');
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black z-[100]"
      onMouseMove={() => {
        if (controlsTimerRef.current) {
          clearTimeout(controlsTimerRef.current);
        }
        setShowControls(true);
        controlsTimerRef.current = setTimeout(() => {
          if (playing) {
            setShowControls(false);
          }
        }, 3000);
      }}
    >
      <div className="relative w-full h-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin mb-4">
                <svg className="w-12 h-12 text-[#E50914]" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-[#E5E5E5]">Loading video...</p>
            </div>
          </div>
        )}
        
        <video
          ref={videoRef}
          src={movie.videoUrl}
          className="w-full h-full object-contain"
          onClick={togglePlay}
          playsInline
        />
        
        {showControls && (
          <>
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex flex-col">
                <div className="w-full flex items-center mb-3">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#E50914] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      className="text-white hover:text-[#E5E5E5]"
                      onClick={togglePlay}
                    >
                      {playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                    </button>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-white hover:text-[#E5E5E5]"
                        onClick={toggleMute}
                      >
                        {muted ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={muted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full"
                      />
                    </div>
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      className="text-white hover:text-[#E5E5E5]"
                      onClick={handleFullscreen}
                    >
                      <Maximize className="h-7 w-7" />
                    </button>
                    <button className="text-white hover:text-[#E5E5E5]">
                      <Settings className="h-7 w-7" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 text-white hover:text-[#E5E5E5] bg-black bg-opacity-60 rounded-full p-2"
              onClick={handleBackToHome}
            >
              <X className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
