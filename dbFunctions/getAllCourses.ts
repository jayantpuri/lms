import { db } from "@/lib/db";
import { getUserProgress } from "./getUserProgress";
import { Course, Chapter, Category, Purchase } from "@prisma/client";

type CourseWithCategoryWithProgress = Course & {
  chapters: Chapter[];
  category: Category | null;
  progress: number | null;
  purchases?: Purchase[] | null;
};
interface getAllCoursesProps {
  title?: string;
  categoryId?: string;
  userId: string;
}
export const getAllCourses = async ({
  title,
  categoryId,
  userId,
}: getAllCoursesProps) => {
  try {
    const allCourses = await db.course.findMany({
      where: {
        title: { contains: title },
        categoryId: categoryId,
        isPublished: true,
      },
      include: {
        category: true,

        chapters: {
          where: {
            isPublished: true,
          },
        },
        purchases: {
          where: {
            userId: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithCategoryWithProgress[] = await Promise.all(
      allCourses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }

        const courseProgress = await getUserProgress({
          courseId: course.id,
          userId: userId,
        });

        return {
          ...course,
          progress: courseProgress,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_ALL_COURSES_ERROR]", error);
  }
};

// GOAL: Get all courses from the database, sorted by category and title
// Display price of each course that the user has not purchased or purchased
// If purchased course, display user progress for that course
