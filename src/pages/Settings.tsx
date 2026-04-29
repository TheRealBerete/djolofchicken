import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Download, Save } from "lucide-react";

export default function SettingsPage() {
  const [restaurant, setRestaurant] = useState({
    name: "Djolof Chicken",
    phone: "+224 628 12 34 56",
    email: "contact@djolof-chicken.gn",
  });
  const [deliveryFee, setDeliveryFee] = useState(10000);
  const [horaires, setHoraires] = useState({ open: "09:00", close: "22:00" });
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-2xl">
      <h1 className="text-xl sm:text-2xl font-bold">Paramètres</h1>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base">Informations du restaurant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div>
            <label className="text-xs sm:text-sm font-medium">Nom</label>
            <Input value={restaurant.name} onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium">Téléphone</label>
            <Input value={restaurant.phone} onChange={(e) => setRestaurant({ ...restaurant, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium">Email</label>
            <Input value={restaurant.email} onChange={(e) => setRestaurant({ ...restaurant, email: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base">Frais de livraison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Input type="number" value={deliveryFee} onChange={(e) => setDeliveryFee(Number(e.target.value))} className="w-32 sm:w-40" />
            <span className="text-xs sm:text-sm text-muted-foreground">{formatCurrency(deliveryFee)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base">Horaires d'ouverture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs sm:text-sm text-muted-foreground w-20 sm:w-auto">Ouverture</label>
              <Input type="time" value={horaires.open} onChange={(e) => setHoraires({ ...horaires, open: e.target.value })} className="w-32 sm:w-36" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs sm:text-sm text-muted-foreground w-20 sm:w-auto">Fermeture</label>
              <Input type="time" value={horaires.close} onChange={(e) => setHoraires({ ...horaires, close: e.target.value })} className="w-32 sm:w-36" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base">Sécurité</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="text-xs sm:text-sm font-medium">Nouveau mot de passe</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Laisser vide pour ne pas changer" />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button onClick={handleSave} size="sm" className="w-full sm:w-auto">
          <Save className="h-4 w-4" />
          {saved ? "Sauvegardé !" : "Sauvegarder"}
        </Button>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Download className="h-4 w-4" />
          Export base complète
        </Button>
      </div>
    </div>
  );
}
