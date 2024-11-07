import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LucideIcon, AlertTriangle, CheckCircleIcon } from "lucide-react";

const publishVariants = cva(
  "w-full flex items-center gap-x-4 border text-center p-4 text-sm rounded-md",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-primary",
        success: "bg-emerald-700 border-emerald-800 text-secondary",
      },
      default: {
        variant: "warning",
      },
    },
  }
);

interface bannerVariantProps extends VariantProps<typeof publishVariants> {
  label: string;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

const PublishBanner = ({ label, variant }: bannerVariantProps) => {
  const Icon: LucideIcon = iconMap[variant || "warning"];
  return (
    <div className={cn(publishVariants({ variant }))}>
      <Icon className="w-4 h-4" />
      {label}
    </div>
  );
};

export default PublishBanner;
