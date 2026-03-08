"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "../../AdminShell";
import Link from "next/link";
import { ShopProduct, ShopCategory } from "@/lib/database.types";

export default function AdminShopProductsPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<"checking" | "unauthenticated" | "authenticated">("checking");
  const [email, setEmail] = useState<string | null>(null);
  
  const [products, setProducts] = useState<(ShopProduct & { shop_categories: ShopCategory | null })[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newIsActive, setNewIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAuthState("unauthenticated");
        router.replace("/admin/login");
        return;
      }
      setEmail(user.email ?? null);
      setAuthState("authenticated");
    };
    checkAuth();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    
    // Load Categories for the dropdown
    const { data: catData } = await supabase
      .from("shop_categories")
      .select("*")
      .order("name", { ascending: true });
    
    setCategories(catData || []);

    // Load Products
    const { data: prodData, error: fetchError } = await supabase
      .from("shop_products")
      .select("*, shop_categories(*)")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setProducts(prodData as any || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authState === "authenticated") {
      loadData();
    }
  }, [authState]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSaving(true);

    const { data, error: insertError } = await supabase
      .from("shop_products")
      .insert({
        name: newName,
        slug: newSlug || generateSlug(newName),
        description: newDescription,
        category_id: newCategoryId || null,
        is_active: newIsActive
      })
      .select()
      .single();

    setFormSaving(false);

    if (insertError) {
      setFormError(insertError.message);
      return;
    }

    if (data?.id) {
       router.push(`/admin/shop/products/${data.id}`);
    }
  };

  if (authState === "checking" || loading) {
    return (
      <AdminShell email={email}>
        <div className="flex items-center justify-center p-12 text-[var(--main-text)] font-medium animate-pulse opacity-70">
          Loading products...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell email={email}>
      <div className="space-y-8 text-[var(--main-text)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/admin/shop" className="text-sm text-[var(--color-gold-accent)] hover:underline mb-2 inline-block">
              &larr; Back to Shop
            </Link>
            <h1 className="admin-page-title">Products</h1>
            <p className="admin-page-subtitle">Manage products available in your store.</p>
          </div>
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="admin-btn-primary"
          >
            {isCreating ? "Cancel" : "Add Product"}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm font-medium border border-[var(--color-red-danger)]/30">
            {error}
          </div>
        )}

        {isCreating && (
          <div className="admin-card overflow-hidden">
            <div className="admin-card-header">
              <h3>Create New Product</h3>
              <p>You can add specific variants (like sizes and colors) on the next screen.</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-md bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm">
                    {formError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium opacity-80 mb-1">Name</label>
                    <input 
                      type="text" 
                      required 
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value);
                        if (!newSlug) setNewSlug(generateSlug(e.target.value));
                      }}
                      className="admin-input w-full"
                      placeholder="e.g. Classic Logo T-Shirt"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium opacity-80 mb-1">Slug</label>
                    <input 
                      type="text"
                      required
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      className="admin-input w-full font-mono text-sm"
                      placeholder="e.g. classic-logo-t-shirt"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium opacity-80 mb-1">Category</label>
                        <select
                            value={newCategoryId}
                            onChange={(e) => setNewCategoryId(e.target.value)}
                            className="admin-input w-full bg-[var(--secondary-card-bg)]"
                        >
                            <option value="">No Category</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium opacity-80 mb-1">Description</label>
                  <textarea 
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="admin-input w-full min-h-[100px]"
                    placeholder="Product details and features"
                  />
                </div>

                <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newIsActive}
                        onChange={(e) => setNewIsActive(e.target.checked)}
                        className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--color-green-deep)] focus:ring-[var(--color-green-deep)]"
                      />
                      <span className="text-sm font-medium">Active (Visible in store)</span>
                    </label>
                  </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={formSaving}
                    className="admin-btn-primary px-8"
                  >
                    {formSaving ? "Saving..." : "Create & Add Variants"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="admin-card overflow-hidden">
          {products.length === 0 && !loading && !error && (
            <div className="p-12 text-center opacity-70">
              <p>No products found.</p>
              <button 
                onClick={() => setIsCreating(true)}
                className="text-[var(--color-gold-accent)] hover:underline mt-2 text-sm"
              >
                Create your first product
              </button>
            </div>
          )}

          {products.length > 0 && (
            <div className="admin-table-container overflow-x-auto">
              <table className="admin-table">
                <thead className="opacity-80">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Product Name</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="transition-colors">
                      <td className="px-6 py-4 font-medium">
                        {product.name}
                        <p className="font-mono text-xs opacity-60 font-normal mt-0.5">{product.slug}</p>
                      </td>
                      <td className="px-6 py-4">
                        {product.shop_categories?.name || <span className="opacity-50 italic">None</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={product.is_active ? 'admin-badge-active' : 'admin-badge-inactive'}>
                          {product.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/shop/products/${product.id}`}
                          className="text-[var(--color-gold-accent)] hover:underline font-medium text-sm"
                        >
                          Manage Variants
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
