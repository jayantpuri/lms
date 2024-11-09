import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export const PATCH = async (
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

    const publishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course.chapters ||
      !publishedChapter ||
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.price ||
      !course.categoryId
    ) {
      return new NextResponse("Not all fields are filled", { status: 400 });
    }

    const publishCourse = await db.course.update({
      where: {
        id: courseId,
        userId: userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishCourse);
  } catch (error) {
    console.log("[Chapter_Publish_error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
