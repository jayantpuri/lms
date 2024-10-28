import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

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
