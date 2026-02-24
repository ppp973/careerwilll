import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Settings
} from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  volume: number;
  playbackSpeed: number;
  isFullscreen: boolean;
  onTogglePlay: () => void;
  onSeek: (value: number) => void;
  onVolumeChange: (value: number) => void;
  onToggleFullscreen: () => void;
  onSetSpeed: (speed: number) => void;
  onNext: () => void;
  onPrev: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s]
    .map(v => v < 10 ? "0" + v : v)
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};

export default function PlayerControls({
  isPlaying,
  progress,
  duration,
  currentTime,
  volume,
  playbackSpeed,
  isFullscreen,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleFullscreen,
  onSetSpeed,
  onNext,
  onPrev,
  hasPrev,
  hasNext
}: PlayerControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-end p-4 md:p-8 pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto pointer-events-auto">
        {/* Seek Bar */}
        <div className="group relative w-full h-1.5 bg-zinc-600/50 rounded-full mb-6 cursor-pointer">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute top-0 left-0 h-full bg-accent rounded-full shadow-[0_0_15px_rgba(0,210,84,0.6)]"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%`, marginLeft: '-8px' }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            {/* Playback Controls */}
            <div className="flex items-center gap-4">
              <button 
                onClick={onPrev}
                disabled={!hasPrev}
                className={`p-2 transition-colors ${hasPrev ? 'hover:text-accent' : 'opacity-30 cursor-not-allowed'}`}
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>
              
              <button 
                onClick={onTogglePlay}
                className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>
              
              <button 
                onClick={onNext}
                disabled={!hasNext}
                className={`p-2 transition-colors ${hasNext ? 'hover:text-accent' : 'opacity-30 cursor-not-allowed'}`}
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Time Display */}
            <div className="text-sm font-medium hidden sm:block">
              <span className="text-white">{formatTime(currentTime)}</span>
              <span className="text-zinc-500 mx-2">/</span>
              <span className="text-zinc-500">{formatTime(duration)}</span>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button 
                onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                {volume === 0 ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-white" />}
              </button>
              <div className="w-0 group-hover/volume:w-20 transition-all duration-300 overflow-hidden">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-accent"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Playback Speed Settings */}
            <div className="relative group/speed">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-tighter text-white/60">{playbackSpeed}x</span>
                <Settings className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-full right-0 mb-4 bg-[#0f1014]/95 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-2 opacity-0 group-hover/speed:opacity-100 pointer-events-none group-hover/speed:pointer-events-auto transition-all translate-y-2 group-hover/speed:translate-y-0 shadow-2xl min-w-[120px] z-50">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Speed</p>
                </div>
                {[0.5, 1, 1.25, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => onSetSpeed(speed)}
                    className={`block w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${playbackSpeed === speed ? 'text-accent bg-accent/10' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Fullscreen */}
            <button 
              onClick={onToggleFullscreen}
              className="p-2 hover:text-accent transition-colors"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
