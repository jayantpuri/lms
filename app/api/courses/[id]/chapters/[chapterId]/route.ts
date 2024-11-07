import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
const mux = new Mux({
  tokenId: process.env.MUX_ACCESS_TOKEN!,
  tokenSecret: process.env.MUX_SECRET_KEY!,
});
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
    if (updatedChapter.videoUrl && updatedChapter.videoUrl.length > 1) {
      const muxData = await db.muxData.findUnique({
        where: {
          chapterId: updatedChapter.id,
        },
      });
      if (muxData) {
        await mux.video.assets.delete(muxData.assetId);
      }

      const asset = await mux.video.assets.create({
        input: [{ url: updatedChapter.videoUrl }],
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
