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

    const [movedChapter] = chapterList.splice(source.index, 1);
    chapterList.splice(destination.index, 0, movedChapter);
    setChapterList((prev) => [...chapterList]);

    onReorder(chapterList);
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
                    className="flex justify-between items-center border-r-slate-200 p-2 rounded-md bg-slate-200 text-slate-700"
                  >
                    <div className="flex gap-x-2 items-center text-sm">
                      <Grip className="h-5 w-5 mr-2 cursor-pointer" />
                      {chapter.title}
                    </div>
                    <div className="flex gap-x-2">
                      <Badge
                        variant={
                          chapter.isPublished ? "destructive" : "default"
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
