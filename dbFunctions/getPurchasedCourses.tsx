import { db } from "@/lib/db";
import { Course, Chapter, Category, Purchase } from "@prisma/client";
import { getUserProgress } from "./getUserProgress";

interface getPurchasedCoursesProps {
  userId: string;
}

export type purchasesWithProgress = Course & {
  purchases: Purchase[];
  progress: number;
  category: Category;
  chapters: Chapter[];
};

export const getPurchasedCourses = async ({
  userId,
}: getPurchasedCoursesProps): Promise<purchasesWithProgress[] | []> => {
  try {
    let purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            purchases: true,
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map(
      (purchase) => purchase.course
    ) as purchasesWithProgress[];

    let purchasedCoursesWithProgress: purchasesWithProgress[] =
      await Promise.all(
        courses.map(async (course) => {
          const progress = await getUserProgress({
            courseId: course.id,
            userId: userId,
          });
          return {
            ...course,
            progress: progress,
          };
        })
      );

    if (!purchasedCourses) {
      return [];
    }
    return purchasedCoursesWithProgress;
  } catch (error) {
    console.log("[GET_PURCHASED_COURSES_ERROR]", error);
    return [];
  }
};
