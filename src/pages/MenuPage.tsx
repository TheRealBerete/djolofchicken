import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { useMenu } from "@/hooks/useMenu";
import { formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/lib/types";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

const emptyForm = {
  category: "Poulets",
  name: "",
  description: "",
  price: 0,
  image_url: "",
  is_available: true,
};

export default function MenuPage() {
  const {
    menu,
    categories,
    categoryFilter,
    setCategoryFilter,
    addItem,
    updateItem,
    toggleAvailable,
    deleteItem,
  } = useMenu();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      category: item.category,
      name: item.name,
      description: item.description || "",
      price: item.price,
      image_url: item.image_url || "",
      is_available: item.is_available,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || form.price <= 0) return;
    if (editing) {
      updateItem(editing.id, form);
    } else {
      addItem(form);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (deleteConfirm === id) {
      deleteItem(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold">Menu</h1>
        <Button onClick={openAdd} size="sm">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Ajouter un plat</span>
        </Button>
      </div>

      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
        <button
          onClick={() => setCategoryFilter("tous")}
          className={`rounded-full px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-colors ${
            categoryFilter === "tous"
              ? "bg-brand text-gray-900"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-full px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-colors ${
              categoryFilter === cat
                ? "bg-brand text-gray-900"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {menu.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                    <span className="text-sm font-bold">{formatCurrency(item.price)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleAvailable(item.id)}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.is_available
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {item.is_available ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(item)} className="rounded p-1 hover:bg-muted transition-colors">
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  </div>
                  {deleteConfirm === item.id && (
                    <span onClick={() => deleteItem(item.id)} className="cursor-pointer text-xs font-bold text-red-600 hover:underline">
                      Confirmer
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left">
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Plat</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Catégorie</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Prix</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Disponible</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menu.map((item) => (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleAvailable(item.id)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            item.is_available
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {item.is_available ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          {item.is_available ? "Disponible" : "Indisponible"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(item)} className="rounded p-1.5 hover:bg-muted transition-colors">
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="rounded p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                        {deleteConfirm === item.id && (
                          <span onClick={() => deleteItem(item.id)} className="ml-1 cursor-pointer text-xs font-bold text-red-600 hover:underline">
                            Confirmer
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le plat" : "Ajouter un plat"}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Catégorie</label>
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Nom</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom du plat" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optionnel)" />
          </div>
          <div>
            <label className="text-sm font-medium">Prix (GNF)</label>
            <Input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="5000" />
          </div>
          <div>
            <label className="text-sm font-medium">Image URL (optionnel)</label>
            <Input value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>{editing ? "Modifier" : "Ajouter"}</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
