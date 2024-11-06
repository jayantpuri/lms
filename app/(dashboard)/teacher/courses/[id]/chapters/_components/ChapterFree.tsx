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
import { Checkbox } from "@/components/ui/checkbox";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

interface ChapterFreeProps {
  chapter: Chapter;
  courseId: string;
}

const ChapterFreeSchema = z.object({
  isFree: z.boolean().default(false),
});

const ChapterFree = ({ chapter, courseId }: ChapterFreeProps) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const form = useForm<z.infer<typeof ChapterFreeSchema>>({
    resolver: zodResolver(ChapterFreeSchema),
    defaultValues: {
      isFree: chapter?.isFree || false,
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof ChapterFreeSchema>) => {
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapter.id}`,
        values
      );
      setEditing(false);
      toast.success("Chapter updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-6 bg-slate-100 px-4 py-6 mt-4 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Chapter Access Settings</h1>
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
              Edit access <Pencil className="h-4 w-4" />
            </span>
          )}
        </button>
      </div>
      {editing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="p-4 flex items-center gap-x-3 space-y-0 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Check this box if you want this chapter free for preview
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting || !isValid}>Save</Button>
          </form>
        </Form>
      ) : !!chapter.isFree ? (
        <p className="text-slate-500 italic text-muted-foreground">
          This chapter is
          <span className="font-semibold uppercase text-green-500"> free </span>
          for preview
        </p>
      ) : (
        <p className="text-slate-500 italic text-muted-foreground">
          This chapter is
          <span className="font-semibold uppercase text-red-500">
            {" "}
            not free
          </span>
        </p>
      )}
    </div>
  );
};

export default ChapterFree;
