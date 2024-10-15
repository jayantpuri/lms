"use client";
import MobileSidebar from "./mobileSidebar";
import NavbarRoutes from "./NavbarRoutes";

import { UserButton } from "@clerk/nextjs";
const Navbar = () => {
  return (
    <div className="w-full h-full flex justify-between items-center p-6 shadow-sm">
      <div className="md:hidden">
        <MobileSidebar />
      </div>
      <div className="md:w-full flex gap-x-6 items-center justify-end">
        <div>
          <NavbarRoutes />
        </div>
        <div>
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
