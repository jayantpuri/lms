import React from "react";
import { Course, Chapter, Purchase, UserProgress } from "@prisma/client";
import NavbarRoutes from "@/app/(dashboard)/_components/NavbarRoutes";
import MobileSidebar from "./MobileSidebar";
import { UserButton } from "@clerk/nextjs";
interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
    purchases: Purchase[];
  };
}

const CourseNavbar = ({ course }: CourseNavbarProps) => {
  return (
    <div className="w-full h-full flex justify-between items-center border-b p-6">
      <div className="flex md:hidden">
        <MobileSidebar course={course} />
      </div>
      <div className="md:w-full flex gap-x-6 items-center justify-end">
        <NavbarRoutes />
        <UserButton />
      </div>
    </div>
  );
};

export default CourseNavbar;
