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
  MessageSquare,
  Calendar,
  Users,
  CreditCard,
  HeartPulse,
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  Target,
  Activity,
  Zap,
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
// DATA SETS (Expanded for high-density rendering)
// ============================================================================

const timelineData = [
  { month: "Jan", reviews: 310, appts: 2450, crm: 1850, ai: 310 },
  { month: "Feb", reviews: 330, appts: 2610, crm: 1920, ai: 340 },
  { month: "Mar", reviews: 360, appts: 2980, crm: 2100, ai: 420 },
  { month: "Apr", reviews: 380, appts: 2840, crm: 2240, ai: 490 },
  { month: "May", reviews: 410, appts: 3210, crm: 2480, ai: 560 },
  { month: "Jun", reviews: 460, appts: 3670, crm: 2710, ai: 680 }
];

const healthVsEngagementData = [
  { segment: "Enterprise", usage: 8500, capacity: 10000, score: 92 },
  { segment: "Mid-Market", usage: 6200, capacity: 8000, score: 85 },
  { segment: "SMBs", usage: 4100, capacity: 5500, score: 78 },
  { segment: "Startups", usage: 2900, capacity: 3000, score: 95 },
  { segment: "Freelancers", usage: 1100, capacity: 1500, score: 65 }
];

const structuralMapData = [
  { tag: "GMB Reviews", tenant: 5400, staff: 100, customer: 3400 },
  { tag: "Appointments", tenant: 3200, staff: 3800, customer: 2500 },
  { tag: "CRM", tenant: 6500, staff: 2500, customer: 200 },
  { tag: "Billing", tenant: 5000, staff: 500, customer: 2500 },
  { tag: "Loyalty", tenant: 4000, staff: 1000, customer: 4500 }
];

const portalDistribution = [
  { name: "Admin Portal", value: 8400, fill: "var(--color-admin)" },
  { name: "Tenant Owner", value: 43200, fill: "var(--color-tenant)" },
  { name: "Staff Access", value: 62100, fill: "var(--color-staff)" },
  { name: "Client Portal", value: 65400, fill: "var(--color-customer)" }
];

const radialTargetsData = [
  { name: "Revenue", value: 85, fill: "var(--color-chart-1)" },
  { name: "Retention", value: 92, fill: "var(--color-chart-2)" },
  { name: "Acquisition", value: 68, fill: "var(--color-chart-3)" },
  { name: "Uptime", value: 99, fill: "var(--color-chart-4)" }
];

const sessionScatterData = [
  { hour: 8, duration: 120, customers: 400 },
  { hour: 10, duration: 300, customers: 850 },
  { hour: 12, duration: 150, customers: 600 },
  { hour: 14, duration: 450, customers: 1200 },
  { hour: 16, duration: 200, customers: 900 },
  { hour: 19, duration: 60, customers: 300 },
  { hour: 22, duration: 30, customers: 150 }
];

// ============================================================================
// CHART CONFIGURATIONS
// ============================================================================

