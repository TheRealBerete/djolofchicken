import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(password)) {
      setError("Mot de passe incorrect");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
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
          <CardDescription>Interface de gestion</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoFocus
              />
              {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
            </div>
            <Button type="submit" className="w-full">
              <LogIn className="h-4 w-4" />
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
