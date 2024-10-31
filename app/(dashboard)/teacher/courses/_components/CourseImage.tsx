"use client";
import React, { useState } from "react";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { CirclePlus, Pencil, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { z } from "zod";
import axios from "axios";

import { FileUpload } from "@/app/components/file-upload";


interface CourseImageProps {
  course: Course;
}

const courseImageSchema = z.object({
  imageUrl: z.string().min(0, { message: "Image is required" }),
});

const CourseImage = ({ course }: CourseImageProps) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const onSubmit = async (values: z.infer<typeof courseImageSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${course.id}`, values);
      setEditing(false);
      toast.success("Course Image updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-6 bg-slate-100 px-4 py-6 mt-4 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Course Image</h1>
        <button
          onClick={() => setEditing(!editing)}
          className={cn(
            "text-sm font-semibold text-slate-700 hover:text-red-700 transition-all",
            !editing && "text-red-700 hover:text-slate-700"
          )}
        >
          {editing ? (
            <span>Cancel</span>
          ) : course.imageUrl ? (
            <span className="flex gap-x-2 items-center justify-center">
              Change Image <Pencil className="h-4 w-4" />
            </span>
          ) : (
            <span className="flex gap-x-2 items-center justify-center">
              Add Image <CirclePlus className="h-4 w-4" />
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
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-4">
            16:9 apsect ratio is recommended
          </p>
        </>
      ) : !course.imageUrl ? (
        <div className="flex justify-center items-center h-60 bg-slate-200 rounded-md">
          <ImageIcon className="h-10 w-10 text-slate-500" />
        </div>
      ) : (
        <div className="relative aspect-video mt-2">
          <Image
            alt="Upload"
            src={course.imageUrl}
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default CourseImage;
