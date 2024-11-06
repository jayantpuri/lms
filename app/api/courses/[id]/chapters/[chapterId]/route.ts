import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export const PATCH = async (
  request: Request,
  { params }: { params: { id: string; chapterId: string } }
) => {
  try {
    const { userId } = auth();
    const { id: courseId, chapterId } = params;
    const values = await request.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });
    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(updatedChapter);
    
  } catch (error) {
    console.log("[Chapter_Update_error]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
