import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { IconBadge } from "@/app/components/icon";
import { LayoutDashboard } from "lucide-react";

import CourseTitle from "../_components/CourseTitle";
import CourseDescription from "../_components/CourseDescription";
import CourseImage from "../_components/CourseImage";
const CourseId = async ({ params }: { params: { id: string } }) => {
  const { userId } = auth();
  const course = await db.course.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!course || !userId) {
    return redirect("/");
  }
  const courseFields = [
    course.title,
    course.description,
    course.price,
    course.imageUrl,
    course.categoryId,
  ];
  const totalFields = courseFields.length;
  const completedFields = courseFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-bold">Course Setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge
              icon={LayoutDashboard}
              variant={"default"}
              size="default"
            />
            <h1 className="text-xl font-bold">Customize your course</h1>
          </div>
          <CourseTitle course={course} />
          <CourseDescription course={course} />
          <CourseImage course={course} />
        </div>
      </div>
    </div>
  );
};

export default CourseId;
