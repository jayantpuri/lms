"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";
interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}
const TextEditor = ({ value, onChange }: TextEditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return <ReactQuill theme="snow" value={value} onChange={onChange} />;
};

export default TextEditor;
