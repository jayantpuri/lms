"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { priceFormat } from "@/lib/priceFormatter";

interface EnrollButtonProps {
    price: number;
}
const EnrollButton = ({ price }: EnrollButtonProps) => {
  return (
    <Button variant={"default"} size={"sm"}>
      Enroll for {priceFormat(price)}
    </Button>
  );
};

export default EnrollButton;
