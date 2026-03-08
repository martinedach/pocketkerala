"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
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
  const [availableDesigns, setAvailableDesigns] = useState<{name: string, image: string}[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  // Selected State
  const [design, setDesign] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(899);
  const [currentImage, setCurrentImage] = useState("");

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
            setCurrentImage(uniqueDesigns[0].image);
          }
        }
      }
      setLoading(false);
    };

    fetchShopData();
  }, []);

  useEffect(() => {
    if (variants.length === 0) return;
    
    let matchedVariant = null;
    if (design && size) {
      matchedVariant = variants.find((v) => v.design === design && v.size === size);
    } else if (design) {
      matchedVariant = variants.find((v) => v.design === design);
    }
    
    if (matchedVariant) {
      setCurrentPrice(matchedVariant.price);
      if (matchedVariant.image_url) {
        setCurrentImage(matchedVariant.image_url);
      } else {
        const d = availableDesigns.find((d) => d.name === design);
        if (d) setCurrentImage(d.image);
      }
    } else {
      const d = availableDesigns.find((d) => d.name === design);
      if (d) setCurrentImage(d.image);
    }
  }, [design, size, variants, availableDesigns]);

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
    <>
      <SiteHeader
        languageHref="/malayalam"
        languageLabel="മലയാളം വെബ്സൈറ്റിനായി ഇവിടെ ക്ലിക്ക് ചെയ്യുക"
        variant="compact"
      />

      <main className="shop-main">
        <nav className="shop-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="shop-breadcrumb-sep">/</span>
          <span>{product?.name || "Pocket Kerala T-Shirt"}</span>
        </nav>

        {loading ? (
             <div style={{ display: "flex", justifyContent: "center", padding: "100px", opacity: 0.7 }}>
                 Loading shop products...
             </div>
        ) : !product ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
                 <p>Products are currently being updated. Check back soon.</p>
             </div>
        ) : submitted ? (
          <section className="shop-order-confirm">
            <h2 className="shop-order-confirm-title">Order confirmed</h2>
            <p className="shop-order-confirm-sub">Thank you for your order. We will contact you shortly.</p>
            <div className="shop-order-details">
              <div className="shop-order-row">
                <span className="shop-order-label">Design</span>
                <span>{design}</span>
              </div>
              <div className="shop-order-row">
                <span className="shop-order-label">Size</span>
                <span>{size}</span>
              </div>
              <div className="shop-order-row">
                <span className="shop-order-label">Quantity</span>
                <span>{quantity}</span>
              </div>
              <div className="shop-order-row">
                <span className="shop-order-label">Amount</span>
                <span>Rs {subtotal}</span>
              </div>
              <div className="shop-order-row">
                <span className="shop-order-label">Name</span>
                <span>{name}</span>
              </div>
              <div className="shop-order-row">
                <span className="shop-order-label">Phone</span>
                <span>{phone}</span>
              </div>
              <div className="shop-order-row">
                <span className="shop-order-label">Address</span>
                <span>{addressLine1}{addressLine2 ? `, ${addressLine2}` : ""}, {city}, {state} - {pincode}</span>
              </div>
            </div>
            <p className="shop-order-note">This is a mock order. Payment integration will be added later.</p>
          </section>
        ) : (
          <>
            <section className="shop-product">
              <div className="shop-gallery">
                <div className="shop-gallery-main">
                  <img
                    src={currentImage}
                    alt={design || product.name || "Product Image"}
                    className="shop-gallery-img"
                  />
                </div>
                <div className="shop-gallery-thumbs">
                  {availableDesigns.map((d) => (
                    <button
                      key={d.name}
                      type="button"
                      onClick={() => setDesign(d.name)}
                      className={`shop-thumb ${design === d.name ? "shop-thumb-active" : ""}`}
                      aria-pressed={design === d.name}
                      aria-label={`Select ${d.name}`}
                    >
                      <img src={d.image} alt={d.name} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="shop-info">
                <h1 className="shop-title">{product.name}</h1>
                <p className="shop-desc">{product.description}</p>

                <div className="shop-price-row">
                  <span className="shop-price">Rs {currentPrice}</span>
                  <span className="shop-price-note">Inclusive of all taxes</span>
                </div>

                <div className="shop-variant">
                  <label className="shop-variant-label">Design</label>
                  <div className="shop-design-grid">
                    {availableDesigns.map((d) => (
                      <button
                        key={d.name}
                        type="button"
                        onClick={() => setDesign(d.name)}
                        className={`shop-design-btn ${design === d.name ? "shop-design-btn-active" : ""}`}
                      >
                        <span className="shop-design-btn-img">
                          <img src={d.image} alt={d.name} />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="shop-variant">
                  <label className="shop-variant-label">Size</label>
                  <div className="shop-size-grid">
                    {availableSizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`shop-size-btn ${size === s ? "shop-size-btn-active" : ""}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSizeChartModal(true)}
                    className="shop-size-chart"
                  >
                    Size guide
                  </button>
                </div>

                {showSizeChartModal && (
                  <div className="shop-modal-overlay" onClick={() => setShowSizeChartModal(false)}>
                    <div className="shop-modal" onClick={(e) => e.stopPropagation()}>
                      <div className="shop-modal-header">
                        <h3 className="shop-modal-title">Size guide</h3>
                        <button
                          type="button"
                          className="shop-modal-close"
                          onClick={() => setShowSizeChartModal(false)}
                          aria-label="Close"
                        >
                          x
                        </button>
                      </div>
                      <div className="shop-modal-body">
                        <div className="shop-size-chart-table">
                          <h4>Measurements (inches)</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>Size</th>
                                <th>Chest</th>
                                <th>Length</th>
                                <th>Shoulder</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr><td>S</td><td>36</td><td>26</td><td>16</td></tr>
                              <tr><td>M</td><td>38</td><td>27</td><td>17</td></tr>
                              <tr><td>L</td><td>40</td><td>28</td><td>18</td></tr>
                              <tr><td>XL</td><td>42</td><td>29</td><td>19</td></tr>
                              <tr><td>XXL</td><td>44</td><td>30</td><td>20</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="shop-variant flex gap-4 mt-6">
                    <div className="w-auto block">
                        <label className="shop-variant-label">Quantity</label>
                        <div className="shop-qty">
                            <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="shop-qty-btn"
                            aria-label="Decrease quantity"
                            >
                            -
                            </button>
                            <span className="shop-qty-val">{quantity}</span>
                            <button
                            type="button"
                            onClick={() => setQuantity((q) => q + 1)}
                            className="shop-qty-btn"
                            aria-label="Increase quantity"
                            >
                            +
                            </button>
                        </div>
                    </div>
                </div>

                <div className="shop-actions">
                  <button
                    type="button"
                    onClick={handleAddToBag}
                    disabled={!design || !size}
                    className="shop-btn shop-btn-primary"
                  >
                    Add to bag
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToBag}
                    disabled={!design || !size}
                    className="shop-btn shop-btn-secondary"
                  >
                    Buy now
                  </button>
                </div>

                <div className="shop-trust">
                  <div className="shop-trust-item">
                    <span className="shop-trust-icon">Delivery</span>
                    <span>Free delivery on orders above Rs 500</span>
                  </div>
                  <div className="shop-trust-item">
                    <span className="shop-trust-icon">Secure</span>
                    <span>Secure payment via Razorpay</span>
                  </div>
                  <div className="shop-trust-item">
                    <span className="shop-trust-icon">Returns</span>
                    <span>7-day easy returns</span>
                  </div>
                </div>
              </div>
            </section>

            <section id="checkout-section" className={`shop-checkout ${showCheckout ? "shop-checkout-visible" : ""}`}>
              <h2 className="shop-checkout-title">Delivery details</h2>
              <form onSubmit={handleSubmit} className="shop-checkout-form">
                <div className="shop-form-grid">
                  <div className="shop-form-field">
                    <label htmlFor="name">Full name *</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="shop-form-field">
                    <label htmlFor="phone">Phone number *</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="shop-form-field">
                  <label htmlFor="address1">Address line 1 *</label>
                  <input
                    id="address1"
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House / flat no., building, street"
                  />
                </div>

                <div className="shop-form-field">
                  <label htmlFor="address2">Address line 2 (optional)</label>
                  <input
                    id="address2"
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Area, landmark"
                  />
                </div>

                <div className="shop-form-grid shop-form-grid-3">
                  <div className="shop-form-field">
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="shop-form-field">
                    <label htmlFor="state">State *</label>
                    <input
                      id="state"
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div className="shop-form-field">
                    <label htmlFor="pincode">Pincode *</label>
                    <input
                      id="pincode"
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-digit pincode"
                      pattern="[0-9]{6}"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="shop-checkout-summary">
                  <div className="shop-summary-row">
                    <span>Subtotal ({quantity} item{quantity > 1 ? "s" : ""})</span>
                    <span>Rs {subtotal}</span>
                  </div>
                  <button type="submit" className="shop-btn shop-btn-primary shop-btn-full">
                    Place order
                  </button>
                </div>
              </form>
            </section>
          </>
        )}
      </main>

      <SiteFooter contactHeading="Contact" />
    </>
  );
}
