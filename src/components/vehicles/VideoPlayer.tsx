"use client";

import { useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/**
 * Native video with controls of our own. The progress bar reflects the real
 * playhead and seeks, rather than showing a decorative fixed width.
 */
export function VideoPlayer({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    video.currentTime = ((event.clientX - rect.left) / rect.width) * duration;
  };

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-ink-950 text-center p-6">
        <p className="text-xs text-white/70">
          This walkthrough video could not be loaded. No video has been supplied for this listing.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-ink-950 overflow-hidden group">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onError={() => setHasError(true)}
        playsInline
      />

      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play the walkthrough"
          className="absolute inset-0 flex items-center justify-center bg-ink-950/40"
        >
          <span className="w-16 h-16 rounded-full bg-brand text-white flex items-center justify-center">
            <Icon icon={Play} size={26} />
          </span>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink-950 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
          <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="text-white hover:text-brand transition-colors">
            <Icon icon={isPlaying ? Pause : Play} size={18} />
          </button>
          <button type="button" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} className="text-white hover:text-brand transition-colors">
            <Icon icon={isMuted ? VolumeX : Volume2} size={18} />
          </button>
          <div
            className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer"
            onClick={seek}
            role="presentation"
          >
            <div
              className="h-full bg-brand rounded-full"
              style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
            />
          </div>
          <button
            type="button"
            onClick={() => videoRef.current?.requestFullscreen?.()}
            aria-label="Full screen"
            className="text-white hover:text-brand transition-colors"
          >
            <Icon icon={Maximize2} size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
