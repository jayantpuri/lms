import { db } from "@/lib/db";

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
        isCompleted: true,
      },
    });

    const watchedChapters = (progress/ chapterIds.length * 100).toFixed(2);

    return parseFloat(watchedChapters);
  } catch (error) {
    console.log("[User Progress] error", error);
    return 0;
  }
};
