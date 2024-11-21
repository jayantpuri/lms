import { db } from "@/lib/db";

interface getChapterDetailsProps {
  courseId: string;
  chapterId: string;
  userId: string;
}
export const getChapterDetails = async ({
  courseId,
  chapterId,
  userId,
}: getChapterDetailsProps) => {
  let chapter;
  let muxData;
  let userProgress;
  let purchase;
  try {
    chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
        isPublished: true,
      },
    });
    if (!chapter) {
      chapter = null;
      muxData = null;
      userProgress = null;
      purchase = null;
      return { chapter, muxData, userProgress, purchase };
    }

    purchase = await db.purchase.findUnique({
      where: {
        courseId_userId: {
          courseId: courseId,
          userId: userId,
        },
      },
    });

    if (!purchase && !chapter.isFree) {
      muxData = null;
      userProgress = null;
      purchase = null;
      return { chapter, muxData, userProgress, purchase };
    }

    muxData = await db.muxData.findUnique({
      where: {
        chapterId: chapterId,
      },
    });

    userProgress = await db.userProgress.findUnique({
      where: {
        chapterId_userId: {
          userId: userId,
          chapterId: chapterId,
        },
      },
    });
    if (!purchase) {
      purchase = null;
    }

    return { chapter, muxData, userProgress, purchase };
  } catch (error) {
    console.log("[getChapterDetails] error", error);
    userProgress = null;
    muxData = null;
    chapter = null;
    purchase = null;
    return { chapter, muxData, userProgress, purchase };
  }
};
