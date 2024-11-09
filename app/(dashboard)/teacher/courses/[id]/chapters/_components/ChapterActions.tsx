"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Trash } from "lucide-react";
import axios from "axios";

import { Chapter } from "@prisma/client";
import { Button } from "@/components/ui/button";
import AlertModal from "@/app/components/alertModal";
import toast from "react-hot-toast";

interface chapterActionsProps {
  chapter: Chapter;
  courseId: string;
  canPublish: boolean;
}
const ChapterActions = ({
  chapter,
  courseId,
  canPublish,
}: chapterActionsProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const publishChapter = async () => {
    try {
      setLoading(true);

      if (!chapter.isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapter.id}/publish`
        );
        toast.success("Chapter published");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapter.id}/unpublish`
        );
        toast.success("Chapter unpublished");
      }
      router.refresh();
     
    } catch (error) {
      toast.error("Error updating chapter");
    } finally {
      setLoading(false);
    }
  };

  const deleteChapter = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `/api/courses/${courseId}/chapters/${chapter.id}`
      );
      router.push(`/teacher/courses/${courseId}`);
      router.refresh();
      toast.success("Chapter deleted");
    } catch (error) {
      toast.error("Error deleting chapter");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-8 self-center justify-self-start">
      <div className="flex gap-x-2 items-center">
        <Button
          variant={"outline"}
          disabled={canPublish}
          onClick={publishChapter}
          size={"sm"}
        >
          {!chapter.isPublished ? "Publish" : "Unpublish"}
        </Button>
        <AlertModal onDelete={deleteChapter}>
          <Button variant={"default"} size={"sm"} disabled={loading}>
            <Trash className="h-4 w-4" />
          </Button>
        </AlertModal>
      </div>
    </div>
  );
};

export default ChapterActions;
