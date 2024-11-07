"use client";
import React, { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Chapter } from "@prisma/client";
import { useRouter } from "next/navigation";

import { CirclePlus, Pencil, VideoIcon } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { z } from "zod";
import axios from "axios";

import { FileUpload } from "@/app/components/file-upload";

interface ChapterImageProps {
  chapter: Chapter;
  courseId: string;
}

const ChapterImageSchema = z.object({
  videoUrl: z.string().min(0, { message: "Video is required" }),
});

const ChapterVideo = ({ chapter, courseId }: ChapterImageProps) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const onSubmit = async (values: z.infer<typeof ChapterImageSchema>) => {
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapter.id}`,
        values
      );
      setEditing(false);
      toast.success("Chapter video updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-4 bg-slate-100 px-4 pt-6 pb-2 mt-4 rounded-md">
      <div className="flex justify-between items-center ">
        <h1 className="text-xl font-semibold">Chapter Video</h1>
        <button
          onClick={() => setEditing(!editing)}
          className={cn(
            "text-sm font-semibold text-slate-700 hover:text-red-700 transition-all",
            !editing && "text-red-700 hover:text-slate-700"
          )}
        >
          {editing ? (
            <span>Cancel</span>
          ) : chapter.videoUrl ? (
            <span className="flex gap-x-2 items-center justify-center">
              Edit Video <Pencil className="h-4 w-4" />
            </span>
          ) : (
            <span className="flex gap-x-2 items-center justify-center">
              Add Video <CirclePlus className="h-4 w-4" />
            </span>
          )}
        </button>
      </div>
      {editing ? (
        <>
          <FileUpload
            endpoint={"chapterVideo"}
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-4">
            16:9 apsect ratio is recommended
          </p>
        </>
      ) : !chapter.videoUrl ? (
        <div className="flex justify-center items-center h-60 bg-slate-200 rounded-md">
          <VideoIcon className="h-10 w-10 text-slate-500" />
        </div>
      ) : (
        <div className="relative aspect-video mt-2 flex flex-col gap-y-4">
          <MuxPlayer src={chapter.videoUrl} playbackId={""} />
          <p className="text-slate-500 text-xs">
            Videos can take a few minutes to process. Refresh the page if the
            video does not appear.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChapterVideo;
