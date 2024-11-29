import React from "react";
import { IconBadge } from "@/app/components/icon";
import { Clock, CheckCircle } from "lucide-react";

interface StatsCardProps {
  activeCourses?: number;
  completedCourses?: number;
  type: "progress" | "completed";
}
const StatsCard = ({ type, ...props }: StatsCardProps) => {
  const numCourses =
    type !== "progress" ? props.completedCourses : props.activeCourses;
  const title = type !== "progress" ? "Completed" : "In Progress";

  const Icon = type !== "progress" ? CheckCircle : Clock;
  return (
    <div className="w-full border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge icon={Icon} variant="success"/>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-slate-500 text-sm">
          {numCourses} {numCourses === 1 ? "course" : "courses"}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
