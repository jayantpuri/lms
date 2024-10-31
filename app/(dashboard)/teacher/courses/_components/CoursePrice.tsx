"use client";
import React, { useState } from "react";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Pencil } from "lucide-react";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { priceFormat } from "@/lib/priceFormatter";

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

interface CoursePriceProps {
  course: Course;
}

const coursePriceSchema = z.object({
  price: z.coerce.number(),
});

const CoursePrice = ({ course }: CoursePriceProps) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const form = useForm<z.infer<typeof coursePriceSchema>>({
    resolver: zodResolver(coursePriceSchema),
    defaultValues: {
      price: course?.price || undefined,
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof coursePriceSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${course.id}`, values);
      setEditing(false);
      toast.success("Course price updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-6 bg-slate-100 px-4 py-6 mt-4 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Course price</h1>
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
              Edit price <Pencil className="h-4 w-4" />
            </span>
          )}
        </button>
      </div>
      {editing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isSubmitting}
                      placeholder="Add a price"
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
      ) : !course.price ? (
        <p
          className={cn(
            "text-slate-700",
            !course.price && "text-muted-foreground italic"
          )}
        >
          Set a price
        </p>
      ) : (
        <p>{course.price && priceFormat(course.price)}</p>
      )}
    </div>
  );
};

export default CoursePrice;
