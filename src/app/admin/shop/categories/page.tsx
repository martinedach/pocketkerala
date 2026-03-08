"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "../../AdminShell";
import Link from "next/link";
import { ShopCategory } from "@/lib/database.types";

export default function AdminShopCategoriesPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<"checking" | "unauthenticated" | "authenticated">("checking");
  const [email, setEmail] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSortOrder, setNewSortOrder] = useState(0);
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

  const loadCategories = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("shop_categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authState === "authenticated") {
      loadCategories();
    }
  }, [authState]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSaving(true);

    const { error: insertError } = await supabase
      .from("shop_categories")
      .insert({
        name: newName,
        slug: newSlug || generateSlug(newName),
        description: newDescription,
        sort_order: newSortOrder,
        is_active: newIsActive
      });

    if (insertError) {
      setFormError(insertError.message);
      setFormSaving(false);
      return;
    }

    // Reset and reload
    setIsCreating(false);
    setNewName("");
    setNewSlug("");
    setNewDescription("");
    setNewSortOrder(0);
    setNewIsActive(true);
    setFormSaving(false);
    loadCategories();
  };

  if (authState === "checking" || loading) {
    return (
      <AdminShell email={email}>
        <div className="flex items-center justify-center p-12 text-[var(--main-text)] font-medium animate-pulse opacity-70">
          Loading categories...
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
            <h1 className="admin-page-title">Categories</h1>
            <p className="admin-page-subtitle">Manage product categories for your store.</p>
          </div>
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="admin-btn-primary"
          >
            {isCreating ? "Cancel" : "Add Category"}
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
              <h3>Create New Category</h3>
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
                      placeholder="e.g. T-Shirts"
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
                      placeholder="e.g. t-shirts"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium opacity-80 mb-1">Description</label>
                  <textarea 
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="admin-input w-full min-h-[80px]"
                    placeholder="Brief description of this category (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium opacity-80 mb-1">Sort Order</label>
                    <input 
                      type="number"
                      value={newSortOrder}
                      onChange={(e) => setNewSortOrder(parseInt(e.target.value) || 0)}
                      className="admin-input w-full"
                    />
                    <p className="text-xs opacity-60 mt-1">Lower numbers appear first.</p>
                  </div>
                  <div className="flex items-center h-full pt-6">
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
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={formSaving}
                    className="admin-btn-primary px-8"
                  >
                    {formSaving ? "Saving..." : "Save Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="admin-card overflow-hidden">
          {categories.length === 0 && !loading && !error && (
            <div className="p-12 text-center opacity-70">
              <p>No categories found.</p>
              <button 
                onClick={() => setIsCreating(true)}
                className="text-[var(--color-gold-accent)] hover:underline mt-2 text-sm"
              >
                Create your first category
              </button>
            </div>
          )}

          {categories.length > 0 && (
            <div className="admin-table-container overflow-x-auto">
              <table className="admin-table">
                <thead className="opacity-80">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Slug</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Sort Order</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="transition-colors">
                      <td className="px-6 py-4 font-medium">
                        {category.name}
                        {category.description && (
                          <p className="text-xs opacity-60 font-normal mt-1 line-clamp-1">{category.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs opacity-80">{category.slug}</td>
                      <td className="px-6 py-4">
                        <span className={category.is_active ? 'admin-badge-active' : 'admin-badge-inactive'}>
                          {category.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 opacity-80">{category.sort_order}</td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/shop/categories/${category.id}`}
                          className="text-[var(--color-gold-accent)] hover:underline font-medium text-sm"
                        >
                          Edit
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
