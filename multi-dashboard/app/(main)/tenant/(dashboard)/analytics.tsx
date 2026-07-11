"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  ComposedChart,
  Scatter,
  ScatterChart,
  ZAxis,
  XAxis,
  YAxis
} from "recharts";
import {
  Calendar,
  Users,
  Award,
  HeartPulse,
  TrendingUp,
  TrendingDown,
  Store,
  Star,
  Activity,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

// ============================================================================
// DATA SETS (Tenant Client Focused)
// ============================================================================

const performanceTimelineData = [
  { month: "Jan", reviews: 45, appointments: 320, leads: 150 },
  { month: "Feb", reviews: 52, appointments: 380, leads: 180 },
  { month: "Mar", reviews: 61, appointments: 410, leads: 220 },
  { month: "Apr", reviews: 58, appointments: 390, leads: 210 },
  { month: "May", reviews: 73, appointments: 460, leads: 280 },
  { month: "Jun", reviews: 89, appointments: 520, leads: 340 }
];

const customerGrowthData = [
  {
    segment: "Consultations",
    newClients: 450,
    returningClients: 800,
    satisfactionScore: 92
  },
  {
    segment: "Standard Service",
    newClients: 320,
    returningClients: 950,
    satisfactionScore: 88
  },
  {
    segment: "Premium Service",
    newClients: 150,
    returningClients: 420,
    satisfactionScore: 96
  },
  {
    segment: "Follow-ups",
    newClients: 50,
    returningClients: 600,
    satisfactionScore: 85
  }
];

const interactionChannelsData = [
  { metric: "Bookings", organic: 450, paidAds: 120, referrals: 80 },
  { metric: "Inquiries", organic: 320, paidAds: 250, referrals: 40 },
  { metric: "Reviews", organic: 180, paidAds: 0, referrals: 95 },
  { metric: "Loyalty Signups", organic: 210, paidAds: 50, referrals: 150 }
];

const leadSourceDistribution = [
  { name: "Google Search", value: 4500, fill: "var(--color-chart-1)" },
  { name: "Social Media", value: 2800, fill: "var(--color-chart-2)" },
  { name: "Direct/Walk-in", value: 1200, fill: "var(--color-chart-3)" },
  { name: "Word of Mouth", value: 900, fill: "var(--color-chart-4)" }
];

const monthlyGoalsData = [
  { name: "Revenue Goal", value: 85, fill: "var(--color-chart-1)" },
  { name: "New Clients", value: 92, fill: "var(--color-chart-2)" },
  { name: "5-Star Reviews", value: 68, fill: "var(--color-chart-3)" },
  { name: "Retention Rate", value: 88, fill: "var(--color-chart-4)" }
];

const peakOperatingHoursData = [
  { hour: 9, avgServiceTime: 45, totalCustomers: 12 },
  { hour: 11, avgServiceTime: 30, totalCustomers: 28 },
  { hour: 13, avgServiceTime: 40, totalCustomers: 35 },
  { hour: 15, avgServiceTime: 60, totalCustomers: 18 },
  { hour: 17, avgServiceTime: 35, totalCustomers: 42 },
  { hour: 19, avgServiceTime: 25, totalCustomers: 15 }
];

// ============================================================================
// CHART CONFIGURATIONS
// ============================================================================

const tenantChartConfig = {
  // Core Metrics
  reviews: { label: "New Reviews", icon: Star, color: "var(--color-chart-1)" },
  appointments: {
    label: "Appointments",
    icon: Calendar,
    color: "var(--color-chart-2)"
  },
  leads: { label: "New Leads", icon: Users, color: "var(--color-chart-3)" },

  // Growth vs Retention
  newClients: {
    label: "New Clients",
    icon: TrendingUp,
    color: "var(--color-chart-2)"
  },
  returningClients: {
    label: "Returning",
    icon: Activity,
    color: "var(--color-muted)"
  },
  satisfactionScore: {
    label: "Satisfaction (%)",
    icon: HeartPulse,
    color: "var(--color-primary)"
  },

  // Channels
  organic: { label: "Organic Search", color: "var(--color-chart-1)" },
  paidAds: { label: "Paid Ads", color: "var(--color-chart-2)" },
  referrals: { label: "Referrals", color: "var(--color-chart-3)" },

  // Scatter
  avgServiceTime: { label: "Avg Time (mins)", color: "var(--color-chart-5)" }
} satisfies ChartConfig;

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Card = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "bg-card border-border flex flex-col gap-4 rounded-xl border p-6 shadow-sm",
      className
    )}
  >
    {children}
  </div>
);

