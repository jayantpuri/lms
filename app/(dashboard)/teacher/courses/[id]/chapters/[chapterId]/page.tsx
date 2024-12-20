import Link from "next/link";
import { redirect } from "next/navigation";

import { MoveLeft, LayoutDashboard, Eye, Video } from "lucide-react";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { IconBadge } from "@/app/components/icon";

import ChapterTitle from "../_components/ChapterTitle";
import ChapterDescription from "../_components/ChapterDescription";
import ChapterFree from "../_components/ChapterFree";
import ChapterVideo from "../_components/ChapterVideo";
import PublishBanner from "@/app/components/publishBanner";
import ChapterActions from "../_components/ChapterActions";

const ChapterPage = async ({
  params,
}: {
  params: { id: string; chapterId: string };
}) => {
  const { id: courseId, chapterId } = params;

  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }

  const chapter = await db.chapter.findFirst({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      muxData: true,
    }
  });

  if (!chapter) {
    redirect(`/teacher/courses/${courseId}`);
  }

  const chapterFields = [chapter.title, chapter.description, chapter.videoUrl];

  const completedFields = chapterFields.filter(Boolean).length;
  const toatalFields = chapterFields.length;
  const chapterCreationText = `(${completedFields}/${toatalFields})`;

  const canPublish = completedFields === toatalFields;

  return (
    <>
      {!chapter.isPublished && (
        <PublishBanner
          variant={"warning"}
          label={
            "This chapter is un-published. It will not be visible in the course."
          }
        />
      )}
      <div className="p-6 mx-auto">
        <div className="w-full grid grid-cols-2">
          <div>
            <div className="w-full flex flex-col gap-y-6">
              <Link
                href={`/teacher/courses/${courseId}`}
                className="flex items-center gap-x-2"
              >
                <MoveLeft className="h-4 w-4" />
                Back to course setup
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Chapter Creation</h1>
                <h2 className="text-md text-slate-700 mt-2">
                  Complete all fields {chapterCreationText}
                </h2>
              </div>
            </div>
          </div>
          <>
            <ChapterActions
              chapter={chapter}
              courseId={courseId}
              canPublish={!canPublish}
            />
          </>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-16 gap-8">
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h3 className="text-xl font-semibold">
                  Customize your chapter
                </h3>
              </div>
              <ChapterTitle chapter={chapter} courseId={courseId} />
              <ChapterDescription chapter={chapter} courseId={courseId} />
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex gap-x-2 items-center">
                <IconBadge icon={Eye} />
                <h3 className="text-xl font-semibold">Access settings</h3>
              </div>
              <ChapterFree chapter={chapter} courseId={courseId} />
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-y-2">
              <div className="flex gap-x-2 items-center">
                <IconBadge icon={Video} />
                <h3 className="text-xl font-semibold">Add a video</h3>
              </div>
              <ChapterVideo chapter={chapter} courseId={courseId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterPage;
