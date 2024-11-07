"use client";
import React, { useState } from "react";
import { Course, Chapter } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Loader2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

import ChapterList from "./ChapterList";

import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface CourseChaptersProps {
  course: Course & { chapters: Chapter[] };
}

const courseChaptersSchema = z.object({
  chapterTitle: z
    .string()
    .min(3, { message: "chapter title must be at least 3 characters" }),
});

const CourseChapters = ({ course }: CourseChaptersProps) => {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<z.infer<typeof courseChaptersSchema>>({
    resolver: zodResolver(courseChaptersSchema),
    defaultValues: {
      chapterTitle: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof courseChaptersSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${course.id}/chapters`,
        values
      );
      setIsCreating(false);
      toast.success("Chapter created");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const ReorderChapters = async (list: Chapter[]) => {
    setUpdating(true);
    try {
      const result = await axios.patch(
        `/api/courses/${course.id}/chapters/reorder`,
        list
      );
      toast.success("Chapters reordered");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  const EditChapter = async (id: string) => {
    router.push(`/teacher/courses/${course.id}/chapters/${id}`);
  };

  return (
    <div className="w-full h-full">
      {updating ? (
        <Loader2 className="flex justify-center items-center w-5 h-5 bg-slate-300/70 animate-spin" />
      ) : (
        <div className="w-full flex flex-col gap-y-6 bg-slate-100 px-4 py-6 mt-4 rounded-md">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Course Chapters</h1>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className={cn(
                "text-sm font-semibold text-slate-700 hover:text-red-700 transition-all",
                !isCreating && "text-red-700 hover:text-slate-700"
              )}
            >
              {isCreating ? (
                <span>Cancel</span>
              ) : (
                <span className="flex gap-x-2 items-center justify-center">
                  Add a chapter <PlusCircle className="h-4 w-4" />
                </span>
              )}
            </button>
          </div>
          {isCreating ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="chapterTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="eg: First chapter"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isSubmitting || !isValid}>Create</Button>
              </form>
            </Form>
          ) : course.chapters.length !== 0 ? (
            <>
              <div>
                <ChapterList
                  chapters={course.chapters || []}
                  onReorder={ReorderChapters}
                  onEdit={EditChapter}
                />
              </div>
              <p className="text-slate-600 text-xs text-muted-foreground mt-4">
                Drag and drop to reorder chapters
              </p>
            </>
          ) : (
            <p className="text-slate-500 italic text-muted-foreground">
              No Chapters
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseChapters;
