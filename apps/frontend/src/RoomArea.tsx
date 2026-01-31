import { hashFile } from "./hashFile";
import VideoPlayer from "./VideoPlayer";
import { useTheme } from "./theme-context";
import React, { useState, useEffect, useRef } from "react";

interface VideoControlProps {
    videoUrl: string | null;
    videoFile: File | null;
    videoFileHash: string | null;
    roomCode: number;
    isOwner: boolean;
}

type PageProps = {
    setView: (view: "home" | "login" | "signup" | "room") => void;
};

export default function RoomArea({ setView }: PageProps) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoFileHash, setVideoFileHash] = useState<string | null>(null);
    const { darkMode } = useTheme();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const openedRef = useRef(false);

    useEffect(() => {
        if (!openedRef.current) {
            fileInputRef.current?.click();
            openedRef.current = true;
        }
    }, []);

    const handleVideoFile = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            setVideoFile(null);
            setVideoUrl(null);
            setVideoFileHash(null);
            return;
        }

        // Accept videos even if MIME type is empty (common for MKV)
        const isVideo =
            file.type.startsWith("video/") ||
            /\.(mkv|mp4|webm|ogg)$/i.test(file.name);

        if (!isVideo) {
            console.warn("Selected file is not a supported video:", file.name);
            setVideoFile(null);
            setVideoUrl(null);
            setVideoFileHash(null);
            return;
        }

        const fileHash = await hashFile(file);
        setVideoFile(file);
        setVideoUrl(URL.createObjectURL(file));
        setVideoFileHash(fileHash);
    };
    const handleHeadingClick = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        return () => {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
        };
    }, [videoUrl]);

    const VCP: VideoControlProps = {
        videoUrl: videoUrl,
        videoFile: videoFile,
        videoFileHash: videoFileHash,
        roomCode: 12345,
        isOwner: true,
    };
    return (
        <div>
            <input
                type="file"
                accept="video/*"
                ref={fileInputRef}
                onChange={handleVideoFile}
                className="hidden"
            />
            {videoUrl ? (
                <VideoPlayer
                    videoUrl={VCP.videoUrl}
                    videoFile={VCP.videoFile}
                    videoFileHash={VCP.videoFileHash}
                    roomCode={VCP.roomCode}
                    isOwner={VCP.isOwner}
                />
            ) : (
                <h2
                    onClick={handleHeadingClick}
                    className={`cursor-pointer font-sans text-xl font-bold ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
                >
                    Video is loading...
                </h2>
            )}
        </div>
    );
}
