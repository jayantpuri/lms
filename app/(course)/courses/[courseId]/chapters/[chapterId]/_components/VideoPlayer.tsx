"use client";
import React, { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Lock, Loader2 } from "lucide-react";

interface VideoPlayerProps {
  playbackId: string;
  canAccess: boolean;
  title: string;
}
const VideoPlayer = ({ playbackId, canAccess, title }: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  return (
    <div className="w-full h-full ">
      {!isReady && (
        <div className="bg-slate-800 flex flex-col gap-y-2 items-center justify-center inset-0 absolute">
          <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
        </div>
      )}
      {canAccess ? (
        <MuxPlayer
          className="w-full h-full"
          title={title}
          playbackId={playbackId!}
          onCanPlay={() => setIsReady(true)}
          onEnded={() => {}}
          autoPlay
        />
      ) : (
        <div className="bg-slate-800 flex flex-col gap-y-2 items-center justify-center inset-0 absolute">
          <Lock className="h-7 w-7 text-slate-400" />
          <span className="text-slate-400">This chapter is locked</span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
