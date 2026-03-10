/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface PublicProduct {
  id: string;
  name: string;
  description: string;
}

interface PublicVariant {
  id: string;
  name: string;
  size: string;
  design: string;
  price: number;
  image_url: string;
  stock_quantity: number;
}

export default function ShopPage() {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [variants, setVariants] = useState<PublicVariant[]>([]);

  // Available grouped options
  const [availableDesigns, setAvailableDesigns] = useState<{ name: string, image: string }[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  // Selected State
  const [design, setDesign] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  // Derived State replacing useEffect
  const matchedVariant = design && size
    ? variants.find((v) => v.design === design && v.size === size)
    : design
      ? variants.find((v) => v.design === design)
      : null;

  const currentPrice = matchedVariant?.price ?? 899;
  const currentImage = matchedVariant?.image_url
    || availableDesigns.find((d) => d.name === design)?.image
    || "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSizeChartModal, setShowSizeChartModal] = useState(false);

  // Fetch shop data
  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);

      const { data: prodData } = await supabase
        .from("shop_products")
        .select("id, name, description")
        .eq("is_active", true)
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (prodData) {
        setProduct(prodData);

        const { data: varData } = await supabase
          .from("shop_product_variants")
          .select("id, name, size, design, price, image_url, stock_quantity")
          .eq("product_id", prodData.id)
          .eq("is_active", true)
          .gt("stock_quantity", 0);

        if (varData && varData.length > 0) {
          setVariants(varData);

          const designsMap = new Map();
          const sizesSet = new Set<string>();

          varData.forEach(v => {
            if (v.design && !designsMap.has(v.design)) {
              designsMap.set(v.design, v.image_url || "/images/placeholder.png");
            }
            if (v.size) {
              sizesSet.add(v.size);
            }
          });

          const uniqueDesigns = Array.from(designsMap.entries()).map(([vName, image]) => ({ name: vName, image }));
          const uniqueSizes = Array.from(sizesSet).sort((a, b) => {
            const order = ["S", "M", "L", "XL", "XXL"];
            return order.indexOf(a) - order.indexOf(b);
          });

          setAvailableDesigns(uniqueDesigns);
          setAvailableSizes(uniqueSizes);

          if (uniqueDesigns.length > 0) {
            setDesign(uniqueDesigns[0].name);
          }
        }
      }
      setLoading(false);
    };

    fetchShopData();
  }, []);

  // The useEffect causing the ESLint error has been removed.

  const subtotal = currentPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleAddToBag = () => {
    if ((availableDesigns.length > 0 && !design) ||
      (availableSizes.length > 0 && !size)) return;
    setShowCheckout(true);
    setTimeout(() => {
      document.getElementById("checkout-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#FFF4E0] text-black font-sans pb-20 selection:bg-pink-400 selection:text-white">
      {/* HEADER SECTION */}
      <header className="fixed top-0 w-full z-50 bg-[#FFD700] border-b-4 border-black px-6 py-4 flex justify-between items-center shadow-[0_4px_0_0_#000]">
        <div className="flex items-center gap-4">
          <img
            src="/images/logo.jpg"
            alt="Pocket Kerala"
            className="w-12 h-12 object-cover border-2 border-black rounded-full shadow-[2px_2px_0_0_#000]"
          />
          <div className="font-black text-2xl tracking-tighter uppercase hidden sm:block">
            Pocket Kerala
          </div>
        </div>
      </header>

      <main className="pt-28 px-6 max-w-6xl mx-auto flex flex-col gap-12">
        <nav className="font-black uppercase text-lg inline-block bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0_0_#000] w-max -rotate-1">
          <a href="/" className="hover:underline decoration-2">Home</a>
          <span className="mx-2">/</span>
          <span className="text-[#FF90E8] drop-shadow-[1px_1px_0_#000]">{product?.name || "SHOP"}</span>
        </nav>

        {loading ? (
          <div className="bg-white border-4 border-black p-12 text-center text-2xl font-black uppercase shadow-[8px_8px_0_0_#000]">
            Loading shop products...
          </div>
        ) : !product ? (
          <div className="bg-white border-4 border-black p-12 text-center text-2xl font-black uppercase shadow-[8px_8px_0_0_#000]">
            <p>Products are currently being updated. Check back soon.</p>
          </div>
        ) : submitted ? (
          <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0_0_#000] animate-in zoom-in duration-300">
            <h2 className="text-4xl font-black uppercase mb-4 inline-block bg-[#FFD700] px-4 py-2 border-4 border-black shadow-[4px_4px_0_0_#000] -rotate-2">Order confirmed</h2>
            <p className="text-xl font-bold mb-8">Thank you for your order. We will contact you shortly.</p>

            <div className="bg-[#FFF4E0] border-4 border-black p-6 space-y-4 font-bold text-lg shadow-[4px_4px_0_0_#000]">
              <div className="flex justify-between border-b-2 border-black pb-2">
                <span className="text-gray-600 uppercase">Design</span>
                <span>{design}</span>
              </div>
              <div className="flex justify-between border-b-2 border-black pb-2">
                <span className="text-gray-600 uppercase">Size</span>
                <span>{size}</span>
              </div>
              <div className="flex justify-between border-b-2 border-black pb-2">
                <span className="text-gray-600 uppercase">Quantity</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between border-b-2 border-black pb-2 text-2xl">
                <span className="text-gray-600 uppercase">Amount</span>
                <span className="bg-[#FF90E8] px-2 py-1 border-2 border-black shadow-[2px_2px_0_0_#000]">Rs {subtotal}</span>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex gap-4"><span className="w-24 text-gray-600 uppercase">Name:</span> <span>{name}</span></div>
                <div className="flex gap-4"><span className="w-24 text-gray-600 uppercase">Phone:</span> <span>{phone}</span></div>
                <div className="flex gap-4"><span className="w-24 text-gray-600 uppercase">Address:</span> <span>{addressLine1}{addressLine2 ? `, ${addressLine2}` : ""}, {city}, {state} - {pincode}</span></div>
              </div>
            </div>

            <p className="mt-8 text-sm font-bold bg-black text-white p-4 uppercase animate-pulse">
              Note: This is a mock order. Payment integration will be added later.
            </p>
          </section>
        ) : (
          <>
            <section className="grid lg:grid-cols-2 gap-12 items-start">
              {/* GALLERY */}
              <div className="flex flex-col gap-4">
                <div className="bg-white border-4 border-black p-4 shadow-[12px_12px_0_0_#000]">
                  <img
                    src={currentImage}
                    alt={design || product.name || "Product Image"}
                    className="w-full aspect-square object-cover border-4 border-black shadow-[4px_4px_0_0_#000]"
                  />
                </div>

                {availableDesigns.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-2 snap-x">
                    {availableDesigns.map((d) => (
                      <button
                        key={d.name}
                        onClick={() => setDesign(d.name)}
                        className={`shrink-0 w-24 h-24 border-4 border-black transition-all snap-center
                          ${design === d.name
                            ? "shadow-[inset_0_0_0_4px_#FF90E8] translate-y-1 bg-black"
                            : "shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000] bg-white"
                          }`}
                      >
                        <img src={d.image} alt={d.name} className={`w-full h-full object-cover ${design === d.name ? "opacity-90" : ""}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PRODUCT DETAILS */}
              <div className="flex flex-col gap-8 bg-white border-4 border-black p-8 shadow-[12px_12px_0_0_#000]">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 leading-tight">{product.name}</h1>
                  <p className="text-xl font-medium border-l-4 border-[#FF90E8] pl-4">{product.description}</p>
                </div>

                <div className="flex items-end gap-4">
                  <span className="text-5xl font-black bg-[#FFD700] px-4 py-2 border-4 border-black shadow-[4px_4px_0_0_#000] -rotate-2">Rs {currentPrice}</span>
                  <span className="font-bold text-gray-600 uppercase text-sm mb-2 pb-1 inline-block border-b-2 border-black">Inclusive of all taxes</span>
                </div>

                {/* DESIGNS */}
                {availableDesigns.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <label className="font-black uppercase text-xl">Design</label>
                    <div className="flex flex-wrap gap-4">
                      {availableDesigns.map((d) => (
                        <button
                          key={d.name}
                          onClick={() => setDesign(d.name)}
                          className={`flex items-center gap-2 border-4 border-black p-2 font-bold uppercase transition-all
                            ${design === d.name
                              ? "bg-[#FF90E8] shadow-[2px_2px_0_0_#000] translate-y-1"
                              : "bg-white shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000]"
                            }`}
                        >
                          <img src={d.image} alt={d.name} className="w-12 h-12 border-2 border-black object-cover" />
                          <span className="px-2">{d.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SIZES */}
                {availableSizes.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <label className="font-black uppercase text-xl">Size</label>
                      <button
                        onClick={() => setShowSizeChartModal(true)}
                        className="font-bold hover:underline decoration-2 text-sm uppercase bg-[#FFF4E0] border-2 border-black px-2 py-1 shadow-[2px_2px_0_0_#000]"
                      >
                        Size guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {availableSizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`w-14 h-14 border-4 border-black font-black text-xl flex items-center justify-center transition-all
                            ${size === s
                              ? "bg-[#FFD700] shadow-[2px_2px_0_0_#000] translate-y-1"
                              : "bg-white shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000]"
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SIZE MODAL */}
                {showSizeChartModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowSizeChartModal(false)}>
                    <div className="bg-white border-4 border-black shadow-[12px_12px_0_0_#000] max-w-lg w-full p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-4">
                        <h3 className="text-3xl font-black uppercase">Size guide</h3>
                        <button
                          onClick={() => setShowSizeChartModal(false)}
                          className="w-10 h-10 bg-[#FF90E8] border-4 border-black flex items-center justify-center font-black shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000]"
                        >
                          X
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-bold border-collapse border-4 border-black">
                          <thead className="bg-[#FFD700] border-b-4 border-black uppercase">
                            <tr>
                              <th className="p-3 border-r-4 border-black">Size</th>
                              <th className="p-3 border-r-4 border-black">Chest</th>
                              <th className="p-3 border-r-4 border-black">Length</th>
                              <th className="p-3">Shoulder</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b-4 border-black"><td className="p-3 border-r-4 border-black bg-[#FFF4E0]">S</td><td className="p-3 border-r-4 border-black">36"</td><td className="p-3 border-r-4 border-black">26"</td><td className="p-3">16"</td></tr>
                            <tr className="border-b-4 border-black"><td className="p-3 border-r-4 border-black bg-[#FFF4E0]">M</td><td className="p-3 border-r-4 border-black">38"</td><td className="p-3 border-r-4 border-black">27"</td><td className="p-3">17"</td></tr>
                            <tr className="border-b-4 border-black"><td className="p-3 border-r-4 border-black bg-[#FFF4E0]">L</td><td className="p-3 border-r-4 border-black">40"</td><td className="p-3 border-r-4 border-black">28"</td><td className="p-3">18"</td></tr>
                            <tr className="border-b-4 border-black"><td className="p-3 border-r-4 border-black bg-[#FFF4E0]">XL</td><td className="p-3 border-r-4 border-black">42"</td><td className="p-3 border-r-4 border-black">29"</td><td className="p-3">19"</td></tr>
                            <tr><td className="p-3 border-r-4 border-black bg-[#FFF4E0]">XXL</td><td className="p-3 border-r-4 border-black">44"</td><td className="p-3 border-r-4 border-black">30"</td><td className="p-3">20"</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* QUANTITY */}
                <div className="flex flex-col gap-2 w-max">
                  <label className="font-black uppercase text-xl">Quantity</label>
                  <div className="flex items-center border-4 border-black shadow-[4px_4px_0_0_#000] bg-white w-max">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-12 h-12 flex items-center justify-center font-black text-2xl hover:bg-[#FF90E8] transition-colors border-r-4 border-black"
                    >
                      -
                    </button>
                    <span className="w-16 h-12 flex items-center justify-center font-black text-xl bg-[#FFF4E0]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-12 h-12 flex items-center justify-center font-black text-2xl hover:bg-[#FFD700] transition-colors border-l-4 border-black"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <button
                    onClick={handleAddToBag}
                    disabled={!design || !size}
                    className="flex-1 bg-black text-white px-8 py-4 font-black text-xl uppercase border-4 border-black shadow-[6px_6px_0_0_#FFD700] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#FFD700] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to bag
                  </button>
                  <button
                    onClick={handleAddToBag}
                    disabled={!design || !size}
                    className="flex-1 bg-[#FF90E8] text-black px-8 py-4 font-black text-xl uppercase border-4 border-black shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy now
                  </button>
                </div>

                {/* TRUST BADGES */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-bold text-sm uppercase mt-4 border-t-4 border-black pt-8">
                  <div className="flex flex-col items-center text-center gap-2 p-4 bg-[#FFF4E0] border-4 border-black shadow-[4px_4px_0_0_#000] rotate-1">
                    <span className="text-3xl">🚚</span>
                    <span>Free delivery on orders above Rs 500</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2 p-4 bg-[#FFD700] border-4 border-black shadow-[4px_4px_0_0_#000] -rotate-1">
                    <span className="text-3xl">🔒</span>
                    <span>Secure payment via Razorpay</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2 p-4 bg-[#23A094] text-white border-4 border-black shadow-[4px_4px_0_0_#000] rotate-1">
                    <span className="text-3xl">🔄</span>
                    <span>7-day easy<br />returns</span>
                  </div>
                </div>
              </div>
            </section>

            {/* CHECKOUT FORM */}
            <section id="checkout-section" className={`mt-16 overflow-hidden transition-all duration-500 ease-in-out ${showCheckout ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="bg-[#90A8ED] border-4 border-black p-8 md:p-12 shadow-[12px_12px_0_0_#000] relative">
                <h2 className="text-4xl font-black uppercase mb-8 inline-block bg-white px-6 py-3 border-4 border-black shadow-[4px_4px_0_0_#000] -rotate-1">Delivery details</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="font-black uppercase text-lg">Full name *</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full border-4 border-black p-3 font-bold bg-[#FFF4E0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF90E8] transition-all placeholder-gray-500"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="phone" className="font-black uppercase text-lg">Phone number *</label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        className="w-full border-4 border-black p-3 font-bold bg-[#FFF4E0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF90E8] transition-all placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="address1" className="font-black uppercase text-lg">Address line 1 *</label>
                    <input
                      id="address1"
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="House / flat no., building, street"
                      className="w-full border-4 border-black p-3 font-bold bg-[#FFF4E0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF90E8] transition-all placeholder-gray-500"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="address2" className="font-black uppercase text-lg">Address line 2 (optional)</label>
                    <input
                      id="address2"
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Area, landmark"
                      className="w-full border-4 border-black p-3 font-bold bg-[#FFF4E0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF90E8] transition-all placeholder-gray-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="city" className="font-black uppercase text-lg">City *</label>
                      <input
                        id="city"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full border-4 border-black p-3 font-bold bg-[#FFF4E0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF90E8] transition-all placeholder-gray-500"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="state" className="font-black uppercase text-lg">State *</label>
                      <input
                        id="state"
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        className="w-full border-4 border-black p-3 font-bold bg-[#FFF4E0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF90E8] transition-all placeholder-gray-500"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="pincode" className="font-black uppercase text-lg">Pincode *</label>
                      <input
                        id="pincode"
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="6-digit PIN"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        className="w-full border-4 border-black p-3 font-bold bg-[#FFF4E0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF90E8] transition-all placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div className="mt-8 border-t-4 border-black pt-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#FFD700] p-6 shadow-[inset_4px_4px_0_0_#000]">
                    <div className="text-2xl font-black uppercase">
                      Subtotal: <span className="bg-white px-4 py-2 border-4 border-black ml-2 shadow-[2px_2px_0_0_#000]">Rs {subtotal}</span>
                    </div>
                    <button type="submit" className="w-full md:w-auto bg-[#FF90E8] px-12 py-4 border-4 border-black font-black text-2xl uppercase shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000] transition-all">
                      Place Order →
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </>
        )}
      </main>

      {/* FOOTER SECTION */}
      <footer className="mt-20 border-t-4 border-black pt-8 flex flex-col items-center text-center gap-4">
        <div className="bg-[#FFD700] border-4 border-black p-6 shadow-[8px_8px_0_0_#000] max-w-2xl w-full">
          <h4 className="text-2xl font-black uppercase mb-4">Contact</h4>
          <div className="flex flex-col gap-2 font-bold text-lg">
            <p>EMAIL: <a href="mailto:info@pocketkerala.in" className="underline decoration-2 hover:bg-black hover:text-[#FFD700] px-1 transition-colors">info@pocketkerala.in</a></p>
            <p>PHONE: <a href="tel:+919895802679" className="underline decoration-2 hover:bg-black hover:text-[#FFD700] px-1 transition-colors">+91-9895802679</a></p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 font-bold bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000]">
          <p>
            Powered by{" "}
            <a href="https://www.instagram.com/anthonyfrison7/" target="_blank" rel="noreferrer" className="underline decoration-2 hover:bg-[#FF90E8] px-1">Frison</a>
            {" "}&{" "}
            <a href="https://infinitech.today" target="_blank" rel="noreferrer" className="underline decoration-2 hover:bg-[#90A8ED] px-1">infinitech</a>
          </p>
          <p className="text-sm border-t-2 border-black pt-2 mt-2">Copyright © 2026. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
