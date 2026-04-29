import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useStats } from "@/hooks/useStats";
import { formatCurrency } from "@/lib/utils";
import { Download } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#FFC107", "#D32F2F", "#27AE60", "#3498DB", "#9B59B6"];

function renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, fill }:
  { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number; name: string; fill: string }) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} fill={fill} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
}

export default function StatsPage() {
  const { resolved } = useThemeMode();
  const isDark = resolved === "dark";
  const labelColor = isDark ? "#e6e6e6" : "#2C3E50";
  const { summary, revenue7Days, revenue30Days, byQuartier, byStatus } = useStats();
  const [period, setPeriod] = useState("7");

  const chartData = period === "7" ? revenue7Days : revenue30Days;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-bold">Statistiques</h1>
        <Button variant="outline" size="sm" className="self-start sm:self-auto">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Export CSV</span>
        </Button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-xs sm:text-sm text-muted-foreground">Période :</span>
        <Select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-36 sm:w-40">
          <option value="7">7 derniers jours</option>
          <option value="30">30 derniers jours</option>
        </Select>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "CA total", value: formatCurrency(chartData.reduce((s, d) => s + d.ca, 0)) },
          { label: "Nb commandes", value: chartData.reduce((s, d) => s + d.commandes, 0) },
          { label: "Ticket moyen", value: formatCurrency(summary.avgTicket) },
          { label: "En cours", value: summary.inProgress },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-3 sm:p-5">
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{label}</p>
              <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 truncate">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2 sm:pb-6">
          <CardTitle className="text-sm sm:text-base">Chiffre d'affaires ({period} jours)</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="h-[200px] sm:h-[300px]">
            <RevenueChart data={chartData} days={Number(period)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 sm:pb-6">
            <CardTitle className="text-sm sm:text-base">Répartition par quartier</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={byQuartier}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  dataKey="count"
                  nameKey="name"
                  label={(props) => renderPieLabel({ ...props, fill: labelColor })}
                  labelLine={false}
                >
                  {byQuartier.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#171717" : "#fff",
                    border: `1px solid ${isDark ? "#2e2e2e" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    color: isDark ? "#e6e6e6" : "#2C3E50",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-6">
            <CardTitle className="text-sm sm:text-base">Répartition par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={byStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  nameKey="name"
                  label={(props) => renderPieLabel({ ...props, fill: labelColor, innerRadius: 0 })}
                  labelLine={false}
                >
                  {byStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#171717" : "#fff",
                    border: `1px solid ${isDark ? "#2e2e2e" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    color: isDark ? "#e6e6e6" : "#2C3E50",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
