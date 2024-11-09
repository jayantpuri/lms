import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
const { video } = new Mux({
  tokenId: process.env.MUX_ACCESS_TOKEN,
  tokenSecret: process.env.MUX_SECRET_KEY,
});

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string; chapterId: string } }
) => {
  try {
    const { userId } = auth();
    const { id: courseId, chapterId } = params;

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
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        isPublished: false,
      },
    });

    // Check if this was the only published chapter in the course
    const publishedChapters = await db.chapter.findFirst({
      where: {
        courseId: courseId,
        isPublished: true,
      },
    });

    if (!publishedChapters) {
      await db.course.update({
        where: {
          id: courseId,
          userId: userId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log("[Chapter_Unpublish_error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
