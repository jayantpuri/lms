import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getPurchasedCourses } from "@/dbFunctions/getPurchasedCourses";
import StatsCard from "./_components/StatsCard";

import CourseList from "./search/_components/CourseList";
const Home = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  let purchases = await getPurchasedCourses({ userId: userId });

  const activeCourses = purchases.filter(
    (purchase) => purchase.progress < 100
  ).length;
  const completedCourses = purchases.filter(
    (purchase) => purchase.progress === 100
  ).length;

  return (
    <div className="p-6">
      <div className="w-full h-full flex flex-col gap-y-6">
        <div className="w-full flex gap-x-2">
          <StatsCard type={"progress"} activeCourses={activeCourses} />
          <StatsCard type={"completed"} completedCourses={completedCourses} />
        </div>
        <div>{purchases.length > 0 && <CourseList items={purchases} />}</div>
      </div>
    </div>
  );
};

export default Home;
