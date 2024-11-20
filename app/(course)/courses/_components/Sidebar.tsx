import { Course, Chapter, Purchase, UserProgress } from "@prisma/client";

import ChapterList from "./ChapterList";
interface CourseSidebarProps {
  course: Course & {
    purchases: Purchase[];
    chapters: (Chapter & {
      userProgress: UserProgress[];
    })[];
  };
}
const CourseSidebar = async ({ course }: CourseSidebarProps) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full p-8 font-bold text-md border-b text-center">
        {course.title}
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
