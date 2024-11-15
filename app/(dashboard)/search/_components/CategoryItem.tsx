"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import queryString from "query-string";
interface CategoryItemProps {
  name: string;
  icon: LucideIcon;
  id: string;
}
const CategoryItem = ({ name, id, icon: Icon }: CategoryItemProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();
  const title = params.get("title");
  const categoryId = params.get("categoryId");

  const setCategory = (id: string) => {
    const url = queryString.stringifyUrl(
      {
        url: pathName,
        query: {
          title: title,
          categoryId: categoryId === id ? null : id,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  return (
    <button
      onClick={() => setCategory(id)}
      className={cn(
        "text-sm flex items-center border-2 border-slate-200 gap-x-1 rounded-full p-3",
        id === categoryId && "bg-sky-300/20 border-sky-600"
      )}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {name}
    </button>
  );
};

export default CategoryItem;
