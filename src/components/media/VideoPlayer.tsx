import React, { useRef, useState } from 'react';
import { Play, Pause, AlertCircle, Film } from 'lucide-react';

interface VideoPlayerProps {
  id?: string;
  source?: string;
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  title?: string;
  onStart?: () => void;
  onEnded?: () => void;
  onError?: (error: unknown) => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  id = 'funnel-video-player',
  source,
  poster,
  autoplay = false,
  muted = true,
  controls = true,
  loop = false,
  title = 'Registro Audiovisual',
  onStart,
  onEnded,
  onError,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          if (!hasStarted) {
            setHasStarted(true);
            onStart?.();
          }
        })
        .catch((err) => {
          console.warn('[VideoPlayer] Playback blocked or failed:', err);
          onError?.(err);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // If no source is provided (placeholder mode for Foundation phase)
  if (!source) {
    return (
      <div
        id={id}
        className={`relative w-full aspect-video rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center p-6 space-y-3 overflow-hidden ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
          <Film className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="font-mono text-xs text-sky-400 uppercase tracking-widest">
            {title}
          </p>
          <p className="text-xs text-slate-500 font-mono">
            [Módulo de video &bull; Placeholder de Foundation]
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      className={`relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden group ${className}`}
    >
      <video
        ref={videoRef}
        src={source}
        poster={poster}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        playsInline
        onPlay={() => {
          setIsPlaying(true);
          if (!hasStarted) {
            setHasStarted(true);
            onStart?.();
          }
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
        onError={(e) => {
          setHasError(true);
          onError?.(e);
        }}
        className="w-full h-full object-cover"
      />

      {hasError ? (
        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center space-y-2 text-rose-400">
          <AlertCircle className="w-6 h-6" />
          <p className="text-xs font-mono">Error al cargar señal de video</p>
        </div>
      ) : (
        controls && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        )
      )}
    </div>
  );
};
