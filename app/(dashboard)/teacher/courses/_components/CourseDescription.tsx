"use client";
import React, { useState } from "react";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Pencil } from "lucide-react";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface CourseDescriptionProps {
  course: Course;
}

const courseDescriptionSchema = z.object({
  description: z
    .string()
    .min(6, { message: "course title must be at least 6 characters" }),
});

const CourseDescription = ({ course }: CourseDescriptionProps) => {

  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const form = useForm<z.infer<typeof courseDescriptionSchema>>({
    resolver: zodResolver(courseDescriptionSchema),
    defaultValues: {
      description: course?.description || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof courseDescriptionSchema>) => {
    try {
      const response = axios.patch(`/api/courses/${course.id}`, values);
      setEditing(false);
      toast.success("Course description updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-6 bg-slate-100 px-4 py-6 mt-4 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Course Description</h1>
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
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Add a description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting || !isValid}>Save</Button>
          </form>
        </Form>
      ) : (
        <p className="text-slate-700">
          {course.description || "Add a description"}
        </p>
      )}
    </div>
  );
};

export default CourseDescription;
