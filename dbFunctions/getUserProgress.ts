import { db } from "@/lib/db";
import { UserProgress, Chapter } from "@prisma/client";

interface getUserProgressProps {
  courseId: string;
  userId: string;
}

export const getUserProgress = async ({
  courseId,
  userId,
}: getUserProgressProps): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
    });

    const chapterIds = publishedChapters.map((chapter) => chapter.id);

    const progress = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: { in: chapterIds },
      },
    });

    const watchedChapters = progress/ chapterIds.length * 100;

    return watchedChapters;
  } catch (error) {
    console.log("[User Progress] error", error);
    return 0;
  }
};
