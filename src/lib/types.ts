import dayjs from "dayjs";

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_quartier: string;
  items: string;
  total_price: number;
  delivery_fee: number;
  final_total: number;
  status: OrderStatus;
  motard_phone: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  reference: string | null;
}

export type OrderStatus = "en_cuisine" | "prete" | "en_livraison" | "livree" | "annulee";

export interface MenuItem {
  id: number;
  category: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const statusLabels: Record<OrderStatus, string> = {
  en_cuisine: "En cuisine",
  prete: "Prête",
  en_livraison: "En livraison",
  livree: "Livrée",
  annulee: "Annulée",
};

export const statusColors: Record<OrderStatus, string> = {
  en_cuisine: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  prete: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  en_livraison: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  livree: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  annulee: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function getStatsSummary(orders: Order[]) {
  const now = dayjs();
  const todayOrders = orders.filter((o) => dayjs(o.created_at).isSame(now, "day") && o.status !== "annulee");
  const todayCA = todayOrders.reduce((sum, o) => sum + o.final_total, 0);
  const inProgress = orders.filter((o) => ["en_cuisine", "prete", "en_livraison"].includes(o.status)).length;
  const avgTicket = todayOrders.length > 0 ? Math.round(todayCA / todayOrders.length) : 0;

  return { todayOrders: todayOrders.length, todayCA, inProgress, avgTicket };
}

export function getRevenueByDay(orders: Order[], days: number) {
  const data: { date: string; ca: number; commandes: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, "day");
    const dayOrders = orders.filter(
      (o) => dayjs(o.created_at).isSame(date, "day") && o.status !== "annulee"
    );
    data.push({
      date: date.format("DD/MM"),
      ca: dayOrders.reduce((sum, o) => sum + o.final_total, 0),
      commandes: dayOrders.length,
    });
  }
  return data;
}

export function getTopProducts(orders: Order[], limit: number) {
  const productCount: Record<string, number> = {};
  orders
    .filter((o) => o.status !== "annulee")
    .forEach((o) => {
      const items = o.items.split("+").map((i) => i.trim().replace(/^\d+\s*/, ""));
      items.forEach((item) => {
        productCount[item] = (productCount[item] || 0) + 1;
      });
    });
  return Object.entries(productCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export function getStatsByQuartier(orders: Order[]) {
  const map: Record<string, number> = {};
  orders
    .filter((o) => o.status !== "annulee")
    .forEach((o) => {
      map[o.customer_quartier] = (map[o.customer_quartier] || 0) + 1;
    });
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

export function getStatsByStatus(orders: Order[]) {
  const map: Record<string, number> = {};
  orders.forEach((o) => {
    const label = statusLabels[o.status];
    map[label] = (map[label] || 0) + 1;
  });
  return Object.entries(map).map(([name, count]) => ({ name, count }));
}
