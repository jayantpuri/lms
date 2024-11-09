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
      include: {
        muxData: true
      }
    });

    if (
      !chapter ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl ||
      !chapter.muxData
    ) {
      return new NextResponse("Not all fields are filled", { status: 400 });
    }

    const publishChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishChapter);

  } catch (error) {
    console.log("[Chapter_Publish_error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
