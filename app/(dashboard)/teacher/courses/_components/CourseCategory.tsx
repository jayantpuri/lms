"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { Category } from "@prisma/client";
import toast from "react-hot-toast";
import axios from "axios";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Pencil } from "lucide-react";
import { z } from "zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface courseCategoryProps {
  course: Course;
  categories: Category[];
}

const categorySchema = z.object({
  categoryId: z.string().min(0, { message: "Category is required" }),
});

const CourseCategory = ({ course, categories }: courseCategoryProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({ id: "", value: "" });
  const [editing, setEditing] = useState(false);

  const router = useRouter();

  const selectedCategory = categories.find(
    (category) => category.id === course.categoryId
  );

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    console.log(values);
    try {
      const response = await axios.patch(`/api/courses/${course.id}`, values);
      setEditing(false);
      toast.success("Course category updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full bg-slate-100 flex flex-col gap-6 p-6 mt-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Course Category</h1>
        <button
          onClick={() => setEditing(!editing)}
          className={cn(
            "text-sm font-semibold text-red-700 hover:text-slate-700 transition-all",
            editing && "text-slate-700 hover:text-red-700 transition-all"
          )}
        >
          {editing ? (
            <span>Cancel</span>
          ) : !course.categoryId ? (
            <span>Select Category</span>
          ) : (
            <span className="flex gap-x-2 items-center">
              Change Category <Pencil className="h-4 w-4" />
            </span>
          )}
        </button>
      </div>
      {editing ? (
        <>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {value.id.length ? (
                  categories.find((category) => category.name === value.value)
                    ?.name
                ) : (
                  <span className="text-muted-foreground">
                    Select category...
                  </span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" side="right">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name}
                        onSelect={(currentValue) => {
                          setValue(
                            currentValue === value.value
                              ? { id: "", value: "" }
                              : { id: category.id, value: currentValue }
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value.value === category.name
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {category.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button
            className="w-[20%]"
            onClick={() => onSubmit({ categoryId: value.id })}
          >
            Save
          </Button>
        </>
      ) : (
        <p
          className={cn(
            "text-slate-700",
            !course.categoryId && "italic text-muted-foreground"
          )}
        >
          {selectedCategory?.name || "Select category..."}
        </p>
      )}
    </div>
  );
};

export default CourseCategory;
