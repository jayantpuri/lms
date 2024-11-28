"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
interface CompleteButtonProps {
  isCompleted: boolean;
  courseId: string;
  chapterId: string;
}
const CompleteButton = ({
  isCompleted,
  courseId,
  chapterId,
}: CompleteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const Icon = isCompleted ? XCircle : CheckCircle;
  const buttonText = isCompleted ? "Mark as incomplete" : "Mark as complete";

  const updateChapterProgress = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/complete`,
        { isCompleted: !isCompleted }
      );
      if (isCompleted) {
        toast.success("Chapter marked as incomplete");
      } else {
        toast.success("Chapter marked as complete");
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      onClick={() => updateChapterProgress()}
      disabled={isLoading}
      className={cn(
        isCompleted
          ? "bg-yellow-300 text-black hover:bg-yellow-300/80"
          : "bg-emerald-500 text-white hover:bg-emerald-500/80"
      )}
    >
      {buttonText}
      <Icon className="h-4 w-4" />
    </Button>
  );
};

export default CompleteButton;
