import { Course, Chapter, Purchase, UserProgress } from "@prisma/client";

import ChapterList from "./ChapterList";
import CourseProgress from "@/app/components/CourseProgress";
interface CourseSidebarProps {
  course: Course & {
    purchases: Purchase[];
    chapters: (Chapter & {
      userProgress: UserProgress[];
    })[];
  };
  progress: number;
}
const CourseSidebar = async ({ course, progress }: CourseSidebarProps) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex flex-col gap-y-8 p-8 font-bold text-md border-b text-center">
        {course.title}
        {course.purchases.length > 0 && <CourseProgress progress={progress} />}
      </div>
      <div className="flex flex-col overflow-y-hidden">
        {course.chapters.map((chapter) => (
          <ChapterList
            chapterId={chapter.id}
            courseId={course.id}
            key={chapter.id}
            title={chapter.title}
            isFree={chapter.isFree || course.purchases.length > 0}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
