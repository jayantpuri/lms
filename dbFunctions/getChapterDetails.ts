import { db } from "@/lib/db";
import {
  Purchase,
  Attachment,
  Chapter,
  UserProgress,
  MuxData,
} from "@prisma/client";

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
  let chapter: Chapter | null;
  let muxData: MuxData | null;
  let userProgress: UserProgress | null;
  let purchase: Purchase | null;
  let attachments: Attachment[] | null;
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
      attachments = null;
      return { chapter, muxData, userProgress, purchase, attachments };
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
      attachments = null;
      return { chapter, muxData, userProgress, purchase, attachments };
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

    attachments = await db.attachment.findMany({
      where: {
        courseId: courseId,
      },
    });

    return { chapter, muxData, userProgress, purchase, attachments };
  } catch (error) {
    console.log("[getChapterDetails] error", error);
    userProgress = null;
    muxData = null;
    chapter = null;
    purchase = null;
    attachments = null;
    return { chapter, muxData, userProgress, purchase, attachments };
  }
};
