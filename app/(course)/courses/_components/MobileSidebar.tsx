import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Course, Chapter, Purchase, UserProgress } from "@prisma/client";
import CourseSidebar from "./Sidebar";
interface MobileNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
    purchases: Purchase[];
  };
}
const MobileSidebar = ({ course }: MobileNavbarProps) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white">
        <CourseSidebar course={course} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
