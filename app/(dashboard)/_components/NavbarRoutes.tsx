'use client'
import React from 'react'

import { usePathname } from "next/navigation";
import Link from "next/link";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavbarRoutes = () => {
    const currentPath = usePathname();
    let isTeacherMode = currentPath.startsWith("/teacher");
    let isPlayerMode = currentPath.includes("/chapters");

  return (
    <div>
       {isTeacherMode || isPlayerMode ? (
            <Link href="/">
              <Button variant={"outline"} size={"lg"}>
                <span className="flex gap-x-2">
                  Exit <LogOut className='h-4 w-4 ' />
                </span>
              </Button>
            </Link>
          ) : (
            <Link href="/teacher/courses">
              <Button variant={"ghost"} size={"lg"}>
                Teacher Mode
              </Button>
            </Link>
          )}
    </div>
  )
}

export default NavbarRoutes
