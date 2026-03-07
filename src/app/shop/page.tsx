"use client";

import { useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

const MOCK_DESIGNS = [
  { id: "design-1", name: "Pocket Kerala Logo", description: "Classic logo print", image: "/images/logo.jpg" },
  { id: "design-2", name: "Kerala Map", description: "Minimal map outline", image: "/images/alleppy_gemini.png" },
  { id: "design-3", name: "നമ്മുടെ കേരളം", description: "Malayalam script", image: "/images/heritage.png" },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];
const PRICE = 599;

export default function ShopPage() {
  const [design, setDesign] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const selectedDesign = MOCK_DESIGNS.find((d) => d.id === design);
  const subtotal = PRICE * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleAddToBag = () => {
    if (!design || !size) return;
    setShowCheckout(true);
    document.getElementById("checkout-section")?.scrollIntoView({ behavior: "smooth" });
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
          <span>Pocket Kerala T-Shirt</span>
        </nav>

        {submitted ? (
          <section className="shop-order-confirm">
            <h2 className="shop-order-confirm-title">Order confirmed</h2>
            <p className="shop-order-confirm-sub">Thank you for your order. We will contact you shortly.</p>
            <div className="shop-order-details">
              <div className="shop-order-row">
                <span className="shop-order-label">Design</span>
                <span>{selectedDesign?.name ?? design}</span>
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
                    src={selectedDesign?.image ?? MOCK_DESIGNS[0].image}
                    alt={selectedDesign?.name ?? "Select a design"}
                    className="shop-gallery-img"
                  />
                </div>
                <div className="shop-gallery-thumbs">
                  {MOCK_DESIGNS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDesign(d.id)}
                      className={`shop-thumb ${design === d.id ? "shop-thumb-active" : ""}`}
                      aria-pressed={design === d.id}
                      aria-label={`Select ${d.name}`}
                    >
                      <img src={d.image} alt={d.name} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="shop-info">
                <h1 className="shop-title">Pocket Kerala T-Shirt</h1>
                <p className="shop-desc">Premium cotton t-shirt with exclusive Kerala-inspired designs. Unisex fit.</p>

                <div className="shop-price-row">
                  <span className="shop-price">Rs {PRICE}</span>
                  <span className="shop-price-note">Inclusive of all taxes</span>
                </div>

                <div className="shop-variant">
                  <label className="shop-variant-label">Design</label>
                  <div className="shop-design-grid">
                    {MOCK_DESIGNS.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDesign(d.id)}
                        className={`shop-design-btn ${design === d.id ? "shop-design-btn-active" : ""}`}
                      >
                        <span className="shop-design-btn-img">
                          <img src={d.image} alt={d.name} />
                        </span>
                        <span className="shop-design-btn-name">{d.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="shop-variant">
                  <label className="shop-variant-label">Size</label>
                  <div className="shop-size-grid">
                    {SIZES.map((s) => (
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
                  <a href="#" className="shop-size-chart">Size guide</a>
                </div>

                <div className="shop-variant">
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
                <div className="shop-form-grid shop-form-grid-2">
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
                    Place order (mock)
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
