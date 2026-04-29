import { useState, useEffect, useMemo } from "react";
import {
  type Order,
  getStatsSummary,
  getRevenueByDay,
  getTopProducts,
  getStatsByQuartier,
  getStatsByStatus,
} from "@/lib/types";
import { supabase } from "@/lib/supabase";

export function useStats() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("djolof_orders")
        .select("*");

      if (!error && data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const summary = useMemo(() => getStatsSummary(orders), [orders]);
  const revenue7Days = useMemo(() => getRevenueByDay(orders, 7), [orders]);
  const revenue30Days = useMemo(() => getRevenueByDay(orders, 30), [orders]);
  const topProducts = useMemo(() => getTopProducts(orders, 5), [orders]);
  const byQuartier = useMemo(() => getStatsByQuartier(orders), [orders]);
  const byStatus = useMemo(() => getStatsByStatus(orders), [orders]);
  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  return {
    summary,
    revenue7Days,
    revenue30Days,
    topProducts,
    byQuartier,
    byStatus,
    recentOrders,
    loading,
  };
}
