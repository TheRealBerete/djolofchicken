import { useState, useCallback, useEffect } from "react";
import { type MenuItem } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export function useMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("tous");

  const fetchMenu = useCallback(async () => {
    const { data, error } = await supabase
      .from("djolof_menus")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setMenu(data as MenuItem[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const categories = [...new Set(menu.map((m) => m.category))];
  const filtered =
    categoryFilter === "tous"
      ? menu
      : menu.filter((m) => m.category === categoryFilter);

  const addItem = useCallback(
    async (item: Omit<MenuItem, "id" | "display_order" | "created_at" | "updated_at">) => {
      const maxOrder = Math.max(0, ...menu.map((m) => m.display_order));
      const { data, error } = await supabase
        .from("djolof_menus")
        .insert({ ...item, display_order: maxOrder + 1 })
        .select()
        .single();

      if (!error && data) {
        setMenu((prev) => [...prev, data as MenuItem]);
      }
    },
    [menu]
  );

  const updateItem = useCallback(
    async (id: number, data: Partial<MenuItem>) => {
      const { error } = await supabase
        .from("djolof_menus")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (!error) {
        setMenu((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...data } : m))
        );
      }
    },
    []
  );

  const toggleAvailable = useCallback(
    async (id: number) => {
      const item = menu.find((m) => m.id === id);
      if (!item) return;

      const { error } = await supabase
        .from("djolof_menus")
        .update({ is_available: !item.is_available, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (!error) {
        setMenu((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, is_available: !m.is_available } : m
          )
        );
      }
    },
    [menu]
  );

  const deleteItem = useCallback(async (id: number) => {
    const { error } = await supabase
      .from("djolof_menus")
      .delete()
      .eq("id", id);

    if (!error) {
      setMenu((prev) => prev.filter((m) => m.id !== id));
    }
  }, []);

  return {
    menu: filtered,
    allMenu: menu,
    categories,
    categoryFilter,
    setCategoryFilter,
    addItem,
    updateItem,
    toggleAvailable,
    deleteItem,
    loading,
  };
}
