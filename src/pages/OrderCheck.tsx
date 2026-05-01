import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { statusLabels, type Order, type OrderStatus } from "@/lib/types";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Sun, Moon } from "lucide-react";

const STATUS_ORDER: OrderStatus[] = ["en_cuisine", "prete", "en_livraison", "livree"];

const stepIcons: Record<OrderStatus, string> = {
  en_cuisine: "🔥",
  prete: "✓",
  en_livraison: "🚚",
  livree: "✅",
  annulee: "✗",
};

const stepColors: Record<OrderStatus, string> = {
  en_cuisine: "text-yellow-600 border-yellow-500 bg-yellow-50",
  prete: "text-orange-600 border-orange-500 bg-orange-50",
  en_livraison: "text-gray-600 border-gray-400 bg-gray-50",
  livree: "text-green-600 border-green-500 bg-green-50",
  annulee: "text-red-600 border-red-500 bg-red-50",
};

function ProgressTracker({ status }: { status: OrderStatus }) {
  if (status === "annulee") {
    return (
      <div className="flex items-center justify-center gap-2 py-3">
        <div className="flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-4 py-2">
          <span className="text-lg">✗</span>
          <span className="text-sm font-semibold text-red-700">Commande annulée</span>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div className="flex items-center justify-center py-3 gap-0">
      {STATUS_ORDER.map((step, i) => {
        const isCompleted = i < currentIdx;
        const isCurrent = i === currentIdx;
        const isFuture = i > currentIdx;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm transition-all",
                  isCompleted && "border-green-500 bg-green-500 text-white",
                  isCurrent && `${stepColors[step]} border-2`,
                  isFuture && "border-gray-200 bg-white text-gray-300"
                )}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{stepIcons[step]}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium whitespace-nowrap",
                  isCompleted && "text-green-700",
                  isCurrent && stepColors[step].split(" ")[0],
                  isFuture && "text-gray-400"
                )}
              >
                {statusLabels[step]}
              </span>
            </div>
            {i < STATUS_ORDER.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-6 sm:w-10 mx-1 mt-[-14px] rounded transition-all",
                  i < currentIdx ? "bg-green-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderCheckPage() {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const { resolved, toggle } = useThemeMode();
  const [inputRef, setInputRef] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (reference) {
      setInputRef(reference);
      fetchOrder(reference);
    }
  }, [reference]);

  const fetchOrder = async (ref: string) => {
    setLoading(true);
    setError("");
    setOrder(null);

    const cleanRef = ref.trim().toUpperCase();
    const { data, error: fetchError } = await supabase
      .from("djolof_orders")
      .select("*")
      .eq("reference", cleanRef)
      .maybeSingle();

    if (fetchError || !data) {
      setError("Commande introuvable. Vérifiez votre numéro de référence.");
    } else {
      setOrder(data as Order);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputRef.trim().toUpperCase();
    if (clean) {
      navigate(`/check/${clean}`, { replace: true });
      fetchOrder(clean);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <button
        onClick={toggle}
        className="fixed top-4 right-4 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border"
        aria-label={resolved === "dark" ? "Mode clair" : "Mode sombre"}
        title={resolved === "dark" ? "Mode clair" : "Mode sombre"}
      >
        {resolved === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3">
            <img
              src="/logo.png"
              alt="Djolof Chicken"
              className="mx-auto h-17 w-17 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="hidden mx-auto h-16 w-16 items-center justify-center rounded-xl bg-brand text-2xl font-bold text-gray-900">
              DC
            </div>
          </div>
          <CardTitle className="text-xl">Djolof Chicken</CardTitle>
          <p className="text-sm text-muted-foreground">Suivi de commande</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Réf. ex: DC-001001"
              value={inputRef}
              onChange={(e) => {
                setInputRef(e.target.value);
                setError("");
              }}
              className="font-mono uppercase placeholder:normal-case placeholder:font-sans"
              autoFocus
            />
            <Button type="submit" disabled={!inputRef.trim() || loading} className="gap-1.5">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Suivre
            </Button>
          </form>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {order && !loading && (
            <div className="space-y-4 rounded-lg border bg-card p-4">
              <div className="text-center">
                <p className="font-mono text-sm font-bold text-brand-dark dark:text-brand">
                  {order.reference}
                </p>
              </div>

              <ProgressTracker status={order.status} />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Client</p>
                  <p className="font-semibold">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Date</p>
                  <p className="font-semibold">{formatDate(order.created_at)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs">Plats</p>
                  <p className="font-medium">{order.items}</p>
                </div>
                <div className="col-span-2 flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-brand-dark dark:text-brand">
                    {formatCurrency(order.final_total)}
                  </span>
                </div>
              </div>

              {order.status === "annulee" && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                  <p className="text-sm text-red-700">Cette commande a été annulée.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
