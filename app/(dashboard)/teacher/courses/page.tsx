import Link from "next/link";
import { Button } from "@/components/ui/button";
const Courses = () => {
  return (
    <div>
      <Link href = "/teacher/courses/create">
        <Button variant={"secondary"} size={"lg"} >Create Course</Button>
      </Link>
    </div>
  );
};

export default Courses;
