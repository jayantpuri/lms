import { Course, Chapter, Category, Purchase } from "@prisma/client";
import CourseCard from "./CourseCard";

type CourseListType = Course & {
  chapters: Chapter[];
  category: Category | null;
  progress: number | null;
  purchases?: Purchase[] | null;
};

interface CourseListProps {
  items: CourseListType[] | undefined;
}

const CourseList = ({ items }: CourseListProps) => {
  return (
    <div className="w-full py-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {items?.map((item) => (
        <CourseCard
          key={item.id}
          courseId={item.id}
          title={item.title}
          imageUrl={item.imageUrl!}
          price={item.price!}
          chapters={item.chapters.length}
          category={item.category?.name!}
          progress={item.progress}
        />
      ))}
    </div>
  );
};

export default CourseList;
