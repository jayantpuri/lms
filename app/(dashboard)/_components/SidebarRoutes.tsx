import { LayoutList, Compass } from "lucide-react";
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

const teacherRotes = [];
const SidebarRoutes = () => {
  const routes = guestRoutes;

  return (
    <div className="flex flex-col w-full h-full">
      {routes.map((route) => (
        <SidebarRoute
          key={route.name}
          name={route.name}
          path={route.path}
          logo={route.logo}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
