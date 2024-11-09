"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Trash } from "lucide-react";
import axios from "axios";

import { Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import AlertModal from "@/app/components/alertModal";
import toast from "react-hot-toast";

interface CourseActionsProps {
  course: Course;
  canPublish: boolean;
}
const CourseActions = ({ course, canPublish }: CourseActionsProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const publishCourse = async () => {
    try {
      setLoading(true);

      if (!course.isPublished) {
        await axios.patch(`/api/courses/${course.id}/publish`);
        toast.success("Course published");
      } else {
        await axios.patch(`/api/courses/${course.id}/unpublish`);
        toast.success("Course unpublished");
      }
      router.refresh();
    } catch (error) {
      toast.error("Error updating Course");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/courses/${course.id}`);
      router.refresh();
      router.push(`/teacher/courses/`);
      toast.success("Course deleted");
    } catch (error) {
      toast.error("Error deleting Course");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-8 self-center justify-self-start">
      <div className="flex gap-x-2 items-center">
        <Button
          variant={"outline"}
          disabled={!canPublish}
          onClick={publishCourse}
          size={"sm"}
        >
          {!course.isPublished ? "Publish" : "Unpublish"}
        </Button>
        <AlertModal onDelete={deleteCourse}>
          <Button variant={"default"} size={"sm"} disabled={loading}>
            <Trash className="h-4 w-4" />
          </Button>
        </AlertModal>
      </div>
    </div>
  );
};

export default CourseActions;
