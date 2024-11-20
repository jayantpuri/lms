import CourseSidebar from "../_components/Sidebar";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CourseNavbar from "../_components/CourseNavbar";

interface layoutProps {
  params: { courseId: string };
  children: React.ReactNode;
}
const Layout = async ({ children, params }: layoutProps) => {
  const { courseId } = params;
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId: userId,
            },
          },
        },

        orderBy: {
          position: "asc",
        },
      },
      purchases: {
        where: {
          userId: userId,
        },
      },
    },
  });
  if (!course) {
    return redirect("/");
  }
  return (
    <div className="h-full">
      <div className="w-full h-[80px] md:pl-[250px]">
        <CourseNavbar course={course} />
      </div>
      <div className="h-full w-[250px] hidden inset-0 fixed md:flex border-r border-slate-600">
        <CourseSidebar course={course} />
      </div>
      <div className="md:pl-[250px] h-full w-full">{children}</div>
    </div>
  );
};

export default Layout;
