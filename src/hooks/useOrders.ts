import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { type Order, type OrderStatus } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "tous">("tous");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from("djolof_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();

    channelRef.current = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "djolof_orders" },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [fetchOrders]);

  const filtered = useMemo(() => {
    let result = orders;
    if (filter !== "tous") {
      result = result.filter((o) => o.status === filter);
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(s) ||
          o.customer_phone.includes(s)
      );
    }
    return result;
  }, [orders, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const updateStatus = useCallback(
    async (id: number, newStatus: OrderStatus) => {
      const { error } = await supabase
        .from("djolof_orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (!error) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      }
    },
    []
  );

  const cancelOrder = useCallback(
    async (id: number) => {
      const { error } = await supabase
        .from("djolof_orders")
        .update({ status: "annulee", updated_at: new Date().toISOString() })
        .eq("id", id);

      if (!error) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === id ? { ...o, status: "annulee" as OrderStatus } : o
          )
        );
      }
    },
    []
  );

  return {
    orders: paginated,
    totalOrders: filtered.length,
    totalPages,
    page,
    setPage,
    filter,
    setFilter,
    search,
    setSearch,
    updateStatus,
    cancelOrder,
    allOrders: orders,
    loading,
  };
}
