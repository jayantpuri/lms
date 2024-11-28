"use client";
import Image from "next/image";
import Link from "next/link";
import { Notebook } from "lucide-react";

import { priceFormat } from "@/lib/priceFormatter";
import { IconBadge } from "@/app/components/icon";
import CourseProgress from "@/app/components/CourseProgress";

interface courseCardProps {
  courseId: string;
  title: string;
  imageUrl: string;
  category: string;
  chapters: number;
  price: number;
  progress: number | null;
  isPurchased: boolean;
}

const CourseCard = ({
  courseId,
  title,
  imageUrl,
  category,
  chapters,
  price,
  progress,
  isPurchased,
}: courseCardProps) => {
  return (
    <Link href={`/courses/${courseId}`}>
      <div className="group p-3 hover:shadow-md transition-all bg-slate-50 rounded-md border-2 border-slate-300 flex flex-col">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
        <div className="group hover:text-sky-700 transition-all mt-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-sm text-slate-500">{category}</span>
        </div>
        <div className="my-3 flex flex-col gap-y-2">
          <span className="flex gap-x-1 text-sm items-center text-slate-500">
            <IconBadge icon={Notebook} size={"sm"} /> {chapters}
            {chapters === 1 ? " chapter" : " chapters"}
          </span>
          {!isPurchased ? (
            <span className="text-md md:text-sm font-medium text-slate-700">
              {priceFormat(price)}
            </span>
          ) : (
            <CourseProgress progress={progress!} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
