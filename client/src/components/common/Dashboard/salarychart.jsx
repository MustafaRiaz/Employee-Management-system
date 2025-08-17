import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const SalaryChart = ({ employeeId = null }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        let url = employeeId
          ? `/api/salaries/employee/${employeeId}`
          : `/api/salaries/all`;

        const res = await axios.get(url);
        const salaries = res.data || [];

        // Group salaries by due month
        const grouped = {};
        salaries.forEach((salary) => {
          const monthName = new Date(salary.duedate).toLocaleString("default", {
            month: "long",
          });

          if (!grouped[monthName]) {
            grouped[monthName] = { SalariesPaid: 0, SalariesPending: 0 };
          }

          if (salary.status === "Paid") {
            grouped[monthName].SalariesPaid += salary.netpay;
          } else {
            grouped[monthName].SalariesPending += salary.netpay;
          }
        });

        const data = Object.keys(grouped).map((month) => ({
          month,
          ...grouped[month],
        }));

        setChartData(data);
      } catch (error) {
        console.error("Error fetching salaries:", error);
      }
    };

    fetchSalaries();
  }, [employeeId]);

  const chartConfig = {
    paid: {
      label: "Salaries Paid",
      color: "hsl(var(--chart-1))",
    },
    pending: {
      label: "Salaries Pending",
      color: "hsl(var(--chart-2))",
    },
  };

  let trendingUp = 0;
  if (chartData.length >= 2) {
    const last = chartData[chartData.length - 1];
    const prev = chartData[chartData.length - 2];
    if (
      typeof last.SalariesPaid === "number" &&
      typeof prev.SalariesPaid === "number" &&
      prev.SalariesPaid !== 0
    ) {
      const difference = last.SalariesPaid - prev.SalariesPaid;
      trendingUp = Math.round((difference * 100) / prev.SalariesPaid);
    }
  }

  return (
    <div className="salary-container flex flex-col min-[250px]:gap-3 sm:gap-1 h-auto">
      <div className="heading px-2 my-2 min-[250px]:px-3">
        <h1 className="min-[250px]:text-xl xl:text-3xl font-bold min-[250px]:text-center sm:text-start">
          Salary Chart
        </h1>
      </div>
      <Card className="mx-2">
        <CardHeader>
          <CardTitle className="min-[250px]:text-xs sm:text-md md:text-lg lg:text-xl">
            Last Month Salaries Paid:{" "}
            {chartData.length > 0
              ? chartData[chartData.length - 1]?.SalariesPaid ?? 0
              : 0}
          </CardTitle>
          <CardDescription className="min-[250px]:text-xs sm:text-md md:text-lg lg:text-xl">
            Salaries Trend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" className="p-2" />}
                className="p-[2px] flex gap-1 items-center min-[250px]:text-xs sm:text-xs"
              />
              <Area
                dataKey="SalariesPaid"
                type="monotone"
                fill={chartConfig.paid.color}
                fillOpacity={0.4}
                stroke={chartConfig.paid.color}
                stackId="a"
              />
              <Area
                dataKey="SalariesPending"
                type="monotone"
                fill={chartConfig.pending.color}
                fillOpacity={0.4}
                stroke={chartConfig.pending.color}
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending up by {trendingUp}% this month
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                {chartData.length > 0
                  ? `${chartData[0]?.month ?? "N/A"} 2024 - ${
                      chartData[chartData.length - 1]?.month ?? "N/A"
                    } 2024`
                  : null}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
