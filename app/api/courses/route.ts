import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
export async function POST(request: Request) {
  const { title } = await request.json();
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unautharized", { status: 401 });

    const course = await db.course.create({
      data: {
        title: title,
        userId: userId,
      },
    });

    return NextResponse.json(course, { status: 200 });

  } catch (error) {
    console.log("[COURSE_CREATE_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
