"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "../../../AdminShell";
import Link from "next/link";
import { ShopProduct, ShopCategory, ShopProductVariant } from "@/lib/database.types";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [authState, setAuthState] = useState<"checking" | "unauthenticated" | "authenticated">("checking");
  const [email, setEmail] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Product State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [variants, setVariants] = useState<ShopProductVariant[]>([]);

  // Variant Form State
  const [isCreatingVariant, setIsCreatingVariant] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  
  const [vName, setVName] = useState("");
  const [vSize, setVSize] = useState("");
  const [vDesign, setVDesign] = useState("");
  const [vPrice, setVPrice] = useState(0);
  const [vStock, setVStock] = useState(0);
  const [vSku, setVSku] = useState("");
  const [vImageUrl, setVImageUrl] = useState("");
  const [vIsActive, setVIsActive] = useState(true);
  
  const [variantFormError, setVariantFormError] = useState<string | null>(null);
  const [variantSaving, setVariantSaving] = useState(false);

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

    // 1. Categories
    const { data: catData } = await supabase
      .from("shop_categories")
      .select("*")
      .order("name", { ascending: true });
    setCategories(catData || []);

    // 2. Product
    const { data: prodData, error: prodError } = await supabase
      .from("shop_products")
      .select("*")
      .eq("id", id)
      .single();

    if (prodError || !prodData) {
      setError(prodError?.message || "Product not found");
      setLoading(false);
      return;
    }

    setName(prodData.name);
    setSlug(prodData.slug);
    setDescription(prodData.description || "");
    setCategoryId(prodData.category_id || "");
    setIsActive(prodData.is_active);

    // 3. Variants
    await reloadVariants();
    
    setLoading(false);
  };

  const reloadVariants = async () => {
    const { data: varData } = await supabase
      .from("shop_product_variants")
      .select("*")
      .eq("product_id", id)
      .order("created_at", { ascending: true });
    
    setVariants(varData || []);
  };

  useEffect(() => {
    if (authState === "authenticated") {
      loadData();
    }
  }, [authState, id]);

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    const { error: updateError } = await supabase
      .from("shop_products")
      .update({
        name,
        slug,
        description,
        category_id: categoryId || null,
        is_active: isActive
      })
      .eq("id", id);

    setIsSaving(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Product parent details updated.");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleDeleteProduct = async () => {
    if (!confirm("Are you sure? This will permanently delete the product and all its variants.")) return;

    const { error: deleteError } = await supabase
      .from("shop_products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError("Failed to delete: " + deleteError.message);
    } else {
      router.push("/admin/shop/products");
    }
  };

  // ==========================================
  // VARIANT LOGIC
  // ==========================================

  const resetVariantForm = () => {
    setVName("");
    setVSize("");
    setVDesign("");
    setVPrice(0);
    setVStock(0);
    setVSku("");
    setVImageUrl("");
    setVIsActive(true);
    setVariantFormError(null);
    setIsCreatingVariant(false);
    setEditingVariantId(null);
  };

  const handleEditVariantClick = (variant: ShopProductVariant) => {
    setVName(variant.name);
    setVSize(variant.size || "");
    setVDesign(variant.design || "");
    setVPrice(variant.price);
    setVStock(variant.stock_quantity);
    setVSku(variant.sku || "");
    setVImageUrl(variant.image_url || "");
    setVIsActive(variant.is_active);
    
    setEditingVariantId(variant.id);
    setIsCreatingVariant(true);
  };

  const handleSaveVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setVariantFormError(null);
    setVariantSaving(true);

    const payload = {
      product_id: id,
      name: vName,
      size: vSize || null,
      design: vDesign || null,
      price: vPrice,
      stock_quantity: vStock,
      sku: vSku || null,
      image_url: vImageUrl || null,
      is_active: vIsActive,
    };

    let errorResult;

    if (editingVariantId) {
      const { error } = await supabase
        .from("shop_product_variants")
        .update(payload)
        .eq("id", editingVariantId);
      errorResult = error;
    } else {
      const { error } = await supabase
        .from("shop_product_variants")
        .insert(payload);
      errorResult = error;
    }

    setVariantSaving(false);

    if (errorResult) {
      setVariantFormError(errorResult.message);
    } else {
      resetVariantForm();
      reloadVariants();
      setSuccess("Variant saved successfully.");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Delete this variant?")) return;
    
    const { error } = await supabase
      .from("shop_product_variants")
      .delete()
      .eq("id", variantId);
      
    if (error) {
      setError("Failed to delete variant: " + error.message);
    } else {
      reloadVariants();
    }
  };

  if (authState === "checking" || loading) {
    return (
      <AdminShell email={email}>
        <div className="flex items-center justify-center p-12 text-[var(--main-text)] font-medium animate-pulse opacity-70">
          Loading product...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell email={email}>
      <div className="space-y-8 text-[var(--main-text)] pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/admin/shop/products" className="text-sm text-[var(--color-gold-accent)] hover:underline mb-2 inline-block">
              &larr; Back to Products
            </Link>
            <h1 className="admin-page-title">Edit Product</h1>
            <p className="admin-page-subtitle">Manage base product details and individual variants.</p>
          </div>
          <button 
            type="button"
            onClick={handleDeleteProduct}
            className="admin-btn-danger"
          >
            Delete Product
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

        {/* ======================= */}
        {/* BASE PRODUCT DETAILS    */}
        {/* ======================= */}
        <div className="admin-card overflow-hidden">
          <div className="admin-card-header">
            <h3>Base Product Details</h3>
            <p>Shared information for all variants of this product.</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleUpdateProduct} className="space-y-6">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium opacity-80 mb-1">Category</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="admin-input w-full bg-[var(--secondary-card-bg)]"
                    >
                        <option value="">No Category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
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
              
              <div>
                <label className="block text-sm font-medium opacity-80 mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="admin-input w-full min-h-[100px]"
                />
              </div>

              <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="admin-btn-primary px-8"
                >
                  {isSaving ? "Saving..." : "Save Product Details"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ======================= */}
        {/* PRODUCT VARIANTS        */}
        {/* ======================= */}
        <div className="flex items-center justify-between pt-8 pb-2">
            <h2 className="admin-page-title text-xl">Product Variants</h2>
            {!isCreatingVariant && (
                <button 
                    onClick={() => setIsCreatingVariant(true)}
                    className="admin-btn-primary"
                >
                    Add Variant
                </button>
            )}
        </div>

        {isCreatingVariant && (
          <div className="admin-card overflow-hidden border-2 border-[var(--color-gold-accent)]/50">
            <div className="admin-card-header bg-[var(--color-gold-accent)]/5">
              <h3>{editingVariantId ? "Edit Variant" : "Create New Variant"}</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveVariant} className="space-y-4">
                {variantFormError && (
                  <div className="p-3 rounded-md bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm">
                    {variantFormError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium opacity-80 mb-1">Variant Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={vName}
                      onChange={(e) => setVName(e.target.value)}
                      className="admin-input w-full"
                      placeholder="e.g. Green - Medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium opacity-80 mb-1">SKU (Optional)</label>
                    <input 
                      type="text"
                      value={vSku}
                      onChange={(e) => setVSku(e.target.value)}
                      className="admin-input w-full font-mono text-sm"
                      placeholder="e.g. TSHIRT-GRN-M"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-[var(--border-color)] py-4 my-4">
                  <div>
                    <label className="block text-sm font-medium opacity-80 mb-1">Size (Optional)</label>
                    <input 
                      type="text"
                      value={vSize}
                      onChange={(e) => setVSize(e.target.value)}
                      className="admin-input w-full"
                      placeholder="e.g. M, L, XL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium opacity-80 mb-1">Design/Color (Optional)</label>
                    <input 
                      type="text"
                      value={vDesign}
                      onChange={(e) => setVDesign(e.target.value)}
                      className="admin-input w-full"
                      placeholder="e.g. Green, Red"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium opacity-80 mb-1">Image URL (Optional)</label>
                    <input 
                      type="url"
                      value={vImageUrl}
                      onChange={(e) => setVImageUrl(e.target.value)}
                      className="admin-input w-full text-sm"
                      placeholder="/images/green.PNG"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-green-deep)] mb-1">Price (₹) *</label>
                    <input 
                      type="number"
                      required
                      min="0"
                      value={vPrice}
                      onChange={(e) => setVPrice(parseInt(e.target.value) || 0)}
                      className="admin-input w-full text-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium opacity-80 mb-1">Stock Quantity</label>
                    <input 
                      type="number"
                      min="0"
                      value={vStock}
                      onChange={(e) => setVStock(parseInt(e.target.value) || 0)}
                      className="admin-input w-full"
                    />
                  </div>
                  <div className="flex items-center h-full pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={vIsActive}
                        onChange={(e) => setVIsActive(e.target.checked)}
                        className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--color-green-deep)] focus:ring-[var(--color-green-deep)]"
                      />
                      <span className="text-sm font-medium">Active</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={resetVariantForm}
                    className="admin-btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={variantSaving}
                    className="admin-btn-primary px-8"
                  >
                    {variantSaving ? "Saving..." : "Save Variant"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="admin-card overflow-hidden">
          {variants.length === 0 ? (
            <div className="p-12 text-center opacity-70">
              <p>No variants have been created for this product yet.</p>
              {!isCreatingVariant && (
                <button 
                  onClick={() => setIsCreatingVariant(true)}
                  className="text-[var(--color-gold-accent)] hover:underline mt-2 text-sm"
                >
                  Create your first variant
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--secondary-card-bg)] border-b border-[var(--border-color)] text-xs uppercase tracking-wider opacity-80">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Variant Name</th>
                    <th className="px-6 py-4 font-semibold">Attributes</th>
                    <th className="px-6 py-4 font-semibold">Price (₹)</th>
                    <th className="px-6 py-4 font-semibold">Stock</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {variants.map((v) => (
                    <tr key={v.id} className="hover:bg-[var(--secondary-card-bg)]/30 transition-colors">
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                        {v.image_url ? (
                            <img src={v.image_url} alt={v.name} className="w-10 h-10 object-cover rounded bg-[var(--secondary-card-bg)] border border-[var(--border-color)]" />
                        ) : (
                            <div className="w-10 h-10 rounded bg-[var(--secondary-card-bg)] border border-[var(--border-color)] flex items-center justify-center opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            </div>
                        )}
                        <div>
                            {v.name}
                            {v.sku && <p className="font-mono text-xs opacity-60 font-normal mt-0.5">{v.sku}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4 opacity-80 text-xs">
                        {v.design && <span className="block">Color: {v.design}</span>}
                        {v.size && <span className="block">Size: {v.size}</span>}
                      </td>
                      <td className="px-6 py-4 font-medium text-[var(--color-green-deep)]">
                        ₹{v.price}
                      </td>
                      <td className="px-6 py-4">
                        <span className={v.stock_quantity === 0 ? "text-[var(--color-red-danger)] font-medium" : "opacity-80"}>
                          {v.stock_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${v.is_active ? 'bg-[var(--color-green-deep)]/10 text-[var(--color-green-deep)]' : 'bg-[var(--border-color)] opacity-70'}`}>
                          {v.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                            <button 
                                onClick={() => handleEditVariantClick(v)}
                                className="text-[var(--color-gold-accent)] hover:underline font-medium text-sm"
                            >
                                Edit
                            </button>
                            <span className="opacity-20">|</span>
                            <button 
                                onClick={() => handleDeleteVariant(v.id)}
                                className="text-[var(--color-red-danger)] hover:underline font-medium text-sm"
                            >
                                Delete
                            </button>
                        </div>
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
