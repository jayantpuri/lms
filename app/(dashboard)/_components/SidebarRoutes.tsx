"use client";
import { LayoutList, Compass, List, BarChart } from "lucide-react";
import { usePathname } from "next/navigation";
import SidebarRoute from "./SidebarRoute";

const guestRoutes = [
  {
    name: "Dashboard",
    logo: LayoutList,
    path: "/",
  },
  {
    name: "Browse",
    logo: Compass,
    path: "/search",
  },
];

const teacherRoutes = [
  {
    name: "Courses",
    logo: List,
    path: "/teacher/courses",
  },
  {
    name: "Analytics",
    logo: BarChart,
    path: "/teacher/analytics",
  },
];
const SidebarRoutes = () => {
  const currentPath = usePathname();
  const isTeacherMode = currentPath.includes("/teacher");
  const routes = isTeacherMode ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full h-full">
      {routes.map((route, index) => (
        <SidebarRoute
          key={index}
          name={route.name}
          path={route.path}
          logo={route.logo}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
