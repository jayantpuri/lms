
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
interface CourseProgressProps {
  progress: number;
}
const CourseProgress = ({ progress }: CourseProgressProps) => {
  return (
    <div className="w-full flex flex-col gap-y-1">
      <Progress value={progress} className="w-full bg-gray-200 h-2" />
      <span className={cn("text-emerald-600 font-medium mr-auto")}>{progress}% complete</span>
    </div>
  );
};

export default CourseProgress;
