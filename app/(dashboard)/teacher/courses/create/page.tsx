"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Courses = () => {
  const router = useRouter();

  const formSchema = z.object({
    title: z
      .string()
      .min(6, { message: "course title must be at least 6 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("/api/courses", values);
      router.refresh();
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("course successfully created");
    } catch (error) {
        toast.error("Something went wrong");
    }
  }

  return (
    <div className="h-full flex flex-col md:items-center md:justify-center max-w-5xl p-6 mx-auto my-40">
      <h1 className="text-2xl font-semibold">Name your course</h1>
      <p className="text-sm text-slate-600">
        What would you like to name your course? Do not worry, you can change
        this later
      </p>
      <div className="flex flex-col gap-y-6 mt-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isSubmitting}
                      placeholder="eg: 'Advanced Web Development'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-4">
              <Link href={"/"}>
                <Button
                  variant={"ghost"}
                  size={"lg"}
                  className="font-bold text-md"
                  type="button"
                >
                  cancel
                </Button>
              </Link>
              <Button
                size={"lg"}
                className="font-bold text-md"
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Courses;
