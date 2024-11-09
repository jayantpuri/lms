import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

import Mux from "@mux/mux-node";
const { video } = new Mux({
  tokenId: process.env.MUX_ACCESS_TOKEN,
  tokenSecret: process.env.MUX_SECRET_KEY,
});

// --------------------------------------- Delete course ----------------------------------
export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { userId } = auth();
    const { id: courseId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { chapters } = course;
    for (let chapter of chapters) {
      if (chapter.muxData && chapter.muxData.assetId) {
        video.assets.delete(chapter.muxData.assetId);
      }
    }
    const deletedCourse = await db.course.delete({
      where: {
        userId: userId,
        id: courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSES_DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

// --------------------------------------- Update course ----------------------------------
export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const values = await request.json();
  try {
    const { userId } = auth();
    const { id } = params;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[Course_Update_error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
