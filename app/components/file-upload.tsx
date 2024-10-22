"use client";

import toast from "react-hot-toast";
import { OurFileRouter } from "../api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadThing";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof OurFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error.message}`);
      }}
    />
  );
};
