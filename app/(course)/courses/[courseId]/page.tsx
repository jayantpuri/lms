import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
interface coursePageParams {
  params: { courseId: string };
}
const CoursePage = async ({ params }: coursePageParams) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  return (
    <div>
      <h1>Course {params.courseId}</h1>
    </div>
  );
};

export default CoursePage;
