import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getAllCourses } from "@/dbFunctions/getAllCourses";
import CategoriesList from "./_components/Categories";
import SearchBox from "../_components/SearchBox";
import CourseList from "./_components/CourseList";

interface searchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}
const Search = async ({ searchParams }: searchPageProps) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const allCourses = await getAllCourses({
    title: searchParams.title,
    categoryId: searchParams.categoryId,
    userId,
  });
 
  const items = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return (
    <div className="w-full p-6">
      <CategoriesList list={items} />
      <CourseList items={allCourses} />
    </div>
  );
};

export default Search;
