import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useListProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CATEGORIES = ["Dress", "Lifestyle", "Essentials", "Electronics", "Accessories"];
const EMPTY_FORM = { name: "", description: "", price: "", stock: "", category: "Dress", image: "" };

export default function AdminProductsPage() {
  const [, setLocation] = useLocation();
  const { isAdmin, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: products, isLoading } = useListProducts({});

  const createProduct = useCreateProduct({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/products"] }); toast({ title: "Product created" }); closeDialog(); },
      onError: () => toast({ title: "Failed to create product", variant: "destructive" }),
    },
  });

  const updateProduct = useUpdateProduct({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/products"] }); toast({ title: "Product updated" }); closeDialog(); },
      onError: () => toast({ title: "Failed to update product", variant: "destructive" }),
    },
  });

  const deleteProduct = useDeleteProduct({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/products"] }); toast({ title: "Product deleted" }); setDeleteId(null); },
      onError: () => toast({ title: "Failed to delete product", variant: "destructive" }),
    },
  });

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setDialogOpen(true); };
  const openEdit = (product: any) => {
    setEditing(product);
    setForm({ name: product.name, description: product.description, price: String(product.price), stock: String(product.stock), category: product.category, image: product.image ?? "" });
    setDialogOpen(true);
  };
  const closeDialog = () => { setDialogOpen(false); setEditing(null); setForm(EMPTY_FORM); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (editing) {
      updateProduct.mutate({ id: editing.id, data });
    } else {
      createProduct.mutate({ data });
    }
  };

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 py-20 text-center">
        <p className="text-muted-foreground mb-4">Admin access required</p>
        <Button onClick={() => setLocation("/admin/login")} className="rounded-none">Admin Login</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20">
      <div className="py-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => setLocation("/admin")}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Dashboard
          </button>
          <h1 className="text-2xl font-black tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{products?.length ?? 0} products</p>
        </div>
        <Button onClick={openCreate} className="rounded-none" data-testid="button-add-product">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {products?.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-4" data-testid={`product-row-${product.id}`}>
              <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" data-testid={`text-product-name-${product.id}`}>{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.category} · Stock: {product.stock}</p>
              </div>
              <p className="text-sm font-medium" data-testid={`text-product-price-${product.id}`}>₹{product.price.toLocaleString("en-IN")}</p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEdit(product)}
                  data-testid={`button-edit-${product.id}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteId(product.id)}
                  className="text-red-500 hover:text-red-600"
                  data-testid={`button-delete-${product.id}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-none sm:rounded-none max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {[
              { field: "name", label: "Name", type: "text" },
              { field: "description", label: "Description", type: "text" },
              { field: "price", label: "Price (₹)", type: "number" },
              { field: "stock", label: "Stock", type: "number" },
              { field: "image", label: "Image URL", type: "url" },
            ].map(({ field, label, type }) => (
              <div key={field}>
                <Label className="text-xs uppercase tracking-wider">{label}</Label>
                <Input
                  type={type}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                  className="mt-1 rounded-none"
                  required={field !== "image"}
                  data-testid={`input-product-${field}`}
                />
              </div>
            ))}
            <div>
              <Label className="text-xs uppercase tracking-wider">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm(prev => ({ ...prev, category: v }))}>
                <SelectTrigger className="mt-1 rounded-none" data-testid="select-product-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={closeDialog} className="flex-1 rounded-none">Cancel</Button>
              <Button type="submit" className="flex-1 rounded-none" disabled={createProduct.isPending || updateProduct.isPending} data-testid="button-save-product">
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteProduct.mutate({ id: deleteId })}
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
