"use client";
import React, { useState, useEffect } from "react";

import { Chapter } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { title } from "process";

interface ChapterList {
  chapters: Chapter[];
  onReorder: (list: Chapter[]) => void;
  onEdit: (id: string) => void;
}
const ChapterList = ({ chapters, onReorder, onEdit }: ChapterList) => {
  const [chapterList, setChapterList] = useState<Chapter[] | []>(chapters);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapterList(chapters);
  }, [chapters]);

  if (!isMounted) {
    return null;
  }

  const dragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination || !source) return;
    if (destination.index === source.index) return;

    const list = Array.from(chapterList);
    const [movedChapter] = list.splice(source.index, 1);
    list.splice(destination.index, 0, movedChapter);
    setChapterList(list);

    const updatedList = list.map((chapter, index) => {
      return {
        ...chapter,
        position: index + 1,
      };
    });
    onReorder(updatedList);
  };

  return (
    <DragDropContext onDragEnd={dragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-y-4"
          >
            {chapterList.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-2 flex justify-between items-center border-sky-200 border-2 rounded-md bg-sky-100 text-sky-800"
                  >
                    <div className="flex gap-x-2  items-center text-sm">
                      <Grip className="h-5 w-5 mr-2 border-r-slate-200 cursor-pointer" />
                      {chapter.title}
                    </div>
                    <div className="flex gap-x-2">
                      <Badge className={cn("text-xs bg-yellow-400/70 text-yellow-900 hover:bg-yellow-500", chapter.isFree && "text-green-100 bg-green-600 hover:bg-green-500")}>{chapter.isFree ? "Free": "Paid"}</Badge>
                      <Badge
                        className={cn(
                          "text-xs",
                          chapter.isPublished
                            ? "bg-sky-800 text-sky-100 hover:bg-sky-500"
                            : "bg-red-700 text-red-100 hover:bg-red-500"
                        )
                        }
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        className="h-4 w-4 text-slate-600"
                        onClick={() => onEdit(chapter.id)}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChapterList;
