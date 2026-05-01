import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { useStats } from "@/hooks/useStats";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingUp, DollarSign, Clock, ShoppingCart } from "lucide-react";

export default function DashboardPage() {
  const { summary, revenue7Days, topProducts, recentOrders, loading } = useStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  const statsCards = [
    { label: "Commandes aujourd'hui", value: summary.todayOrders, icon: ShoppingCart },
    { label: "CA aujourd'hui", value: formatCurrency(summary.todayCA), icon: DollarSign },
    { label: "En cours", value: summary.inProgress, icon: Clock },
    { label: "Ticket moyen", value: formatCurrency(summary.avgTicket), icon: TrendingUp },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {statsCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-3 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{label}</p>
                  <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 truncate">{value}</p>
                </div>
                <div className="rounded-lg p-2 sm:p-2.5 bg-brand/15 flex-shrink-0">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-brand-dark dark:text-brand" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 sm:pb-6 px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base">Chiffre d'affaires (7 jours)</CardTitle>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <div className="h-[180px] sm:h-[300px]">
              <RevenueChart data={revenue7Days} days={7} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-6 px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base">Top 5 plats</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {topProducts.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">Aucune donnée</p>
            )}
            <div className="divide-y">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-brand-dark dark:text-brand">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.count} commandes</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2 sm:pb-6">
          <CardTitle className="text-sm sm:text-base">Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {/* Mobile card view */}
          <div className="md:hidden divide-y">
            {recentOrders.length === 0 && (
              <p className="text-sm text-muted-foreground p-4 text-center">Aucune commande</p>
            )}
            {recentOrders.map((o) => (
              <div key={o.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{o.reference || `#${o.id}`}</span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="font-medium text-sm">{o.customer_name}</p>
                <p className="text-xs text-muted-foreground truncate">{o.items}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{formatCurrency(o.final_total)}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(o.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table view */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-semibold text-muted-foreground">Réf.</th>
                  <th className="pb-3 font-semibold text-muted-foreground">Client</th>
                  <th className="pb-3 font-semibold text-muted-foreground">Plats</th>
                  <th className="pb-3 font-semibold text-muted-foreground">Total</th>
                  <th className="pb-3 font-semibold text-muted-foreground">Statut</th>
                  <th className="pb-3 font-semibold text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-3 font-mono text-xs">{o.reference || `#${o.id}`}</td>
                    <td className="py-3 font-medium">{o.customer_name}</td>
                    <td className="py-3 text-muted-foreground max-w-[200px] truncate">{o.items}</td>
                    <td className="py-3 font-semibold">{formatCurrency(o.final_total)}</td>
                    <td className="py-3"><StatusBadge status={o.status} /></td>
                    <td className="py-3 text-muted-foreground text-xs">{formatDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
