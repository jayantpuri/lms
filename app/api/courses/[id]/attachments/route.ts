import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const POST = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const data = await request.json();
    const { userId } = auth();
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

    const attachments = await db.attachment.create({
      data: {
        name: data.url.split("/").pop(),
        url: data.url,
        courseId: id,
      },
    });

    return NextResponse.json(attachments);
  } catch (error) {
    console.log("[COURSE_ATTACHMENTS_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
