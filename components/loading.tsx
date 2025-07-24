"use client";

import { Icon } from "@iconify/react";
import { PropsWithChildren } from "react";

import { cn } from "./cn";

export function Loading({
  children,
  loading = true,
}: PropsWithChildren<{ loading?: boolean }>) {
  return (
    <div className="relative">
      <div
        className={cn(
          "absolute left-0 top-0 z-50 h-full w-full bg-white/50 dark:bg-black/50",
          loading ? "visible" : "hidden",
        )}
      >
        <div className="flex h-full max-h-screen w-full items-center justify-center">
          <Icon
            className="text-default-500 animate-spin"
            icon="ant-design:loading-3-quarters-outlined"
            width={32}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
