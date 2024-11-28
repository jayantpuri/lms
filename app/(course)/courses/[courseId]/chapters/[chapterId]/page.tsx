import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getChapterDetails } from "@/dbFunctions/getChapterDetails";

import PublishBanner from "@/app/components/publishBanner";
import EnrollButton from "./_components/EnrollButton";
import TextPreview from "@/app/components/TextPreview";
import VideoPlayer from "./_components/VideoPlayer";
import CompleteButton from "./_components/CompleteButton";

import { File } from "lucide-react";
import { Separator } from "@/components/ui/separator";
interface chapterPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const chapterIdPage = async ({ params }: chapterPageProps) => {
  const { courseId, chapterId } = params;
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      price: true,
    },
  });

  if (!course) {
    redirect("/");
  }

  const { muxData, userProgress, chapter, purchase, attachments } =
    await getChapterDetails({
      courseId: courseId,
      userId: userId,
      chapterId: chapterId,
    });

  if (!chapter) {
    redirect(`/courses/${courseId}`);
  }
 
  return (
    <div>
      {!purchase && (
        <PublishBanner
          variant={"warning"}
          label="You need to purchase this course to access this chapter"
        />
      )}
      {userProgress != null && userProgress.isCompleted === true && (
        <PublishBanner
          variant={"success"}
          label="You have completed this chapter"
        />
      )}
      <div className="p-6 max-w-4xl mx-auto">
        <div className="relative w-full aspect-video">
          <VideoPlayer
            playbackId={muxData?.playbackId!}
            canAccess={!!muxData}
            title={chapter.title}
          />
        </div>
        <div className="flex mt-12 flex-col gap-2 md:flex-row md:justify-between">
          <h3 className="text-xl font-bold"> {chapter.title}</h3>
          {!purchase && (
            <EnrollButton price={course.price!} courseId={courseId} />
          )}
          {purchase && (
            <CompleteButton
              isCompleted={!!userProgress?.isCompleted}
              courseId={courseId}
              chapterId={chapterId}
            />
          )}
        </div>
      </div>
      <Separator className="w-full" />
      <div className="p-6">
        <TextPreview value={chapter.description!} />
      </div>
      <Separator className="w-full" />
      <div className="flex flex-col gap-y-2 p-6">
        {purchase &&
          attachments?.map((attachment) => (
            <a
              key={attachment.id}
              href={attachment.url}
              target="_blank"
              className="p-3 flex rounded-md items-center gap-x-2 bg-sky-300/40 text-sky-800 hover:bg-sky-300/60 transition-all"
            >
              <File className="h-4 w-4" />
              <p className="text-sm">{attachment.name}</p>
            </a>
          ))}
      </div>
    </div>
  );
};

export default chapterIdPage;
