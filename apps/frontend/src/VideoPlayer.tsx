import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "./theme-context";
import {
    FiPause,
    FiPlay,
    FiVolume2,
    FiVolumeX,
    FiSkipBack,
    FiSkipForward,
} from "react-icons/fi";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

interface VideoControlProps {
    videoUrl: string | null;
    videoFile: File | null;
    videoFileHash: string | null;
    roomCode: number;
    isOwner: boolean;
}

function formatTime(seconds = 0) {
    if (!isFinite(seconds) || seconds < 0) return "00:00";

    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
    const m = Math.floor((seconds / 60) % 60)
        .toString()
        .padStart(2, "0");
    const h = Math.floor(seconds / 3600);

    if (h > 0) {
        return `${h}:${m.padStart(2, "0")}:${s}`;
    }
    return `${m}:${s}`;
}

function VideoPlayer(props: VideoControlProps) {
    const { videoUrl, videoFile, videoFileHash, roomCode, isOwner } = props;
    const { darkMode } = useTheme();
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekTime, setSeekTime] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [controlsTimeout, setControlsTimeout] = useState(null);

    // Toggle play/pause
    const togglePlayPause = useCallback(async () => {
        const video = videoRef.current;
        if (!video) return;

        try {
            if (video.paused) {
                await video.play();
                setIsPlaying(true);
            } else {
                video.pause();
                setIsPlaying(false);
            }
        } catch (error) {
            console.error("Error toggling play/pause:", error);
        }
    }, []);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(async () => {
        const container = containerRef.current;
        if (!container) return;

        try {
            if (!document.fullscreenElement) {
                await container.requestFullscreen();
                setIsFullScreen(true);
            } else {
                await document.exitFullscreen();
                setIsFullScreen(false);
            }
        } catch (error) {
            console.error("Error toggling fullscreen:", error);
        }
    }, []);

    // Toggle mute
    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.muted) {
            video.muted = false;
            setIsMuted(false);
            video.volume = volume;
        } else {
            video.muted = true;
            setIsMuted(true);
        }
    }, [volume]);

    // Handle volume change
    const handleVolumeChange = useCallback((value) => {
        const video = videoRef.current;
        if (!video) return;

        const newVolume = Math.max(0, Math.min(1, value));
        setVolume(newVolume);
        video.volume = newVolume;
        setIsMuted(newVolume === 0);
    }, []);

    // Handle seek
    const handleSeekStart = useCallback((value) => {
        setIsSeeking(true);
        setSeekTime(value);
    }, []);

    const handleSeekEnd = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        video.currentTime = seekTime;
        setCurrentTime(seekTime);
        setIsSeeking(false);
    }, [seekTime]);

    const handleSeekChange = useCallback((value) => {
        setSeekTime(value);
    }, []);

    // Skip forward/backward
    const skipForward = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        video.currentTime = Math.min(video.currentTime + 10, duration);
    }, [duration]);

    const skipBackward = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        video.currentTime = Math.max(video.currentTime - 10, 0);
    }, []);

    // Auto-hide controls
    const resetControlsTimer = useCallback(() => {
        setShowControls(true);

        if (controlsTimeout) {
            clearTimeout(controlsTimeout);
        }

        if (isPlaying) {
            const timeout = setTimeout(() => {
                setShowControls(false);
            }, 3000);
            setControlsTimeout(timeout);
        }
    }, [isPlaying, controlsTimeout]);

    // Video event listeners
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            setDuration(video.duration || 0);
            setCurrentTime(video.currentTime || 0);
        };

        const handleTimeUpdate = () => {
            if (!isSeeking) {
                setCurrentTime(video.currentTime);
            }
        };

        const handleVolumeChangeEvent = () => {
            setVolume(video.volume);
            setIsMuted(video.muted);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);

        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("volumechange", handleVolumeChangeEvent);
        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);
        video.addEventListener("ended", handleEnded);

        // Set initial volume
        video.volume = volume;

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("volumechange", handleVolumeChangeEvent);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
            video.removeEventListener("ended", handleEnded);
        };
    }, [isSeeking, volume]);

    // Fullscreen change listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
        };
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!videoRef.current) return;

            switch (e.key) {
                case " ":
                case "Spacebar":
                    if (!isOwner) break;
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case "ArrowLeft":
                    if (!isOwner) break;
                    e.preventDefault();
                    skipBackward();
                    break;
                case "ArrowRight":
                    if (!isOwner) break;
                    e.preventDefault();
                    skipForward();
                    break;
                case "f":
                case "F":
                    if (e.ctrlKey || e.metaKey) return;
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case "m":
                case "M":
                    e.preventDefault();
                    toggleMute();
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [
        isOwner,
        togglePlayPause,
        skipBackward,
        skipForward,
        toggleFullscreen,
        toggleMute,
    ]);

    // Disable mouse events for none room owner
    useEffect(() => {
        if (isOwner) return;
        const video = videoRef.current;
        if (!video) return;

        const blockClick = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
        };

        video.addEventListener("click", blockClick);
        return () => video.removeEventListener("click", blockClick);
    }, [isOwner]);

    // Progress bar calculation
    const progress =
        duration > 0
            ? ((isSeeking ? seekTime : currentTime) / duration) * 100
            : 0;

    // Sample video URL - replace with your own
    // For testing, you can use a sample video URL or import from public folder

    return (
        <div
            ref={containerRef}
            className={`relative flex flex-col items-center justify-center ${isFullScreen ? "bg-black w-full h-full" : "bg-transparent"}`}
            onMouseMove={resetControlsTimer}
            onTouchStart={resetControlsTimer}
        >
            {/* Video Container */}
            <div
                className={`${isFullScreen ? "w-full h-full rounded-none" : "w-8/10 rounded-xl"} relative overflow-hidden shadow-2xl bg-black`}
            >
                <video
                    ref={videoRef}
                    src={videoUrl}
                    typeof={videoFile?.type}
                    className={`object-contain block mx-auto ${isFullScreen ? "w-full h-full" : "max-w-full max-h-[80vh]"}`}
                    onClick={togglePlayPause}
                    onDoubleClick={toggleFullscreen}
                />

                {/* Controls Overlay */}
                <div
                    className={`${isOwner ? "visible" : "invisible"} absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-all duration-300 ${showControls
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10 pointer-events-none"
                        }`}
                >
                    {/* Progress Bar */}
                    <div className="mb-4 px-2">
                        <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                                className="absolute h-full bg-blue-500 transition-all duration-150"
                                style={{ width: `${progress}%` }}
                            />
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                step="0.1"
                                value={isSeeking ? seekTime : currentTime}
                                onChange={(e) =>
                                    handleSeekChange(parseFloat(e.target.value))
                                }
                                onMouseDown={(e) =>
                                    handleSeekStart(parseFloat(e.target.value))
                                }
                                onTouchStart={(e) =>
                                    handleSeekStart(parseFloat(e.target.value))
                                }
                                onMouseUp={handleSeekEnd}
                                onTouchEnd={handleSeekEnd}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                        </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center space-x-1">
                            {/* Play/Pause */}
                            <button
                                onClick={togglePlayPause}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? (
                                    <FiPause className="w-6 h-6 text-white" />
                                ) : (
                                    <FiPlay className="w-6 h-6 text-white" />
                                )}
                            </button>

                            {/* Skip Backward */}
                            <button
                                onClick={skipBackward}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Skip backward 10 seconds"
                            >
                                <FiSkipBack className="w-5 h-5 text-white" />
                            </button>

                            {/* Skip Forward */}
                            <button
                                onClick={skipForward}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Skip forward 10 seconds"
                            >
                                <FiSkipForward className="w-5 h-5 text-white" />
                            </button>

                            {/* Volume Control */}
                            <div className="group/vol flex items-center">
                                <button
                                    onClick={toggleMute}
                                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                    aria-label={isMuted ? "Unmute" : "Mute"}
                                >
                                    {isMuted || volume === 0 ? (
                                        <FiVolumeX className="w-5 h-5 text-white" />
                                    ) : (
                                        <FiVolume2 className="w-5 h-5 text-white" />
                                    )}
                                </button>

                                <div className="ml-1 w-0 scale-x-0 origin-left opacity-0 group-hover/vol:w-24 group-hover/vol:scale-x-100 group-hover/vol:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={(e) =>
                                            handleVolumeChange(
                                                parseFloat(e.target.value),
                                            )
                                        }
                                        className="w-full h-1.5 bg-gray-600 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Time Display */}
                            <div className="text-white text-xs font-mono ml-2">
                                <span>
                                    {formatTime(
                                        isSeeking ? seekTime : currentTime,
                                    )}
                                </span>
                                <span className="mx-1">/</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Fullscreen Button */}
                        <button
                            onClick={toggleFullscreen}
                            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                            aria-label={
                                isFullScreen
                                    ? "Exit fullscreen"
                                    : "Enter fullscreen"
                            }
                        >
                            {isFullScreen ? (
                                <MdFullscreenExit className="w-6 h-6 text-white" />
                            ) : (
                                <MdFullscreen className="w-6 h-6 text-white" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;
