"use client";
import { usePathname, useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteProps {
  name: string;
  path: string;
  logo: LucideIcon;
}
const SidebarRoute = ({ name, path, logo: Logo }: RouteProps) => {
  const currentPath = usePathname();
  const router = useRouter();
  const isActive =
    (currentPath.includes(path) && path.length>1 )||
    currentPath === path ||
    (currentPath === "/" && path === "/");

  const handleClick = (path: string) => {
    router.push(path);
  };
  return (
    <button
      onClick={() => handleClick(path)}
      type="button"
      className={cn(
        "flex items-center justify-start text-slate-500 font-[500] pl-6 rounded-sm hover:text-slate-600 hover:bg-slate-300/20 transition-all",
        isActive &&
          "bg-sky-200/20 text-sky-700 hover:bg-sky-200/10 hover:text-sky-600"
      )}
    >
      <div className="flex gap-x-2 items-center py-4">
        <Logo size={22} />
        <span>{name}</span>
      </div>

      <div
        className={cn(
          "h-full w-2 bg-sky-800 opacity-0 ml-auto transition-all",
          isActive && "opacity-100 "
        )}
      ></div>
    </button>
  );
};

export default SidebarRoute;