const systemChartConfig = {
  // Core Tags
  reviews: {
    label: "GMB Reviews",
    icon: MessageSquare,
    color: "var(--color-chart-1)"
  },
  appts: {
    label: "Appointments",
    icon: Calendar,
    color: "var(--color-chart-2)"
  },
  crm: { label: "CRM Pipeline", icon: Users, color: "var(--color-chart-3)" },
  billing: {
    label: "Billing",
    icon: CreditCard,
    color: "var(--color-chart-4)"
  },
  ai: {
    label: "AI Insights",
    icon: BrainCircuit,
    color: "var(--color-chart-5)"
  },

  // Mixed Metrics
  score: {
    label: "Health Score",
    icon: HeartPulse,
    color: "var(--color-primary)"
  },
  usage: { label: "Volume", icon: Activity, color: "var(--color-chart-2)" },
  capacity: { label: "Capacity", icon: Target, color: "var(--color-muted)" },

  // Portals
  admin: { label: "Admin", color: "var(--color-chart-1)" },
  tenant: { label: "Tenant", color: "var(--color-chart-2)" },
  staff: { label: "Staff", color: "var(--color-chart-3)" },
  customer: { label: "Client", color: "var(--color-chart-4)" },

  // Scatter
  duration: { label: "Avg Session (s)", color: "var(--color-chart-5)" }
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
    <div className="bg-background flex flex-col gap-8 p-4 md:p-8">
      {/* HEADER SECTION */}
      <div className="border-border flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <LayoutDashboard className="text-primary h-6 w-6" />
            </div>
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
              Enterprise Engine
            </span>
          </div>
          <h1 className="text-foreground text-4xl font-black tracking-tighter">
            Platform Telemetry
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            High-density observational matrix detailing systemic throughput,
            multi-tenant portal weights, feature utilization, and algorithmic
            health scores across all active operational nodes.
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
          { label: "Active Nodes", val: "14,209", trend: "up", tVal: "+12%" },
          { label: "Throughput/s", val: "842 mb", trend: "up", tVal: "+5.1%" },
          {
            label: "Sys Error Rate",
            val: "0.04%",
            trend: "down",
            tVal: "-1.2%"
          },
          { label: "Avg Latency", val: "42 ms", trend: "neutral", tVal: "0%" },
          { label: "AI Inferences", val: "1.2M", trend: "up", tVal: "+44%" },
          { label: "Global MRR", val: "$4.2M", trend: "up", tVal: "+8%" }
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
        {/* Area Chart: System Loads */}
        <Card className="lg:col-span-4">
          <div>
            <h2 className="text-foreground text-lg font-bold tracking-tight">
              Aggregated Subsystem Loads
            </h2>
            <p className="text-muted-foreground text-xs">
              Timeline density of core architectural tags.
            </p>
          </div>
          <ChartContainer config={systemChartConfig} className="h-87.5 w-full">
            <AreaChart
              data={timelineData}
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
                dataKey="appts"
                stackId="1"
                stroke="var(--color-appts)"
                fill="var(--color-appts)"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="crm"
                stackId="1"
                stroke="var(--color-crm)"
                fill="var(--color-crm)"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="ai"
                stackId="1"
                stroke="var(--color-ai)"
                fill="var(--color-ai)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        </Card>

        {/* Stacked Bar: Feature Maps */}
        <Card className="lg:col-span-3">
          <div>
            <h2 className="text-foreground text-lg font-bold tracking-tight">
              Portal Structuring
            </h2>
            <p className="text-muted-foreground text-xs">
              Role-based consumption distribution.
            </p>
          </div>
          <ChartContainer config={systemChartConfig} className="h-87.5 w-full">
            <BarChart
              data={structuralMapData}
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
                dataKey="tag"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="tenant"
                stackId="a"
                fill="var(--color-tenant)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="staff"
                stackId="a"
                fill="var(--color-staff)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="customer"
                stackId="a"
                fill="var(--color-customer)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        </Card>
      </div>

      {/* DATA ROW 2: Multi-Dimensional (Composed, Radar, Donut) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Composed Chart: Health vs Capacity */}
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-foreground text-lg font-bold tracking-tight">
                Infrastructure Health vs Scale
              </h2>
              <p className="text-muted-foreground text-xs">
                Mapping subsystem usage against max rated capacity and resultant
                health scores.
              </p>
            </div>
            <Zap className="text-chart-1 h-5 w-5" />
          </div>
          <ChartContainer config={systemChartConfig} className="h-70 w-full">
            <ComposedChart data={healthVsEngagementData} margin={{ top: 20 }}>
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
                dataKey="capacity"
                fill="var(--color-capacity)"
                radius={[4, 4, 0, 0]}
                fillOpacity={0.2}
              />
              <Bar
                yAxisId="left"
                dataKey="usage"
                fill="var(--color-usage)"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="score"
                stroke="var(--color-score)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--color-background)", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ChartContainer>
        </Card>

        {/* Radar: AI vs Competitor Map */}
        <Card>
          <div>
            <h2 className="text-foreground text-lg font-bold tracking-tight">
              Capability Radar
            </h2>
            <p className="text-muted-foreground text-xs">
              Vector mapping of features.
            </p>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <ChartContainer config={systemChartConfig} className="h-70 w-full">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="65%"
                data={structuralMapData}
              >
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis
                  dataKey="tag"
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 8000]}
                  tick={{ fontSize: 8, fill: "var(--color-muted-foreground)" }}
                />
                <Radar
                  name="Tenant Allocation"
                  dataKey="tenant"
                  stroke="var(--color-tenant)"
                  fill="var(--color-tenant)"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Staff Routines"
                  dataKey="staff"
                  stroke="var(--color-staff)"
                  fill="var(--color-staff)"
                  fillOpacity={0.5}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ChartContainer>
          </div>
        </Card>
      </div>

      {/* DATA ROW 3: Advanced Visualizations (Radial, Scatter, Pie) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Radial Goals */}
        <Card>
          <div>
            <h2 className="text-foreground text-lg font-bold tracking-tight">
              Target Saturation
            </h2>
            <p className="text-muted-foreground text-xs">Completion limits.</p>
          </div>
          <div className="-mt-4 flex flex-1 items-center justify-center">
            <ChartContainer config={systemChartConfig} className="h-55 w-full">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="100%"
                barSize={12}
                data={radialTargetsData}
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
            {radialTargetsData.map((d) => (
              <div key={d.name} className="flex flex-col">
                <span className="text-muted-foreground">{d.name}</span>
                <span className="text-foreground font-bold">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Scatter Matrix: Session Analytics */}
        <Card className="md:col-span-2">
          <div>
            <h2 className="text-foreground text-lg font-bold tracking-tight">
              Session Temporal Matrix
            </h2>
            <p className="text-muted-foreground text-xs">
              Time of day (Hour) vs Avg Session Duration mapped by customer
              density (Bubble size).
            </p>
          </div>
          <ChartContainer config={systemChartConfig} className="h-62.5 w-full">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                type="number"
                dataKey="hour"
                name="Hour"
                unit="h"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                type="number"
                dataKey="duration"
                name="Duration"
                unit="s"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)" }}
              />
              <ZAxis
                type="number"
                dataKey="customers"
                range={[50, 400]}
                name="Volume"
              />
              <ChartTooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<ChartTooltipContent />}
              />
              <Scatter
                name="Sessions"
                data={sessionScatterData}
                fill="var(--color-chart-5)"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ChartContainer>
        </Card>

        {/* Portal Weights Donut */}
        <Card>
          <div>
            <h2 className="text-foreground text-lg font-bold tracking-tight">
              Portal Weights
            </h2>
            <p className="text-muted-foreground text-xs">Total volume split.</p>
          </div>
          <div className="relative flex min-h-45 flex-1 items-center justify-center">
            <ChartContainer config={systemChartConfig} className="h-45 w-full">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="name" />}
                />
                <Pie
                  data={portalDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {portalDistribution.map((entry, index) => (
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
