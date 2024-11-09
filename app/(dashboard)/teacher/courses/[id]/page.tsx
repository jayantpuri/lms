import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { IconBadge } from "@/app/components/icon";
import PublishBanner from "@/app/components/publishBanner";
import { DollarSign, LayoutDashboard, ListVideo, File } from "lucide-react";

import CourseTitle from "../_components/CourseTitle";
import CourseDescription from "../_components/CourseDescription";
import CourseImage from "../_components/CourseImage";
import CourseCategory from "../_components/CourseCategory";
import CoursePrice from "../_components/CoursePrice";
import CourseAttachemnts from "../_components/CourseAttachements";
import CourseChapters from "../_components/CourseChapters";
import CourseActions from "../_components/CourseActions";
const CourseId = async ({ params }: { params: { id: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const category = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const course = await db.course.findUnique({
    where: {
      id: params.id,
      userId: userId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }
  const courseFields = [
    course.title,
    course.description,
    course.price,
    course.imageUrl,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];
  const totalFields = courseFields.length;
  const completedFields = courseFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const canPublishCourse = totalFields === completedFields;

  return (
    <>
      {!course.isPublished && (
        <PublishBanner
          variant={"warning"}
          label="This course is not published, it will not be visible to the students"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-bold">Course Setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <div>
            <CourseActions course={course} canPublish={canPublishCourse} />
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
            <CourseCategory course={course} categories={category} />
          </div>
          <div className="flex flex-col gap-y-8">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge
                  icon={ListVideo}
                  variant={"default"}
                  size={"default"}
                />
                <h1 className="text-xl font-bold">Course chapters</h1>
              </div>
              <CourseChapters course={course} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge
                  icon={DollarSign}
                  variant={"default"}
                  size={"default"}
                />
                <h1 className="text-xl font-bold">Sell your course</h1>
              </div>
              <CoursePrice course={course} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} variant={"default"} size={"default"} />
                <h1 className="text-xl font-bold">Course Attachments</h1>
              </div>
              <CourseAttachemnts course={course} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseId;
