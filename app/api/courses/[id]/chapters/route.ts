import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const POST = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { userId } = auth();
    const { chapterTitle } = await request.json();
    const { id } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }
    const course = await db.course.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: id,
      },
      orderBy: {
        position: "desc",
      },
    });

    const position = lastChapter ? lastChapter.position + 1 : 1;

    const newChapter = await db.chapter.create({
      data: {
        courseId: id,
        title: chapterTitle,
        position: position,
        isFree: false,
        isPublished: false,
      },
    });

    return NextResponse.json(newChapter);
  } catch (error) {
    console.log("[CHAPTER CREATE ERROR]", error);
    return new NextResponse("error creating chapter", { status: 500 });
  }
};
