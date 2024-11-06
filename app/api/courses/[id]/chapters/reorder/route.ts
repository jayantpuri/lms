import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { stat } from "fs";

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { userId } = auth();
    const list = await request.json();
    const { id } = params;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const course = await db.course.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    let updatedChapters;
    for (let ch of list) {
      updatedChapters = await db.chapter.update({
        where: {
          id: ch.id,
        },
        data: {
          position: ch.position,
        },
      });
    }

    return NextResponse.json({ status: 200 });

  } catch (error) {
    console.log("[CHAPTER_REORDER_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
