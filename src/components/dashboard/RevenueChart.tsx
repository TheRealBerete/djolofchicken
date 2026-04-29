import { useThemeMode } from "@/hooks/useThemeMode";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  date: string;
  ca: number;
  commandes: number;
}

export function RevenueChart({ data, days }: { data: ChartData[]; days: number }) {
  const { resolved } = useThemeMode();
  const isDark = resolved === "dark";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2e2e2e" : "#e5e7eb"} />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke={isDark ? "#808080" : "#6b7280"} />
        <YAxis
          tick={{ fontSize: 11 }}
          stroke={isDark ? "#808080" : "#6b7280"}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          width={45}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#171717" : "#fff",
            border: `1px solid ${isDark ? "#2e2e2e" : "#e5e7eb"}`,
            borderRadius: "8px",
            fontSize: "12px",
            color: isDark ? "#e6e6e6" : "#2C3E50",
          }}
          formatter={(value: number) => [`${value.toLocaleString()} GNF`, ""]}
        />
        <Line
          type="monotone"
          dataKey="ca"
          stroke="#FFC107"
          strokeWidth={2}
          dot={{ r: 3, fill: "#FFC107" }}
          name="CA"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
