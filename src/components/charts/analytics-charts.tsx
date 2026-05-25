"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { GlassCard } from "@/components/ui/glass-card";

interface Props {
  series: Array<{
    name: string;
    views: number;
    likes: number;
    engagement: number;
    sentiment: number;
  }>;
}

export function AnalyticsCharts({ series }: Props) {
  return (
    <div className="grid gap-6">
      <GlassCard className="p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
          Performa publish — views &amp; likes
        </p>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={series}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D9488" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#0D9488" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="likesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E89422" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#E89422" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="currentColor" opacity={0.08} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.55 }}
                stroke="currentColor"
                strokeOpacity={0.15}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.55 }}
                stroke="currentColor"
                strokeOpacity={0.15}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--glass-thick-bg)",
                  borderRadius: 16,
                  border: "1px solid var(--glass-border)",
                  fontSize: 12,
                  backdropFilter: "blur(24px) saturate(180%)",
                  color: "var(--foreground)",
                }}
                cursor={{ stroke: "currentColor", strokeOpacity: 0.15 }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#0D9488"
                strokeWidth={2}
                fill="url(#viewsFill)"
              />
              <Area
                type="monotone"
                dataKey="likes"
                stroke="#E89422"
                strokeWidth={2}
                fill="url(#likesFill)"
              />
              <Legend
                wrapperStyle={{ fontSize: 11, opacity: 0.7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
          Sentiment per konten (-100 buruk → +100 positif)
        </p>
        <div className="mt-4 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={series}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 6" stroke="currentColor" opacity={0.08} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.55 }}
                stroke="currentColor"
                strokeOpacity={0.15}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.55 }}
                stroke="currentColor"
                strokeOpacity={0.15}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--glass-thick-bg)",
                  borderRadius: 16,
                  border: "1px solid var(--glass-border)",
                  fontSize: 12,
                  backdropFilter: "blur(24px) saturate(180%)",
                  color: "var(--foreground)",
                }}
                cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
              />
              <Bar
                dataKey="sentiment"
                radius={[8, 8, 8, 8]}
                fill="#0D9488"
                fillOpacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}
