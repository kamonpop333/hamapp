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
  Heart,
  ArrowRight,
  ShieldCheck,
  Compass,
  SlidersHorizontal,
} from "lucide-react";

type ScreenType = "home" | "tickets" | "checkout" | "profile";

interface TripItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Tropical" | "Cities" | "Adventure" | "Events";
  price: number;
  rating: number;
  reviews: number;
  duration: string;
  image: string;
  date: string;
  location: string;
  highlights: string[];
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
  location: string;
  date: string;
  status: "Upcoming" | "Paid";
  ticketsCount: number;
  total: number;
  code: string;
}

const FEATURED_TRIPS: TripItem[] = [
  {
    id: "bangkok",
    title: "Bangkok Grand Palace & Canal",
    subtitle: "Historical & Culture",
    category: "Cities",
    price: 75.0,
    rating: 4.8,
    reviews: 342,
    duration: "6 Hours",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
    date: "Nov 28, 2026",
    location: "Bangkok, Thailand",
    highlights: [
      "Private long-tail boat canal cruise",
      "Skip-the-line Grand Palace & Wat Arun entry",
      "Authentic Thai street food tasting",
    ],
  },
  {
    id: "grand-canyon",
    title: "Grand Canyon Rim Expedition",
    subtitle: "Nature & Hiking",
    category: "Adventure",
    price: 150.0,
    rating: 4.9,
    reviews: 518,
    duration: "Full Day",
    image:
      "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=800&q=80",
    date: "Dec 04, 2026",
    location: "Arizona, USA",
    highlights: [
      "Guided South Rim scenic viewpoint trek",
      "Luxury shuttle transport & gourmet lunch",
      "Sunset photography session",
    ],
  },
  {
    id: "chiang-mai",
    title: "Chiang Mai Misty Sanctuary",
    subtitle: "Mountain & Temples",
    category: "Tropical",
    price: 95.0,
    rating: 4.7,
    reviews: 215,
    duration: "8 Hours",
    image:
      "https://images.unsplash.com/photo-1598935898639-81586f7d2129?auto=format&fit=crop&w=800&q=80",
    date: "Dec 12, 2026",
    location: "Chiang Mai, Thailand",
    highlights: [
      "Sunrise visit to Doi Suthep mountain temple",
      "Ethical elephant sanctuary experience",
      "Organic highland coffee tasting",
    ],
  },
  {
    id: "lantern-fest",
    title: "Yi Peng Sky Lantern Night",
    subtitle: "Cultural Night Event",
    category: "Events",
    price: 120.0,
    rating: 4.9,
    reviews: 640,
    duration: "5 Hours",
    image:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80",
    date: "Dec 20, 2026",
    location: "Northern Thailand",
    highlights: [
      "VIP lakeside seating with 2 eco-lanterns",
      "Traditional Lanna dance & fire show",
      "Buffet dinner & round-trip hotel transfer",
    ],
  },
];

