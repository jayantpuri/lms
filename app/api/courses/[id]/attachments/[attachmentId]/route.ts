import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
export const DELETE = async (
  request: Request,
  { params }: { params: { id: string; attachmentId: string } }
) => {
  try {
    const { userId } = auth();
    const { id, attachmentId } = params;
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

    const updatedAttachments = await db.attachment.delete({
      where: {
        id: attachmentId,
        courseId: id,
      },
    });

    return NextResponse.json(updatedAttachments);
  } catch (error) {
    console.log("[DELETE_ATTACHMENT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
