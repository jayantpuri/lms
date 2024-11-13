"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import queryString from "query-string";
interface CategoryItemProps {
  name: string;
  icon: LucideIcon;
  id: string;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}
const CategoryItem = ({
  name,
  id,
  icon: Icon,
  setSelectedItems,
  selectedItems,
}: CategoryItemProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();
  const title = params.get("title");
  let prev = [...selectedItems];
  const setCategory = (id: string) => {
    let prev = [...selectedItems];
    if (!prev.includes(id)) {
      prev.push(id);
    } else {
      prev = prev.filter((item) => item !== id);
    }
    setSelectedItems((st) => prev);

    const url = queryString.stringifyUrl(
      {
        url: pathName,
        query: {
          title: title,
          categoryId: prev.length > 0 ? prev : null,
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
        prev?.includes(id) && "bg-sky-300/20 border-sky-600"
      )}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {name}
    </button>
  );
};

export default CategoryItem;
