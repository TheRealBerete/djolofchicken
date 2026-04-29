import { cn } from "@/lib/utils";
import { statusLabels, statusColors, type OrderStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        statusColors[status]
      )}
    >
      {status === "en_cuisine" && "🔥 "}
      {status === "prete" && "✓ "}
      {status === "en_livraison" && "🚚 "}
      {status === "livree" && "✅ "}
      {status === "annulee" && "✗ "}
      {statusLabels[status]}
    </span>
  );
}

export function StatusActions({
  status,
  onUpdate,
  onCancel,
}: {
  status: OrderStatus;
  onUpdate: (status: OrderStatus) => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-1.5">
      {status === "en_cuisine" && (
        <>
          <button
            onClick={() => onUpdate("prete")}
            className="rounded-md bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
          >
            → Prête
          </button>
          <button
            onClick={onCancel}
            className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
          >
            Annuler
          </button>
        </>
      )}
      {status === "prete" && (
        <>
          <button
            onClick={() => onUpdate("en_livraison")}
            className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
          >
            → En livraison
          </button>
          <button
            onClick={onCancel}
            className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
          >
            Annuler
          </button>
        </>
      )}
      {status === "en_livraison" && (
        <button
          onClick={() => onUpdate("livree")}
          className="rounded-md bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
        >
          → Livrée
        </button>
      )}
    </div>
  );
}
