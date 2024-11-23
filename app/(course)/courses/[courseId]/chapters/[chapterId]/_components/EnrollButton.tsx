"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { priceFormat } from "@/lib/priceFormatter";
import toast from "react-hot-toast";
import { set } from "zod";
import axios from "axios";

interface EnrollButtonProps {
  price: number;
  courseId: string;
}
const EnrollButton = ({ price, courseId }: EnrollButtonProps) => {
  const [loading, setLoading] = useState(false);
  const buyCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      window.location.assign(response.data.url);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button onClick={() => buyCourse()} variant={"default"} size={"sm"}>
      Enroll for {priceFormat(price)}
    </Button>
  );
};

export default EnrollButton;
