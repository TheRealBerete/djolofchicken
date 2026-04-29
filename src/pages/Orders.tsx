import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusActions } from "@/components/orders/StatusBadge";
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import { Search, Download, ChevronLeft, ChevronRight, Phone, MapPin } from "lucide-react";

export default function OrdersPage() {
  const {
    orders,
    totalOrders,
    totalPages,
    page,
    setPage,
    filter,
    setFilter,
    search,
    setSearch,
    updateStatus,
    cancelOrder,
    allOrders,
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<number | null>(null);

  const handleCancel = (id: number) => {
    if (confirmCancel === id) {
      cancelOrder(id);
      setConfirmCancel(null);
    } else {
      setConfirmCancel(id);
    }
  };

  const exportCSV = () => {
    const headers = "ID,Client,Téléphone,Quartier,Plats,Total,Frais livraison,Total final,Statut,Motard,Livrée le,Créée le\n";
    const rows = allOrders.map((o) =>
      [
        o.id,
        `"${o.customer_name}"`,
        o.customer_phone,
        o.customer_quartier,
        `"${o.items}"`,
        o.total_price,
        o.delivery_fee,
        o.final_total,
        o.status,
        o.motard_phone || "",
        o.delivered_at || "",
        o.created_at,
      ].join(",")
    );
    const csv = headers + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commandes-djolof-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-bold">Commandes</h1>
        <Button onClick={exportCSV} variant="outline" size="sm" className="self-start sm:self-auto">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Export CSV</span>
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher client ou téléphone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as OrderStatus | "tous");
            setPage(1);
          }}
          className="w-full sm:w-44"
        >
          <option value="tous">Tous les statuts</option>
          <option value="en_cuisine">En cuisine</option>
          <option value="prete">Prête</option>
          <option value="en_livraison">En livraison</option>
          <option value="livree">Livrée</option>
          <option value="annulee">Annulée</option>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
          <CardTitle className="text-sm sm:text-base">
            {totalOrders} commande{totalOrders > 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>

        {/* Mobile card view */}
        <div className="md:hidden divide-y">
          {orders.length === 0 && (
            <p className="text-sm text-muted-foreground p-8 text-center">Aucune commande trouvée</p>
          )}
          {orders.map((o) => (
            <div key={o.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedOrder(o)}
                  className="font-mono text-xs text-muted-foreground hover:underline"
                >
                  #{o.id}
                </button>
                <StatusBadge status={o.status} />
              </div>
              <button
                onClick={() => setSelectedOrder(o)}
                className="font-semibold text-sm text-left hover:text-brand-dark dark:hover:text-brand"
              >
                {o.customer_name}
              </button>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {o.customer_phone}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {o.customer_quartier}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{o.items}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{formatCurrency(o.final_total)}</span>
                <span className="text-xs text-muted-foreground">{formatDate(o.created_at)}</span>
              </div>
              <div className="pt-1 border-t">
                <StatusActions
                  status={o.status}
                  onUpdate={(s) => updateStatus(o.id, s)}
                  onCancel={() => handleCancel(o.id)}
                />
                {confirmCancel === o.id && (
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-xs text-red-600">Confirmer ?</span>
                    <button onClick={() => cancelOrder(o.id)} className="text-xs font-bold text-red-600 hover:underline">Oui</button>
                    <button onClick={() => setConfirmCancel(null)} className="text-xs text-muted-foreground hover:underline">Non</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">ID</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Client</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap hidden lg:table-cell">Quartier</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Plats</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Total</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Statut</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">#{o.id}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="font-medium text-brand-dark hover:underline dark:text-brand text-left"
                    >
                      {o.customer_name}
                      <span className="block text-xs text-muted-foreground font-normal">{o.customer_phone}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{o.customer_quartier}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate">{o.items}</td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">{formatCurrency(o.final_total)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell whitespace-nowrap">{formatDate(o.created_at)}</td>
                  <td className="px-4 py-3">
                    <StatusActions
                      status={o.status}
                      onUpdate={(s) => updateStatus(o.id, s)}
                      onCancel={() => handleCancel(o.id)}
                    />
                    {confirmCancel === o.id && (
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-xs text-red-600">Confirmer ?</span>
                        <button onClick={() => cancelOrder(o.id)} className="text-xs font-bold text-red-600 hover:underline">Oui</button>
                        <button onClick={() => setConfirmCancel(null)} className="text-xs text-muted-foreground hover:underline">Non</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    Aucune commande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <OrderDetailsModal order={selectedOrder} open={!!selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
