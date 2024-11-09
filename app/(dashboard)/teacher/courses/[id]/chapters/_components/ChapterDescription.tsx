"use client";
import React, { useState } from "react";
import { Chapter } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Pencil } from "lucide-react";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import TextEditor from "@/app/components/TextEditor";
import TextPreview from "@/app/components/TextPreview";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface ChapterDescriptionProps {
  chapter: Chapter;
  courseId: string;
}

const ChapterDescriptionSchema = z.object({
  description: z
    .string()
    .min(30, { message: "Chapter description must be at least 30 characters" }),
});

const ChapterDescription = ({ chapter, courseId }: ChapterDescriptionProps) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const form = useForm<z.infer<typeof ChapterDescriptionSchema>>({
    resolver: zodResolver(ChapterDescriptionSchema),
    defaultValues: {
      description: chapter?.description || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof ChapterDescriptionSchema>) => {
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapter.id}`,
        values
      );
      setEditing(false);
      toast.success("Chapter description updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-6 bg-slate-100 px-4 py-6 mt-4 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Chapter Description</h1>
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
              Edit Description <Pencil className="h-4 w-4" />
            </span>
          )}
        </button>
      </div>
      {editing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full h-50">
                  <FormControl>
                    <TextEditor value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting || !isValid}>Save</Button>
          </form>
        </Form>
      ) : !chapter.description ? (
        <p className="text-slate-500 italic text-muted-foreground">
          Add a description
        </p>
      ) : (
        <div>
          <TextPreview value={chapter.description} />
        </div>
      )}
    </div>
  );
};

export default ChapterDescription;
