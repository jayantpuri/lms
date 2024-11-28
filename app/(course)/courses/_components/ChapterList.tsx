"use client";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

import { Lock, PlayCircle, CheckCircle2 } from "lucide-react";
interface chapterListProps {
  title: string;
  isFree: boolean | null;
  isCompleted: boolean;
  chapterId: string;
  courseId: string;
}
const ChapterList = ({
  title,
  isFree,
  isCompleted,
  chapterId,
  courseId,
}: chapterListProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const isSelected = pathName.includes(chapterId);
  const Icon = !isFree ? Lock : isCompleted ? CheckCircle2 : PlayCircle;

  return (
    <button
      onClick={() => router.push(`/courses/${courseId}/chapters/${chapterId}`)}
      className={cn("flex", isSelected && "bg-slate-100", isCompleted && isSelected && "bg-emerald-100/50")}
    >
      <div
        className={cn(
          "flex items-center justify-start gap-x-2 p-4 text-slate-500 hover:text-slate-800/50 transition-all",
          isSelected && "text-slate-900  hover:text-slate-700 transition-all",
          isCompleted && "text-emerald-700 hover:text-emerald-800 transition-all"
        )}
      >
        <span>
          <Icon className="h-5 w-5" />
        </span>
        <div className="">{title}</div>
      </div>
      <div
        className={cn(
          "ml-auto h-full w-1 bg-slate-700 transition-all opacity-0",
          isSelected && "opacity-100",
          isCompleted && "bg-emerald-700"
        )}
      ></div>
    </button>
  );
};

export default ChapterList;
