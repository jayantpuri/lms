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
    });

    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishCourse = await db.course.update({
      where: {
        id: courseId,
        userId: userId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishCourse);
  } catch (error) {
    console.log("[Chapter_Publish_error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
