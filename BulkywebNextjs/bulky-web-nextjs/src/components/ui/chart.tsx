"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label: string;
    color?: string;
  }
>;

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
}

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ChartTooltip({ content }: any) {
  return <>{content}</>;
}

export function ChartTooltipContent({ hideLabel }: { hideLabel?: boolean }) {
  return (
    <div className="rounded-md bg-white p-2 shadow-md text-xs">
      {!hideLabel && <div className="font-semibold">Chart Tooltip</div>}
      <div>Value here…</div>
    </div>
  );
}
