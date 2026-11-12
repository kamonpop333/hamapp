"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Bell,
  Star,
  Home,
  Ticket,
  Calendar,
  User,
  ChevronLeft,
  Check,
  Plus,
  Minus,
  Tag,
  CreditCard,
  QrCode,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";

type ScreenType = "home" | "tickets" | "checkout" | "profile";

interface TripItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Tropical" | "Cities" | "Adventure" | "Events";
  price: number;
  rating: number;
  image: string;
  date: string;
  location: string;
}

interface TicketOption {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
}

interface BookingRecord {
  id: string;
  title: string;
  date: string;
  status: "Upcoming" | "Paid";
  ticketsCount: number;
  total: number;
  code: string;
}

const FEATURED_TRIPS: TripItem[] = [
  {
    id: "bangkok",
    title: "Bangkok Tour",
    subtitle: "Historical & Culture",
    category: "Cities",
    price: 75.0,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
    date: "Oct 28, 2026",
    location: "Bangkok, Thailand",
  },
  {
    id: "grand-canyon",
    title: "Grand Canyon",
    subtitle: "Nature & Hiking",
    category: "Adventure",
    price: 150.0,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=800&q=80",
    date: "Nov 04, 2026",
    location: "Arizona, USA",
  },
  {
    id: "chiang-mai",
    title: "Chiang Mai Retreat",
    subtitle: "Mountain & Temples",
    category: "Tropical",
    price: 95.0,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1598935898639-81586f7d2129?auto=format&fit=crop&w=800&q=80",
    date: "Nov 15, 2026",
    location: "Chiang Mai, Thailand",
  },
  {
    id: "lantern-fest",
    title: "Yi Peng Festival",
    subtitle: "Cultural Night Event",
    category: "Events",
    price: 120.0,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80",
    date: "Nov 24, 2026",
    location: "Northern Thailand",
  },
];

const TICKET_OPTIONS: TicketOption[] = [
  {
    id: "grand-canyon-pass",
    title: "Grand Canyon Tour",
    description: "Full-day guided rim trail & shuttle",
    price: 150.0,
    image:
      "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=400&q=80",
    badge: "Popular",
  },
  {
    id: "temple-visit",
    title: "Temple Visit Pass",
    description: "Skip-the-line heritage sanctuary entry",
    price: 75.0,
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "scenic-dining",
    title: "Scenic Dining Experience",
    description: "Sunset dinner overlooking the valley",
    price: 55.0,
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "audio-guide",
    title: "Audio Guide & Map Pack",
    description: "Offline GPS tour + 12 language tracks",
    price: 18.0,
    image:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80",
  },
];

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: "BK-8921",
    title: "Grand Canyon Tour",
    date: "Oct 25",
    status: "Upcoming",
    ticketsCount: 2,
    total: 300.0,
    code: "TRV-GC-2026-8921",
  },
  {
    id: "BK-8944",
    title: "Lantern Sky Festival",
    date: "Oct 22",
    status: "Upcoming",
    ticketsCount: 1,
    total: 120.0,
    code: "TRV-LF-2026-8944",
  },
  {
    id: "BK-7410",
    title: "Paris City Trip",
    date: "May 18",
    status: "Paid",
    ticketsCount: 2,
    total: 240.0,
    code: "TRV-PR-2026-7410",
  },
];

