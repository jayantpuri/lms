import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const getUser = () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
  return { userId };
};

const f = createUploadthing();


export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => getUser())
    .onUploadComplete(() => {}),

  courseAttachment: f(["text", "image", "pdf", "video", "audio"])
    .middleware(() => getUser())
    .onUploadComplete(() => {}),

  chapterVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
    .middleware(() => getUser())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