const MetricBadge = ({
  value,
  trend
}: {
  value: string;
  trend: "up" | "down" | "neutral";
}) => (
  <div
    className={cn(
      "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
      trend === "up" && "bg-primary/10 text-primary border-primary/20",
      trend === "down" &&
        "bg-destructive/10 text-destructive border-destructive/20",
      trend === "neutral" && "bg-muted text-muted-foreground border-border"
    )}
  >
    {trend === "up" && <TrendingUp className="h-3 w-3" />}
    {trend === "down" && <TrendingDown className="h-3 w-3" />}
    {value}
  </div>
);

// ============================================================================
// MAIN PAGE LAYOUT
// ============================================================================

export function AnalyticsDashboard() {
  return (
    <div className="bg-background flex min-h-screen flex-col gap-8 p-4 md:p-8 xl:p-10">
      {/* HEADER SECTION */}
      <div className="border-border flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Store className="text-primary h-6 w-6" />
            </div>
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
              Tenant Overview
            </span>
          </div>
          <h1 className="text-foreground text-4xl font-black tracking-tighter">
            Performance Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Track your daily appointments, customer engagement, revenue growth,
            and overall tenant health in one centralized view.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <ArrowUpRight className="size-4" />
            Export Matrix
          </Button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {[
          { label: "Total Revenue", val: "$24,500", trend: "up", tVal: "+12%" },
          { label: "Appointments", val: "520", trend: "up", tVal: "+8.4%" },
          { label: "Avg Rating", val: "4.8", trend: "up", tVal: "+0.2" },
          { label: "Cancellations", val: "14", trend: "down", tVal: "-5%" },
          { label: "Active Leads", val: "340", trend: "up", tVal: "+18%" },
          {
            label: "Loyalty Members",
            val: "1,204",
            trend: "neutral",
            tVal: "0%"
          }
        ].map((kpi, i) => (
          <Card key={i} className="gap-2 p-4">
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              {kpi.label}
            </span>
            <div className="text-foreground text-2xl font-black tracking-tight">
              {kpi.val}
            </div>
            <div className="border-border mt-auto border-t pt-2">
              <MetricBadge value={kpi.tVal} trend={kpi.trend as any} />
            </div>
          </Card>
        ))}
      </div>

      {/* MAIN DATA ROW 1: Area & Stacked Bar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Area Chart: Core Trends */}
        <Card className="lg:col-span-4">
          <div>
            <h2 className="text-foreground text-lg font-bold tracking-tight">
              Growth Trends
            </h2>
            <p className="text-muted-foreground text-xs">
              Monthly progression of your key tenant drivers.
            </p>
          </div>
          <ChartContainer config={tenantChartConfig} className="h-80 w-full">
            <AreaChart
              data={performanceTimelineData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)" }}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="appointments"
                stackId="1"
                stroke="var(--color-appointments)"
                fill="var(--color-appointments)"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stackId="1"
                stroke="var(--color-leads)"
                fill="var(--color-leads)"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="reviews"
                stackId="1"
                stroke="var(--color-reviews)"
                fill="var(--color-reviews)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        </Card>

        {/* Stacked Bar: Interaction Channels */}
        <Card className="lg:col-span-3">
          <div>
            <h2 className="text-foreground text-lg font-bold tracking-tight">
              Customer Acquisition Channels
            </h2>
            <p className="text-muted-foreground text-xs">
              How customers are finding and interacting with you.
            </p>
          </div>
          <ChartContainer config={tenantChartConfig} className="h-80 w-full">
            <BarChart
              data={interactionChannelsData}
              layout="vertical"
              margin={{ left: -10, right: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="var(--color-border)"
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                dataKey="metric"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="organic"
                stackId="a"
                fill="var(--color-organic)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="paidAds"
                stackId="a"
                fill="var(--color-paidAds)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="referrals"
                stackId="a"
                fill="var(--color-referrals)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        </Card>
      </div>

      {/* DATA ROW 2: Multi-Dimensional */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Composed Chart: Client Growth & Satisfaction */}
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-foreground text-lg font-bold tracking-tight">
                Client Retention & Satisfaction
              </h2>
              <p className="text-muted-foreground text-xs">
                Comparing new vs. returning clients alongside their satisfaction
                score per service.
              </p>
            </div>
            <Award className="text-chart-1 h-5 w-5" />
          </div>
          <ChartContainer config={tenantChartConfig} className="h-72 w-full">
            <ComposedChart data={customerGrowthData} margin={{ top: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="segment"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                yAxisId="left"
                dataKey="returningClients"
                fill="var(--color-returningClients)"
                radius={[4, 4, 0, 0]}
                fillOpacity={0.2}
              />
              <Bar
                yAxisId="left"
                dataKey="newClients"
                fill="var(--color-newClients)"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="satisfactionScore"
                stroke="var(--color-satisfactionScore)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--color-background)", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ChartContainer>
        </Card>

        {/* Radar: Tenant Strengths */}
        <Card>
          <div>
            <h2 className="text-foreground text-lg font-bold tracking-tight">
              Tenant Strengths
            </h2>
            <p className="text-muted-foreground text-xs">
              Overview of where your marketing excels.
            </p>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <ChartContainer config={tenantChartConfig} className="h-72 w-full">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="65%"
                data={interactionChannelsData}
              >
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 500]}
                  tick={{ fontSize: 8, fill: "var(--color-muted-foreground)" }}
                />
                <Radar
                  name="Organic Growth"
                  dataKey="organic"
                  stroke="var(--color-organic)"
                  fill="var(--color-organic)"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Paid Efforts"
                  dataKey="paidAds"
                  stroke="var(--color-paidAds)"
                  fill="var(--color-paidAds)"
                  fillOpacity={0.5}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ChartContainer>
          </div>
        </Card>
      </div>

      {/* DATA ROW 3: Advanced Visualizations */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Radial: Monthly Goals */}
        <Card>
          <div>
            <h2 className="text-foreground text-lg font-bold tracking-tight">
              Monthly Goals
            </h2>
            <p className="text-muted-foreground text-xs">
              Current progress vs targets.
            </p>
          </div>
          <div className="-mt-4 flex flex-1 items-center justify-center">
            <ChartContainer config={tenantChartConfig} className="h-56 w-full">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="100%"
                barSize={12}
                data={monthlyGoalsData}
              >
                <PolarGrid stroke="none" />
                <RadialBar
                  background={{ fill: "var(--color-muted)" }}
                  dataKey="value"
                  cornerRadius={10}
                />
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="name" />}
                />
              </RadialBarChart>
            </ChartContainer>
          </div>
          <div className="border-border grid grid-cols-2 gap-y-2 border-t pt-4 text-xs">
            {monthlyGoalsData.map((d) => (
              <div key={d.name} className="flex flex-col">
                <span className="text-muted-foreground">{d.name}</span>
                <span className="text-foreground font-bold">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Scatter Matrix: Peak Hours */}
        <Card className="md:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-foreground text-lg font-bold tracking-tight">
                Peak Operating Hours
              </h2>
              <p className="text-muted-foreground text-xs">
                Time of day vs. average appointment duration and customer
                volume.
              </p>
            </div>
            <Clock className="text-muted-foreground h-5 w-5" />
          </div>
          <ChartContainer config={tenantChartConfig} className="h-64 w-full">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                type="number"
                dataKey="hour"
                name="Time (24h)"
                unit="h"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                type="number"
                dataKey="avgServiceTime"
                name="Duration"
                unit="m"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)" }}
              />
              <ZAxis
                type="number"
                dataKey="totalCustomers"
                range={[50, 400]}
                name="Customers"
              />
              <ChartTooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<ChartTooltipContent />}
              />
              <Scatter
                name="Activity"
                data={peakOperatingHoursData}
                fill="var(--color-chart-5)"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ChartContainer>
        </Card>

        {/* Donut: Lead Sources */}
        <Card>
          <div>
            <h2 className="text-foreground text-lg font-bold tracking-tight">
              Lead Sources
            </h2>
            <p className="text-muted-foreground text-xs">
              Where your tenant comes from.
            </p>
          </div>
          <div className="relative flex min-h-48 flex-1 items-center justify-center">
            <ChartContainer config={tenantChartConfig} className="h-48 w-full">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="name" />}
                />
                <Pie
                  data={leadSourceDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {leadSourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
