"use client";
import { useState } from "react";
import {
  PersonStanding,
  Film,
  Music2,
  Camera,
  Computer,
  BrainCircuit,
  LucideIcon,
} from "lucide-react";

import { Category } from "@prisma/client";
import CategoryItem from "./CategoryItem";

interface categoriesListProps {
  list: Category[];
}

const iconMap: Record<string, LucideIcon> = {
  Photography: Camera,
  Enigneering: BrainCircuit,
  Music: Music2,
  Filming: Film,
  Fitness: PersonStanding,
  "Computer Science": Computer,
};
const CategoriesList = ({ list }: categoriesListProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2 overflow-x-auto">
      {list.map((category) => (
        <CategoryItem
          key={category.id}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          id={category.id}
          name={category.name}
          icon={iconMap[category.name]}
        />
      ))}
    </div>
  );
};

export default CategoriesList;
