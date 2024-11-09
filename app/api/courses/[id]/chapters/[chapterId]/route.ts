import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
const { video } = new Mux({
  tokenId: process.env.MUX_ACCESS_TOKEN,
  tokenSecret: process.env.MUX_SECRET_KEY,
});

// --------------------------------------- Delete chapter ----------------------------------
export const DELETE = async (
  request: Request,
  { params }: { params: { id: string; chapterId: string } }
) => {
  try {
    const { userId } = auth();
    const { id: courseId, chapterId } = params;

    if (!userId) {
      return new NextResponse("unauthorised", { status: 401 });
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

    const chapterMuxData = await db.muxData.findUnique({
      where: {
        chapterId: chapterId,
      },
    });
    if (chapterMuxData && chapterMuxData.assetId) {
      await video.assets.delete(chapterMuxData.assetId);
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    // Check if there are any published chapters in the course
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

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_DELETE_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

// --------------------------------------- Update chapter ----------------------------------
export const PATCH = async (
  request: Request,
  { params }: { params: { id: string; chapterId: string } }
) => {
  try {
    const { userId } = auth();
    const { id: courseId, chapterId } = params;
    const { isPublished, ...values } = await request.json();

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

    // Update chapter video
    if (values.videoUrl) {
      const muxData = await db.muxData.findUnique({
        where: {
          chapterId: updatedChapter.id,
        },
      });
      if (muxData && muxData.assetId) {
        await video.assets.delete(muxData.assetId);
      }
      const asset = await video.assets.create({
        input: [{ url: values.videoUrl }],
        playback_policy: ["public"],
      });

      const updatedMuxData = await db.muxData.upsert({
        create: {
          chapterId: updatedChapter.id,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
        where: {
          chapterId: updatedChapter.id,
        },
        update: {
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.log("[Chapter_Update_error]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