export default function TravelTicketPrototype() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTrip, setSelectedTrip] = useState<TripItem>(FEATURED_TRIPS[0]);

  // Ticket quantities state
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "grand-canyon-pass": 1,
    "temple-visit": 0,
    "scenic-dining": 1,
    "audio-guide": 0,
  });

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");

  // Checkout & Bookings state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "qr">("card");
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [selectedQRBooking, setSelectedQRBooking] = useState<BookingRecord | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Filter trips on Home screen
  const filteredTrips = useMemo(() => {
    return FEATURED_TRIPS.filter((trip) => {
      const matchesCategory =
        selectedCategory === "All" || trip.category === selectedCategory;
      const matchesSearch =
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Calculate ticket totals
  const selectedTicketsList = useMemo(() => {
    return TICKET_OPTIONS.filter((item) => (quantities[item.id] || 0) > 0).map(
      (item) => ({
        ...item,
        qty: quantities[item.id] || 0,
        lineTotal: item.price * (quantities[item.id] || 0),
      })
    );
  }, [quantities]);

  const subtotal = useMemo(() => {
    return selectedTicketsList.reduce((acc, item) => acc + item.lineTotal, 0);
  }, [selectedTicketsList]);

  const discount = appliedPromo === "SAVE35" ? Math.min(35, subtotal * 0.25) : 0;
  const serviceFee = subtotal > 0 ? 8.5 : 0;
  const grandTotal = Math.max(0, subtotal - discount + serviceFee);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const nextVal = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: nextVal };
    });
  };

  const handleApplyPromo = () => {
    if (promoInput.trim().toUpperCase() === "SAVE35") {
      setAppliedPromo("SAVE35");
      setPromoError("");
    } else {
      setPromoError("Try code: SAVE35");
    }
  };

  const handleSelectTrip = (trip: TripItem) => {
    setSelectedTrip(trip);
    // Pre-select matching ticket if available
    if (trip.id === "bangkok") {
      setQuantities((prev) => ({ ...prev, "temple-visit": Math.max(1, prev["temple-visit"]) }));
    } else if (trip.id === "grand-canyon") {
      setQuantities((prev) => ({
        ...prev,
        "grand-canyon-pass": Math.max(1, prev["grand-canyon-pass"]),
      }));
    }
    setActiveScreen("tickets");
  };

  const handleConfirmPayment = () => {
    if (selectedTicketsList.length === 0) return;

    const newBooking: BookingRecord = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: selectedTicketsList[0].title,
      date: "Nov 18",
      status: "Upcoming",
      ticketsCount: selectedTicketsList.reduce((sum, item) => sum + item.qty, 0),
      total: grandTotal,
      code: `TRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setShowSuccessToast(true);
    setActiveScreen("profile");
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#0B1221] flex flex-col items-center justify-center p-4 font-sans select-none">
      {/* Quick Screen Switcher Pills for Demo Presentation */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-full shadow-lg">
        <span className="text-xs font-medium text-slate-400 px-2">Prototype Screens:</span>
        {(
          [
            { id: "home", label: "1. Explore" },
            { id: "tickets", label: "2. Select Tickets" },
            { id: "checkout", label: "3. Confirmation" },
            { id: "profile", label: "4. Profile & Bookings" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveScreen(tab.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeScreen === tab.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile Phone Frame */}
      <div className="relative w-full max-w-[390px] h-[812px] bg-[#F8FAFC] rounded-[44px] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* iOS Status Bar */}
        <div className="bg-white px-7 pt-3 pb-2 flex items-center justify-between text-xs font-semibold text-slate-900 shrink-0">
          <span>09:41</span>
          <div className="w-24 h-5 bg-slate-900 rounded-full" />
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Success Toast Notification */}
        {showSuccessToast && (
          <div className="mx-4 mt-2 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-medium animate-bounce z-30">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Booking confirmed! E-ticket added to Upcoming.</span>
          </div>
        )}

        {/* ================= SCREEN 1: HOME / EXPLORE ================= */}
        {activeScreen === "home" && (
          <div className="flex-1 overflow-y-auto px-5 pt-2 pb-24 space-y-5 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                  alt="Sarah"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-100"
                />
                <div>
                  <p className="text-[11px] font-medium text-slate-400">
                    Explore Destinations
                  </p>
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    Hello, Sarah! 👋
                  </h1>
                </div>
              </div>
              <button
                onClick={() => setActiveScreen("profile")}
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition relative"
              >
                <Bell className="w-5 h-5" />
                <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2.5 right-2.5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-indigo-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search places, tours..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900">Categories</h2>
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="text-xs font-semibold text-indigo-600"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { name: "Tropical", emoji: "🏝️", bg: "bg-sky-50 text-sky-700" },
                  { name: "Cities", emoji: "🏙️", bg: "bg-purple-50 text-purple-700" },
                  { name: "Adventure", emoji: "🏔️", bg: "bg-emerald-50 text-emerald-700" },
                  { name: "Events", emoji: "🎭", bg: "bg-amber-50 text-amber-700" },
                ].map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() =>
                        setSelectedCategory(isSelected ? "All" : cat.name)
                      }
                      className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl border transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/70 shadow-sm scale-[1.02]"
                          : "border-transparent bg-slate-50/90 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-2xl mb-1">{cat.emoji}</span>
                      <span
                        className={`text-[11px] font-semibold ${
                          isSelected ? "text-indigo-700" : "text-slate-700"
                        }`}
                      >
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured Trips */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900">Featured Trips</h2>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  See all
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => handleSelectTrip(trip)}
                    className="group cursor-pointer bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                  >
                    <div className="relative h-28 w-full overflow-hidden">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {trip.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {trip.subtitle}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-extrabold text-indigo-600">
                          ${trip.price.toFixed(2)}
                        </span>
                        <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          {trip.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SCREEN 2: SELECT TICKETS ================= */}
        {activeScreen === "tickets" && (
          <div className="flex-1 overflow-y-auto px-5 pt-2 pb-28 space-y-4 bg-[#F8FAFC]">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveScreen("home")}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-base font-bold text-slate-900">Select Tickets</h1>
              <div className="w-9" />
            </div>

            {/* Banner Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> {selectedTrip.location}
                </span>
                <h2 className="text-base font-bold mt-1.5">Book Your Adventure</h2>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Instant e-ticket delivery • Free cancellation
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <Ticket className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Ticket Options List */}
            <div className="space-y-2.5">
              {TICKET_OPTIONS.map((ticket) => {
                const qty = quantities[ticket.id] || 0;
                const isSelected = qty > 0;
                return (
                  <div
                    key={ticket.id}
                    className={`bg-white rounded-2xl p-3 border transition-all flex items-center gap-3 ${
                      isSelected
                        ? "border-indigo-500 shadow-sm ring-1 ring-indigo-500/20"
                        : "border-slate-100"
                    }`}
                  >
                    <img
                      src={ticket.image}
                      alt={ticket.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold text-slate-900 truncate">
                          {ticket.title}
                        </h3>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {ticket.description}
                      </p>
                      <p className="text-xs font-extrabold text-indigo-600 mt-1">
                        ${ticket.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(ticket.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-900">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(ticket.id, 1)}
                        className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Promo Code Box */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-100">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                Promo Code (Try <span className="text-indigo-600">SAVE35</span>)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 uppercase focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-slate-800 transition"
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1.5">
                  ✓ Promo {appliedPromo} applied (-${discount.toFixed(2)})
                </p>
              )}
              {promoError && !appliedPromo && (
                <p className="text-[11px] text-amber-600 mt-1.5">{promoError}</p>
              )}
            </div>

            {/* Sticky Proceed Button */}
            <button
              disabled={selectedTicketsList.length === 0}
              onClick={() => setActiveScreen("checkout")}
              className="w-full bg-indigo-600 disabled:bg-slate-300 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition flex items-center justify-between px-5"
            >
              <span>Proceed to Payment</span>
              <span>${grandTotal.toFixed(2)}</span>
            </button>
          </div>
        )}

        {/* ================= SCREEN 3: BOOKING CONFIRMATION ================= */}
        {activeScreen === "checkout" && (
          <div className="flex-1 overflow-y-auto px-5 pt-2 pb-28 space-y-4 bg-[#F8FAFC]">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveScreen("tickets")}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-base font-bold text-slate-900">
                Booking Confirmation
              </h1>
              <div className="w-9" />
            </div>

            {/* Selected Tickets Summary */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-900">
                  Order Summary
                </span>
                <span className="text-[11px] font-semibold text-indigo-600">
                  {selectedTicketsList.reduce((s, i) => s + i.qty, 0)} Tickets
                </span>
              </div>

              {selectedTicketsList.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">
                  No tickets selected yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {selectedTicketsList.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{item.title}</p>
                        <p className="text-[11px] text-slate-400">
                          {item.qty} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900">
                        ${item.lineTotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t border-dashed border-slate-200 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Taxes & Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Promo ({appliedPromo})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-indigo-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-2.5">
              <h2 className="text-xs font-bold text-slate-900">Payment Method</h2>
              {(
                [
                  { id: "card", label: "Credit / Debit Card (•••• 4242)" },
                  { id: "apple", label: "Apple Pay / Google Pay" },
                  { id: "qr", label: "Thai QR PromptPay" },
                ] as const
              ).map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
                    paymentMethod === method.id
                      ? "border-indigo-600 bg-indigo-50/60 text-indigo-900"
                      : "border-slate-100 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    {method.label}
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      paymentMethod === method.id
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-300"
                    }`}
                  >
                    {paymentMethod === method.id && <Check className="w-2.5 h-2.5" />}
                  </span>
                </button>
              ))}
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={selectedTicketsList.length === 0}
              className="w-full bg-indigo-600 disabled:bg-slate-300 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition"
            >
              Confirm & Pay ${grandTotal.toFixed(2)}
            </button>
          </div>
        )}

        {/* ================= SCREEN 4: PROFILE & BOOKINGS ================= */}
        {activeScreen === "profile" && (
          <div className="flex-1 overflow-y-auto px-5 pt-2 pb-24 space-y-5 bg-[#F8FAFC]">
            <div className="text-center">
              <h1 className="text-base font-bold text-slate-900">
                Profile & Bookings
              </h1>
            </div>

            {/* User Profile Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                  alt="Sarah Johnson"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-50"
                />
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                  GOLD
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-3">
                Sarah Johnson
              </h2>
              <p className="text-xs text-slate-400">sarah.johnson@travel.io</p>
              <div className="grid grid-cols-3 gap-4 w-full mt-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">
                    {bookings.length}
                  </p>
                  <p className="text-[10px] text-slate-400">Trips</p>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-indigo-600">1,420</p>
                  <p className="text-[10px] text-slate-400">Points</p>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">4</p>
                  <p className="text-[10px] text-slate-400">Countries</p>
                </div>
              </div>
            </div>

            {/* My Bookings Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">My Bookings</h3>

              {/* Upcoming */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-100 space-y-2.5">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full">
                  Upcoming
                </span>
                {bookings
                  .filter((b) => b.status === "Upcoming")
                  .map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => setSelectedQRBooking(booking)}
                      className="cursor-pointer flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/60 transition"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {booking.title} — {booking.date}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {booking.ticketsCount} Ticket(s) • Tap to view E-Ticket
                        </p>
                      </div>
                      <QrCode className="w-5 h-5 text-indigo-600 shrink-0" />
                    </div>
                  ))}
              </div>

              {/* Past */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-100 space-y-2.5">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full">
                  Paid / Past
                </span>
                {bookings
                  .filter((b) => b.status === "Paid")
                  .map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => setSelectedQRBooking(booking)}
                      className="cursor-pointer flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {booking.title} — {booking.date}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Paid ${booking.total.toFixed(2)} • Receipt available
                        </p>
                      </div>
                      <QrCode className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* QR E-Ticket Modal */}
        {selectedQRBooking && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-5 z-40">
            <div className="bg-white rounded-3xl p-5 w-full max-w-[310px] text-center shadow-2xl relative">
              <button
                onClick={() => setSelectedQRBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 absolute top-4 right-4"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                Official E-Ticket
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                {selectedQRBooking.title}
              </h3>
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {selectedQRBooking.date}, 2026
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Gate A
                </span>
              </div>

              <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center">
                <QrCode className="w-32 h-32 text-slate-900" />
                <p className="text-[11px] font-mono font-bold text-slate-600 mt-2">
                  {selectedQRBooking.code}
                </p>
              </div>

              <p className="text-[11px] text-slate-400">
                Present this QR code at the entrance for {selectedQRBooking.ticketsCount}{" "}
                guest(s).
              </p>
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between z-20">
          {(
            [
              { id: "home", icon: Home, label: "Explore" },
              { id: "tickets", icon: Ticket, label: "Tickets" },
              { id: "checkout", icon: Calendar, label: "Checkout" },
              { id: "profile", icon: User, label: "Profile" },
            ] as const
          ).map((nav) => {
            const IconComponent = nav.icon;
            const isActive = activeScreen === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveScreen(nav.id)}
                className={`flex flex-col items-center gap-1 transition ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{nav.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}