const TICKET_OPTIONS: TicketOption[] = [
  {
    id: "grand-canyon-pass",
    title: "Standard Explorer Pass",
    description: "Full-day guided tour + all entry fees included",
    price: 150.0,
    image:
      "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=400&q=80",
    badge: "Best Seller",
  },
  {
    id: "temple-visit",
    title: "Fast-Track VIP Entry",
    description: "Skip-the-line priority access + local guide",
    price: 75.0,
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "scenic-dining",
    title: "Sunset Dining Add-on",
    description: "3-course panoramic dinner overlooking the view",
    price: 55.0,
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80",
    badge: "Popular",
  },
  {
    id: "audio-guide",
    title: "Smart Audio & Offline Map",
    description: "Interactive GPS route + 12 language commentary",
    price: 18.0,
    image:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80",
  },
];

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: "BK-8921",
    title: "Grand Canyon Rim Expedition",
    location: "Arizona, USA",
    date: "Dec 04, 2026",
    status: "Upcoming",
    ticketsCount: 2,
    total: 300.0,
    code: "TRV-GC-2026-8921",
  },
  {
    id: "BK-8944",
    title: "Yi Peng Sky Lantern Night",
    location: "Chiang Mai, TH",
    date: "Dec 20, 2026",
    status: "Upcoming",
    ticketsCount: 1,
    total: 120.0,
    code: "TRV-LF-2026-8944",
  },
  {
    id: "BK-7410",
    title: "Paris Louvre & Seine Cruise",
    location: "Paris, France",
    date: "Sep 18, 2026",
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
  const [previewTrip, setPreviewTrip] = useState<TripItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>(["bangkok"]);

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

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter trips on Home screen
  const filteredTrips = useMemo(() => {
    return FEATURED_TRIPS.filter((trip) => {
      const matchesCategory =
        selectedCategory === "All" || trip.category === selectedCategory;
      const matchesSearch =
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const totalTicketsCount = useMemo(() => {
    return selectedTicketsList.reduce((acc, item) => acc + item.qty, 0);
  }, [selectedTicketsList]);

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
      setPromoError("Invalid code — try SAVE35");
    }
  };

  const handleBookFromPreview = (trip: TripItem) => {
    setSelectedTrip(trip);
    setPreviewTrip(null);
    if (trip.id === "bangkok") {
      setQuantities((prev) => ({
        ...prev,
        "temple-visit": Math.max(1, prev["temple-visit"]),
      }));
    } else {
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
      title: selectedTrip.title,
      location: selectedTrip.location,
      date: selectedTrip.date,
      status: "Upcoming",
      ticketsCount: totalTicketsCount,
      total: grandTotal,
      code: `TRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setShowSuccessToast(true);
    setActiveScreen("profile");
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070B14] via-[#0F172A] to-[#1E1B4B] flex flex-col items-center justify-center p-4 font-sans select-none">
      {/* Top Prototype Navigation Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full shadow-xl">
        <span className="text-[11px] font-semibold text-indigo-200 px-2 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5" /> Screens:
        </span>
        {(
          [
            { id: "home", label: "1. Explore" },
            { id: "tickets", label: "2. Tickets" },
            { id: "checkout", label: "3. Payment" },
            { id: "profile", label: "4. My Trips" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveScreen(tab.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeScreen === tab.id
                ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile Device Frame */}
      <div className="relative w-full max-w-[395px] h-[820px] bg-[#F8FAFC] rounded-[46px] border-[9px] border-slate-900 shadow-[0_25px_70px_-15px_rgba(79,70,229,0.45)] overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="bg-white/95 backdrop-blur-sm px-7 pt-3 pb-2 flex items-center justify-between text-xs font-bold text-slate-900 shrink-0 z-10">
          <span>09:41</span>
          <div className="w-24 h-5 bg-slate-950 rounded-full flex items-center justify-end px-2">
            <div className="w-2 h-2 rounded-full bg-indigo-950 ring-1 ring-indigo-500/30" />
          </div>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Toast Alert */}
        {showSuccessToast && (
          <div className="absolute top-12 inset-x-4 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold z-50 animate-bounce">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-200" />
            <div>
              <p>Payment Successful!</p>
              <p className="text-[10px] font-normal text-emerald-100">
                Your QR E-Ticket is ready in Upcoming trips.
              </p>
            </div>
          </div>
        )}

        {/* ================= SCREEN 1: EXPLORE HOME ================= */}
        {activeScreen === "home" && (
          <div className="flex-1 overflow-y-auto px-5 pt-2 pb-24 space-y-5 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/60">
            {/* User Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                    alt="Sarah"
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-sm"
                  />
                  <span className="w-3 h-3 bg-emerald-500 border-2 border-white rounded-full absolute -bottom-0.5 -right-0.5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Bangkok, TH
                  </p>
                  <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Hello, Sarah! 👋
                  </h1>
                </div>
              </div>
              <button
                onClick={() => setActiveScreen("profile")}
                className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 transition relative"
              >
                <Bell className="w-5 h-5" />
                <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2.5 right-2.5 ring-2 ring-white" />
              </button>
            </div>

            {/* Search Bar + Filter Button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where to next?"
                  className="w-full bg-white border border-slate-200/80 shadow-xs rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                />
              </div>
              <button
                onClick={() => setSelectedCategory("All")}
                className="w-11 h-11 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 flex items-center justify-center hover:bg-indigo-700 transition shrink-0"
                title="Reset filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Promo Highlight Banner */}
            <div
              onClick={() => {
                setPromoInput("SAVE35");
                setAppliedPromo("SAVE35");
                setActiveScreen("tickets");
              }}
              className="cursor-pointer relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-4 text-white shadow-lg shadow-indigo-600/20 group"
            >
              <div className="relative z-10 max-w-[75%]">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Holiday Deal
                </span>
                <h2 className="text-base font-extrabold mt-1.5 leading-snug">
                  Get 25% Off All Tours
                </h2>
                <p className="text-[11px] text-indigo-100 mt-0.5">
                  Tap to auto-apply code <span className="font-bold underline">SAVE35</span>
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/15 group-hover:scale-110 transition-transform" />
              <ArrowRight className="w-5 h-5 text-white absolute right-4 bottom-4 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-sm font-extrabold text-slate-900">Categories</h2>
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="text-[11px] font-bold text-indigo-600"
                  >
                    Show all
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: "Tropical", emoji: "🏝️" },
                  { name: "Cities", emoji: "🏙️" },
                  { name: "Adventure", emoji: "🏔️" },
                  { name: "Events", emoji: "🏮" },
                ].map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() =>
                        setSelectedCategory(isSelected ? "All" : cat.name)
                      }
                      className={`flex flex-col items-center justify-center py-3 rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/20 -translate-y-0.5"
                          : "border-slate-200/70 bg-white text-slate-700 hover:border-indigo-200"
                      }`}
                    >
                      <span className="text-xl mb-1">{cat.emoji}</span>
                      <span className="text-[11px] font-bold">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured Trips Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Popular Experiences
                </h2>
                <span className="text-[11px] font-semibold text-slate-400">
                  {filteredTrips.length} tours
                </span>
              </div>

              {filteredTrips.length === 0 ? (
                <div className="bg-white rounded-3xl p-6 text-center border border-slate-100">
                  <p className="text-xs font-bold text-slate-700">
                    No matching destinations found
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="mt-2 text-xs font-bold text-indigo-600"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredTrips.map((trip) => {
                    const isFav = favorites.includes(trip.id);
                    return (
                      <div
                        key={trip.id}
                        onClick={() => setPreviewTrip(trip)}
                        className="group cursor-pointer bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col"
                      >
                        <div className="relative h-32 w-full overflow-hidden">
                          <img
                            src={trip.image}
                            alt={trip.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          <button
                            onClick={(e) => toggleFavorite(e, trip.id)}
                            className="w-7 h-7 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center absolute top-2.5 right-2.5 shadow-sm hover:scale-110 transition"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isFav
                                  ? "fill-rose-500 text-rose-500"
                                  : "text-slate-700"
                              }`}
                            />
                          </button>
                          <span className="absolute bottom-2 left-2.5 text-[10px] font-bold text-white flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {trip.rating} ({trip.reviews})
                          </span>
                        </div>

                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                              {trip.category}
                            </p>
                            <h3 className="text-xs font-extrabold text-slate-900 line-clamp-1 mt-0.5">
                              {trip.title}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                            <div>
                              <span className="text-[10px] text-slate-400 block">
                                From
                              </span>
                              <span className="text-xs font-extrabold text-slate-900">
                                ${trip.price.toFixed(0)}
                              </span>
                            </div>
                            <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TRIP PREVIEW BOTTOM SHEET ================= */}
        {previewTrip && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-40 flex flex-col justify-end">
            <div className="bg-white rounded-t-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
              <div className="relative h-52">
                <img
                  src={previewTrip.image}
                  alt={previewTrip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <button
                  onClick={() => setPreviewTrip(null)}
                  className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-900 absolute top-4 right-4 shadow"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600 px-2.5 py-0.5 rounded-full">
                    {previewTrip.category}
                  </span>
                  <h2 className="text-lg font-extrabold mt-1.5">
                    {previewTrip.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-200 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {previewTrip.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {previewTrip.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                    Experience Highlights
                  </h3>
                  <ul className="space-y-2">
                    {previewTrip.highlights.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs text-slate-600"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-[11px] text-slate-400">Starting price</p>
                    <p className="text-xl font-extrabold text-slate-900">
                      ${previewTrip.price.toFixed(2)}
                      <span className="text-xs font-normal text-slate-400">
                        {" "}
                        / person
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleBookFromPreview(previewTrip)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition"
                  >
                    <span>Select Tickets</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
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
                className="w-9 h-9 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h1 className="text-sm font-extrabold text-slate-900">
                  Select Tickets
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">
                  Step 1 of 2
                </p>
              </div>
              <div className="w-9" />
            </div>

            {/* Selected Trip Mini Header */}
            <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex items-center gap-3">
              <img
                src={selectedTrip.image}
                alt={selectedTrip.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-indigo-600">
                  {selectedTrip.date}
                </p>
                <h2 className="text-xs font-extrabold text-slate-900 truncate">
                  {selectedTrip.title}
                </h2>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Free
                  cancellation 24h prior
                </p>
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
                    className={`bg-white rounded-2xl p-3.5 border transition-all duration-200 ${
                      isSelected
                        ? "border-indigo-500 shadow-md shadow-indigo-500/5 ring-1 ring-indigo-500/20"
                        : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-extrabold text-slate-900">
                            {ticket.title}
                          </h3>
                          {ticket.badge && (
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              {ticket.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {ticket.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-50">
                      <span className="text-sm font-extrabold text-indigo-600">
                        ${ticket.price.toFixed(2)}
                      </span>

                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(ticket.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white shadow-2xs flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-extrabold text-slate-900">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(ticket.id, 1)}
                          className="w-7 h-7 rounded-lg bg-indigo-600 shadow-2xs flex items-center justify-center text-white hover:bg-indigo-700 active:scale-95 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Promo Code Box */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-100">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                Have a promo code? (Try{" "}
                <span className="text-indigo-600 font-extrabold">SAVE35</span>)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 uppercase focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition"
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <p className="text-[11px] text-emerald-600 font-bold mt-1.5">
                  ✓ {appliedPromo} applied — You saved ${discount.toFixed(2)}!
                </p>
              )}
              {promoError && !appliedPromo && (
                <p className="text-[11px] text-rose-500 font-medium mt-1.5">
                  {promoError}
                </p>
              )}
            </div>

            {/* Sticky Checkout CTA */}
            <button
              disabled={selectedTicketsList.length === 0}
              onClick={() => setActiveScreen("checkout")}
              className="w-full bg-indigo-600 disabled:bg-slate-300 text-white font-bold text-sm py-4 rounded-2xl shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition flex items-center justify-between px-5"
            >
              <span>Continue ({totalTicketsCount} tickets)</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-lg text-xs">
                ${grandTotal.toFixed(2)}
              </span>
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
                className="w-9 h-9 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h1 className="text-sm font-extrabold text-slate-900">
                  Review & Pay
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">
                  Step 2 of 2
                </p>
              </div>
              <div className="w-9" />
            </div>

            {/* Order Receipt Card */}
            <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase">
                    Destination
                  </p>
                  <p className="text-xs font-extrabold text-slate-900">
                    {selectedTrip.title}
                  </p>
                </div>
                <span className="text-[11px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-xl">
                  {selectedTrip.date}
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

              {/* Totals */}
              <div className="border-t border-dashed border-slate-200 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Taxes & Booking Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({appliedPromo})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Due</span>
                  <span className="text-indigo-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-4 border border-slate-100 space-y-2.5">
              <h2 className="text-xs font-extrabold text-slate-900">
                Select Payment Method
              </h2>
              {(
                [
                  { id: "card", label: "Credit Card (•••• 4242)", sub: "Instant" },
                  { id: "apple", label: "Apple Pay / Google Pay", sub: "1-Tap" },
                  { id: "qr", label: "Thai QR PromptPay", sub: "Zero Fee" },
                ] as const
              ).map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition ${
                    paymentMethod === method.id
                      ? "border-indigo-600 bg-indigo-50/60 text-indigo-950"
                      : "border-slate-100 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p>{method.label}</p>
                      <p className="text-[10px] font-medium text-slate-400">
                        {method.sub}
                      </p>
                    </div>
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      paymentMethod === method.id
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-300"
                    }`}
                  >
                    {paymentMethod === method.id && <Check className="w-3 h-3" />}
                  </span>
                </button>
              ))}
            </div>

            {/* Pay Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={selectedTicketsList.length === 0}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 disabled:from-slate-300 disabled:to-slate-300 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg shadow-indigo-600/30 hover:opacity-95 transition"
            >
              Pay ${grandTotal.toFixed(2)} & Get E-Ticket
            </button>
          </div>
        )}

        {/* ================= SCREEN 4: PROFILE & BOOKINGS ================= */}
        {activeScreen === "profile" && (
          <div className="flex-1 overflow-y-auto px-5 pt-2 pb-24 space-y-5 bg-[#F8FAFC]">
            {/* Profile Banner Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-3.5 relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                  alt="Sarah Johnson"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/70"
                />
                <div>
                  <span className="inline-block bg-amber-400 text-slate-950 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Gold Member
                  </span>
                  <h2 className="text-base font-extrabold mt-1">
                    Sarah Johnson
                  </h2>
                  <p className="text-[11px] text-indigo-200">
                    sarah.johnson@travel.io
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/10 text-center relative z-10">
                <div>
                  <p className="text-base font-extrabold">{bookings.length}</p>
                  <p className="text-[10px] text-indigo-200">Bookings</p>
                </div>
                <div>
                  <p className="text-base font-extrabold text-amber-400">
                    1,420
                  </p>
                  <p className="text-[10px] text-indigo-200">Points</p>
                </div>
                <div>
                  <p className="text-base font-extrabold">4</p>
                  <p className="text-[10px] text-indigo-200">Countries</p>
                </div>
              </div>
            </div>

            {/* Upcoming Trips */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Upcoming E-Tickets
                </h3>
                <span className="text-[10px] font-bold text-indigo-600">
                  Tap ticket to scan
                </span>
              </div>

              {bookings
                .filter((b) => b.status === "Upcoming")
                .map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedQRBooking(booking)}
                    className="cursor-pointer bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs hover:border-indigo-300 hover:shadow-md transition flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="inline-block text-[9px] font-extrabold uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">
                        {booking.date}
                      </span>
                      <p className="text-xs font-extrabold text-slate-900 truncate mt-1">
                        {booking.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {booking.location} • {booking.ticketsCount} Guest(s)
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                      <QrCode className="w-5 h-5" />
                      <span className="text-[8px] font-bold mt-0.5">PASS</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Past Trips */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-extrabold text-slate-900">
                Past Adventures
              </h3>
              {bookings
                .filter((b) => b.status === "Paid")
                .map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedQRBooking(booking)}
                    className="cursor-pointer bg-white rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between opacity-85 hover:opacity-100 transition"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {booking.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {booking.date} • Paid ${booking.total.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg">
                      Completed
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= BOARDING PASS QR MODAL ================= */}
        {selectedQRBooking && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-5 z-50">
            <div className="bg-white rounded-3xl w-full max-w-[315px] shadow-2xl overflow-hidden relative">
              <div className="bg-indigo-600 p-5 text-white relative">
                <button
                  onClick={() => setSelectedQRBooking(null)}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white absolute top-4 right-4"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                  Mobile Boarding Pass
                </span>
                <h3 className="text-base font-extrabold mt-1 pr-6">
                  {selectedQRBooking.title}
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  {selectedQRBooking.location}
                </p>
              </div>

              {/* Ticket Cutout Divider */}
              <div className="relative flex items-center justify-between px-4 -mt-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-950/70 -ml-6" />
                <div className="flex-1 border-b-2 border-dashed border-slate-200" />
                <div className="w-5 h-5 rounded-full bg-slate-950/70 -mr-6" />
              </div>

              <div className="p-5 text-center">
                <div className="grid grid-cols-2 gap-3 text-left bg-slate-50 p-3 rounded-2xl mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400">DATE</p>
                    <p className="text-xs font-extrabold text-slate-900">
                      {selectedQRBooking.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">GUESTS</p>
                    <p className="text-xs font-extrabold text-slate-900">
                      {selectedQRBooking.ticketsCount} Person(s)
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 inline-flex flex-col items-center shadow-xs">
                  <QrCode className="w-32 h-32 text-slate-900" />
                  <p className="text-[11px] font-mono font-bold text-indigo-600 mt-2">
                    {selectedQRBooking.code}
                  </p>
                </div>

                <p className="text-[10px] text-slate-400 mt-3">
                  Show this QR code at the check-in counter
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Glass Navigation Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-2.5 flex items-center justify-between z-20">
          {(
            [
              { id: "home", icon: Home, label: "Explore" },
              {
                id: "tickets",
                icon: Ticket,
                label: "Tickets",
                badge: totalTicketsCount > 0 ? totalTicketsCount : undefined,
              },
              { id: "checkout", icon: Calendar, label: "Checkout" },
              { id: "profile", icon: User, label: "My Trips" },
            ] as {
              id: ScreenType;
              icon: React.ElementType;
              label: string;
              badge?: number;
            }[]
          ).map((nav) => {
            const IconComponent = nav.icon;
            const isActive = activeScreen === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveScreen(nav.id)}
                className={`relative flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <IconComponent
                  className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : ""}`}
                />
                {nav.badge !== undefined && (
                  <span className="absolute -top-0.5 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                    {nav.badge}
                  </span>
                )}
                <span className="text-[10px] font-bold">{nav.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}