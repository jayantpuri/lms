"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Course } from "@prisma/client";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center">
          <Button
            className="text-center text-xl"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const rowTitle = row.getValue("title") as string;
      return <div className="text-center">{rowTitle}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center">
          <Button
            className="text-center text-xl"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price")) || 0;
      const formattedPrice = new Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return <div className="text-center">{formattedPrice}</div>;
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center">
          <Button
            className="text-center text-xl"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Published
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") as boolean;
      return (
        <div className="text-center">
          <Badge
            className={cn(
              "bg-sky-700 text-slate-50",
              !isPublished && "bg-slate-700"
            )}
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link
              href={`/teacher/courses/${course.id}`}
              className="flex items-center justify-center"
            >
              <Pencil className="mr-2 h-4 w-4" />
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
