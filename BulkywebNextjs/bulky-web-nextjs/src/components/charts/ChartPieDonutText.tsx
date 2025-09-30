"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Label } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface ChartPieDonutTextProps {
  data: ChartDataItem[];
  title?: string;
  description?: string;
}

export function ChartPieDonutText({ data, title = "Chart", description = "" }: ChartPieDonutTextProps) {
  const total = React.useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <PieChart width={250} height={250}>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={5}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
            <Label
              content={() => (
                <text
                  x={125}
                  y={125}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xl font-bold fill-gray-900"
                >
                  {total}
                </text>
              )}
            />
          </Pie>
        </PieChart>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Total value: {total}
      </CardFooter>
    </Card>
  );
}
