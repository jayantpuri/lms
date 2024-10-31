"use client";
import React, { useState } from "react";
import { Course, Attachment } from "@prisma/client";
import { useRouter } from "next/navigation";

import { CirclePlus, File, XIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { z } from "zod";
import axios from "axios";

import { FileUpload } from "@/app/components/file-upload";

interface CourseAttachemntsProps {
  course: Course & { attachments: Attachment[] };
}

const courseAttachemntsSchema = z.object({
  url: z.string().min(0, { message: "Attachemnts is required" }),
});

const CourseAttachemnts = ({ course }: CourseAttachemntsProps) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const onSubmit = async (values: z.infer<typeof courseAttachemntsSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${course.id}/attachments`,
        values
      );
      router.refresh();
      setEditing(false);
      toast.success("Course Attachemnts updated");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteAttachment = async (id: string) => {
    setDeleteId(id);
    try {
      const response = await axios.delete(
        `/api/courses/${course.id}/attachments/${id}`
      );
      router.refresh();
      setEditing(false);
      toast.success("Attachment removed");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-6 bg-slate-100 px-4 py-6 mt-4 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Course Attachemnts</h1>
        <button
          onClick={() => setEditing(!editing)}
          className={cn(
            "text-sm font-semibold text-slate-700 hover:text-red-700 transition-all",
            !editing && "text-red-700 hover:text-slate-700"
          )}
        >
          {editing ? (
            <span>Cancel</span>
          ) : (
            <span className="flex gap-x-2 items-center justify-center">
              Add a file <CirclePlus className="h-4 w-4" />
            </span>
          )}
        </button>
      </div>
      {editing ? (
        <>
          <FileUpload
            endpoint={"courseAttachment"}
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-4">
            Upload files that would supplement your course.
          </p>
        </>
      ) : course.attachments.length !== 0 ? (
        <div className="flex flex-col gap-y-2">
          {course.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between text-sky-800 rounded-md bg-sky-100 border-sky-200 border-2 hover:bg-sky-100 transition-all p-3"
            >
              <File className="h-4 w-4 shrink-0" />
              <span className="text-xs line-clamp-1 ">{attachment.name}</span>
              {deleteId === attachment.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XIcon
                  className="h-4 w-4 cursor-pointer shrink-0 hover:text-red-700 transition-all"
                  onClick={() => deleteAttachment(attachment.id)}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 italic">No attachemnts yet.</p>
      )}
    </div>
  );
};

export default CourseAttachemnts;
