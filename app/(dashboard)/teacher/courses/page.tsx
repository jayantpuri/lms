import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "./_components/courseTable/data-table";
import { columns } from "./_components/courseTable/columns";

import { db } from "@/lib/db";
const Courses = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const allCourses = await db.course.findMany({
    where: {
      userId: userId,
    },
  });

  return (
    <div className="p-6">
      <div className="flex flex-col">
        <div className="mx-auto py-6 container">
          <h1 className="text-2xl font-semibold mb-4">Your Courses</h1>
          <DataTable columns={columns} data={allCourses} />
        </div>
        <Link href="/teacher/courses/create">
          <Button variant={"default"} className="py-6 px-4">
            Create Course
            <PlusCircle className=" h-7 w-7" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Courses;
