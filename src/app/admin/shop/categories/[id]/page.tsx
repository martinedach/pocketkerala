"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "../../../AdminShell";
import Link from "next/link";
import { ShopCategory } from "@/lib/database.types";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [authState, setAuthState] = useState<"checking" | "unauthenticated" | "authenticated">("checking");
  const [email, setEmail] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    if (authState !== "authenticated") return;

    const loadCategory = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("shop_categories")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        setCategoryData(data as ShopCategory);
      }
      setLoading(false);
    };

    loadCategory();
  }, [authState, id]);

  const setCategoryData = (cat: ShopCategory) => {
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setSortOrder(cat.sort_order);
    setIsActive(cat.is_active);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    const { error: updateError } = await supabase
      .from("shop_categories")
      .update({
        name,
        slug,
        description,
        sort_order: sortOrder,
        is_active: isActive
      })
      .eq("id", id);

    setIsSaving(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Category updated successfully.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category? This might fail if there are products linked to it if foreign constraints are strict.")) return;

    const { error: deleteError } = await supabase
      .from("shop_categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError("Failed to delete: " + deleteError.message);
    } else {
      router.push("/admin/shop/categories");
    }
  };

  if (authState === "checking" || loading) {
    return (
      <AdminShell email={email}>
        <div className="flex items-center justify-center p-12 text-[var(--main-text)] font-medium animate-pulse opacity-70">
          Loading category...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell email={email}>
      <div className="space-y-8 text-[var(--main-text)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/admin/shop/categories" className="text-sm text-[var(--color-gold-accent)] hover:underline mb-2 inline-block">
              &larr; Back to Categories
            </Link>
            <h1 className="admin-page-title">Edit Category</h1>
            <p className="admin-page-subtitle">Update your category details.</p>
          </div>
          <button 
            type="button"
            onClick={handleDelete}
            className="admin-btn-danger"
          >
            Delete Category
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm font-medium border border-[var(--color-red-danger)]/30">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 rounded-lg bg-[var(--color-green-deep)]/10 text-[var(--color-green-deep)] text-sm font-medium border border-[var(--color-green-deep)]/30">
            {success}
          </div>
        )}

        <div className="admin-card overflow-hidden">
          <div className="admin-card-header">
            <h3>Category Details</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium opacity-80 mb-1">Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium opacity-80 mb-1">Slug</label>
                  <input 
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="admin-input w-full font-mono text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium opacity-80 mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="admin-input w-full min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium opacity-80 mb-1">Sort Order</label>
                  <input 
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    className="admin-input w-full max-w-[200px]"
                  />
                </div>
                <div className="flex items-center h-full pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--color-green-deep)] focus:ring-[var(--color-green-deep)]"
                    />
                    <span className="text-sm font-medium">Active (Visible in store)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="admin-btn-primary px-8"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
