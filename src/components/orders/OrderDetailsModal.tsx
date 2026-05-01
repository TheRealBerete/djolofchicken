import { Dialog } from "@/components/ui/dialog";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order } from "@/lib/types";

export function OrderDetailsModal({
  order,
  open,
  onClose,
}: {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} title={`Commande ${order.reference || `#${order.id}`}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <StatusBadge status={order.status} />
          <span className="text-sm text-muted-foreground">{formatDate(order.created_at)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Client</p>
            <p className="font-semibold">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Téléphone</p>
            <p className="font-semibold">{order.customer_phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Quartier</p>
            <p className="font-semibold">{order.customer_quartier}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Livraison</p>
            <p className="font-semibold">{formatCurrency(order.delivery_fee)}</p>
          </div>
          {order.motard_phone && (
            <div>
              <p className="text-muted-foreground">Motard</p>
              <p className="font-semibold">{order.motard_phone}</p>
            </div>
          )}
          {order.delivered_at && (
            <div>
              <p className="text-muted-foreground">Livrée le</p>
              <p className="font-semibold">{formatDate(order.delivered_at)}</p>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Plats commandés</p>
          <p className="text-sm">{order.items}</p>
        </div>

        <div className="border-t pt-3 flex justify-between items-center">
          <span className="text-muted-foreground">Total</span>
          <span className="text-xl font-bold text-brand-dark dark:text-brand">
            {formatCurrency(order.final_total)}
          </span>
        </div>
      </div>
    </Dialog>
  );
}
