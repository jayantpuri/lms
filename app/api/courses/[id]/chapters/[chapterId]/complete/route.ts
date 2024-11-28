import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export const PUT = async (
  request: Request,
  { params }: { params: { id: string; chapterId: string } }
) => {
  try {
    const { userId } = auth();
    const { isCompleted } = await request.json();
    const { id: courseId, chapterId } = params;
    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });
    if (!chapter) {
      return new NextResponse("chapter not found", { status: 404 });
    }

    const updateChapter = await db.userProgress.upsert({
      create: {
        chapterId: chapterId,
        isCompleted: isCompleted,
        userId: userId,
      },
      where: {
        chapterId_userId: {
          chapterId: chapterId,
          userId: userId,
        },
      },
      update: {
        isCompleted: isCompleted,
      },
    });

    return NextResponse.json(updateChapter);
  } catch (error) {
    console.log("[COMPLETE_CHAPTER_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
