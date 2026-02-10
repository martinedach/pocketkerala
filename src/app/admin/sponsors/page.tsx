"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "../AdminShell";
import Image from "next/image";

type Sponsor = {
  id: number;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  created_at: string;
};

export default function AdminSponsorsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      setEmail(user.email ?? null);
      fetchSponsors();
    };
    
    checkAuth();
  }, [router]);

  const fetchSponsors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
           // eslint-disable-next-line no-console
      console.error("Error fetching sponsors:", error);
    } else {
      setSponsors(data || []);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !file) {
      setError("Name and Logo are required.");
      return;
    }

    setUploading(true);

    try {
      // 1. Upload Image
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("sponsor-logos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("sponsor-logos")
        .getPublicUrl(filePath);

      // 3. Insert Record
      const { error: insertError } = await supabase
        .from("sponsors")
        .insert({
          name,
          website_url: websiteUrl || null,
          logo_url: publicUrl,
        });

      if (insertError) throw insertError;

      setSuccess("Sponsor added result successfully!");
      setName("");
      setWebsiteUrl("");
      setFile(null);
      // Reset file input manually if needed, or rely on key change
      
      fetchSponsors(); // Refresh list
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number, logoUrl: string) => {
    if (!confirm("Are you sure you want to delete this sponsor?")) return;

    try {
      // 1. Delete from DB
      const { error: deleteError } = await supabase
        .from("sponsors")
        .delete()
        .eq("id", id);
        
      if (deleteError) throw deleteError;

      // 2. Try to delete image (optional cleanup)
      // Extract path from URL roughly
      const path = logoUrl.split("/sponsor-logos/")[1];
      if (path) {
        await supabase.storage.from("sponsor-logos").remove([path]);
      }

      setSponsors(sponsors.filter(s => s.id !== id));
      setSuccess("Sponsor deleted.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AdminShell email={email}>
      <div className="w-full space-y-8 text-[var(--main-text)]">
        <div className="text-left">
          <h2 className="text-3xl font-bold text-[var(--color-green-deep)] dark:text-[var(--color-gold-accent)] mb-2" style={{ textShadow: "1px 1px 2px var(--shadow-color)" }}>
            Sponsor Management
          </h2>
          <p className="opacity-80 text-lg font-serif">
            Add and manage partners shown on the landing page.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm font-medium border border-[var(--color-red-danger)]/20 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 rounded-lg bg-[var(--color-green-deep)]/10 text-[var(--color-green-deep)] text-sm font-medium border border-[var(--color-green-deep)]/20 animate-in fade-in slide-in-from-top-2">
            {success}
          </div>
        )}

        {/* Add New Sponsor Form */}
        <div className="bg-[var(--card-bg)] rounded-xl shadow-md border border-[var(--border-color)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)]">
            <h3 className="text-xl font-semibold text-[var(--color-green-deep)]">
              Add New Sponsor
            </h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Provider Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--secondary-card-bg)] text-[var(--main-text)] focus:ring-2 focus:ring-[var(--color-gold-accent)] outline-none transition-all"
                    placeholder="e.g. SmartPix Media"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Website URL</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--secondary-card-bg)] text-[var(--main-text)] focus:ring-2 focus:ring-[var(--color-gold-accent)] outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 opacity-80">Logo Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-[var(--main-text)]
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[var(--color-gold-accent)] file:text-black
                    hover:file:brightness-110 cursor-pointer"
                />
                <p className="text-xs opacity-60 mt-1">Recommended height: 80px. PNG or JPG.</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-gradient-to-r from-[var(--color-gold-accent)] to-[#FFC107] hover:brightness-110 text-black font-bold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Add Sponsor"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sponsors List */}
        <div className="bg-[var(--card-bg)] rounded-xl shadow-md border border-[var(--border-color)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)]">
            <h3 className="text-xl font-semibold text-[var(--color-green-deep)]">
              Current Sponsors
            </h3>
          </div>
          
          {loading ? (
             <div className="p-8 text-center opacity-70 animate-pulse">Loading sponsors...</div>
          ) : sponsors.length === 0 ? (
             <div className="p-8 text-center opacity-70">No sponsors added yet.</div>
          ) : (
            <div className="divide-y divide-[var(--border-color)]">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-[var(--secondary-card-bg)] transition-colors group gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-16 h-16 shrink-0 relative bg-white/5 rounded-md flex items-center justify-center p-2 overflow-hidden border border-[var(--border-color)]">
                      <img 
                        src={sponsor.logo_url} 
                        alt={sponsor.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col items-start text-left">
                      <h4 className="font-bold text-lg truncate w-full">{sponsor.name}</h4>
                      {sponsor.website_url && (
                        <a 
                          href={sponsor.website_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-sm opacity-60 hover:text-[var(--color-gold-accent)] hover:underline flex items-center gap-1 truncate w-full"
                        >
                          <span className="truncate max-w-[200px]">{sponsor.website_url}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        onClick={() => handleDelete(sponsor.id, sponsor.logo_url)}
                        className="p-2 text-[var(--main-text)] opacity-40 hover:opacity-100 hover:text-[var(--color-red-danger)] hover:bg-[var(--color-red-danger)]/10 rounded-md transition-all"
                        title="Delete Sponsor"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
