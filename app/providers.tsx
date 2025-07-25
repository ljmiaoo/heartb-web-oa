"use client";

import * as React from "react";
import { SWRConfig } from "swr";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const getUrl = (url: string) => {
  const path = `${process.env.NEXT_PUBLIC_BASE_PATH || "/"}${url}`.replace(
    "//",
    "/",
  );

  return path;
};

const fetcher = (...args: Parameters<typeof fetch>) => {
  if (typeof args[0] === "string") {
    args[0] = getUrl(args[0]);
  }

  return fetch.apply(this, args).then((res) => {
    if (res.headers.get("content-type")?.includes("application/json")) {
      return res.json();
    }

    return res.text();
  });
};

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <SWRConfig value={{ fetcher }}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </SWRConfig>
    </NextUIProvider>
  );
}
