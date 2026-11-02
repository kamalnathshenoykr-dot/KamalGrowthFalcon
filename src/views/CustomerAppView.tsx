import React, { useState } from 'react';
import { useApp, CustomerSubTab, DietFilterType } from '../context/AppContext';
import { BRANDS, MENU_ITEMS, SERVICE_MEETING_POINTS, AVAILABLE_COUPONS } from '../data/mockData';
import { MenuItem, Order } from '../types';
import {
  ShoppingBag,
  Plus,
  Minus,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Coins,
  MapPin,
  Bike,
  ChefHat,
  Package,
  Send,
  X,
  CreditCard,
  QrCode,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Tag,
  Users,
  Share2,
  Edit3,
  RotateCcw,
  ShieldAlert,
  Filter,
  Check,
  Building,
  KeyRound,
  RefreshCw,
  MessageSquare,
  HelpCircle,
  FileText,
  Download,
  ThumbsUp,
  Heart,
  Lock,
  UserX,
  PhoneCall,
} from 'lucide-react';

export const CustomerAppView: React.FC = () => {
  const {
    customerSubTab,
    setCustomerSubTab,
    activeBrandId,
    setActiveBrandId,
    activeCategory,
    setActiveCategory,
    cart,
    addToCart,
    updateCartQuantity,
    falconCredits,
    redeemCredits,
    setRedeemCredits,
    placeOrder,
    orders,
    reviews,
    updateOrderStatus,
    addReviewToOrder,
    rules,
    // Phase 1 Context
    dietFilter,
    setDietFilter,
    hideSoldOut,
    setHideSoldOut,
    soldOutItemIds,
    appliedCoupon,
    couponCodeInput,
    setCouponCodeInput,
    couponError,
    suggestedCoupon,
    applyCoupon,
    removeCoupon,
    allergyNote,
    setAllergyNote,
    gateInstructions,
    setGateInstructions,
    landmark,
    setLandmark,
    scheduledTime,
    setScheduledTime,
    isGuestCheckout,
    setIsGuestCheckout,
    otpModalOpen,
    setOtpModalOpen,
    otpVerified,
    triggerOtpVerification,
    verifyOtpInput,
    serviceMeetingPoint,
    setServiceMeetingPoint,
    upiPendingState,
    setUpiPendingState,
    groupOrderActive,
    setGroupOrderActive,
    groupMembers,
    startGroupOrder,
    addGroupMemberItem,
    clearGroupOrder,
    simulatedPriceSurge,
    triggerPriceSurgeSimulation,
    confirmPriceSurge,
    dismissPriceSurge,
    customerCancelOrder,
    customerEditOrderBeforeAccept,
    oneTapReorder,
    customerAcknowledgeDelay,
    customerAnswerSpecialInstruction,
    runSyncSweep,
    syncSweepNotice,
    dismissSyncSweepNotice,
    // Phase 3, 4, 5
    requestMidDeliveryAddressChange,
    confirmMidDeliveryAddressChangeFee,
    addMidDeliveryInstruction,
    triggerSecurityGateHold,
    generateAlternateDropCode,
    reportSwappedOrder,
    submitNotReceivedClaim,
    tipRider,
    chatMessages,
    sendChatMessage,
    submitOrderComplaint,
    appealComplaint,
    requestGstInvoice,
    lunchPlanPaused,
    toggleLunchPlanPause,
    downloadUserData,
    withdrawMarketingConsent,
    marketingConsentRevoked,
    requestAccountDeletion,
    accountDeletedState,
  } = useApp();

  const [deliveryPinCode, setDeliveryPinCode] = useState('560034');
  const [customerName, setCustomerName] = useState('Aishwarya Iyer');
  const [customerPhone, setCustomerPhone] = useState('+91 98450 44102');
  const [addressLine, setAddressLine] = useState('Flat 402, Embassy Habitat, Koramangala 4th Block');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);

  // Edit pre-accept modal state
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [editAddressInput, setEditAddressInput] = useState('');
  const [editAreaInput, setEditAreaInput] = useState('');
  const [editPinInput, setEditPinInput] = useState('');

  // OTP input state inside modal
  const [enteredOtp, setEnteredOtp] = useState('');

  // Group order share modal
  const [groupShareModalOpen, setGroupShareModalOpen] = useState(false);
  const [newGroupMemberName, setNewGroupMemberName] = useState('');
  const [newGroupMemberDish, setNewGroupMemberDish] = useState('');

  // Review modal / form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTravelScore, setReviewTravelScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState(false);

  // Mid-Delivery Address Change Modal
  const [midAddressModalOpen, setMidAddressModalOpen] = useState(false);
  const [midNewAddress, setMidNewAddress] = useState('');
  const [midNewArea, setMidNewArea] = useState('Indiranagar 100ft Rd');
  const [midDistanceKm, setMidDistanceKm] = useState(0.8);
  const [midChangeResult, setMidChangeResult] = useState<{ accepted: boolean; feeRequired: boolean; fee: number; message: string } | null>(null);

  // Mid-Transit Instruction input
  const [instructionInput, setInstructionInput] = useState('');

  // Multilingual Chat Drawer
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatInputText, setChatInputText] = useState('');

  // Post-Delivery Complaint & Issue Modal
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [selectedComplaintType, setSelectedComplaintType] = useState<'missing_item' | 'wrong_item' | 'cold_food' | 'short_quantity' | 'spilled' | 'foreign_object' | 'late'>('spilled');
  const [selectedResolution, setSelectedResolution] = useState<'refund' | 'replacement'>('refund');
  const [complaintNotes, setComplaintNotes] = useState('');
  const [appealModalOpen, setAppealModalOpen] = useState(false);
  const [appealNotes, setAppealNotes] = useState('');

  // Tip Modal
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(30);

  // GST Invoice Modal
  const [gstModalOpen, setGstModalOpen] = useState(false);
  const [gstinInput, setGstinInput] = useState('29AABCG1234F1Z5');

  const activeBrand = BRANDS.find((b) => b.id === activeBrandId) || BRANDS[0];
  const brandItems = MENU_ITEMS.filter((item) => item.brandId === activeBrandId);

  // Diet Filtering
  const dietFilteredItems = brandItems.filter((item) => {
    if (dietFilter === 'veg') return item.isVeg;
    if (dietFilter === 'jain') return item.isJain;
    if (dietFilter === 'vegan') return item.isVegan;
    if (dietFilter === 'gluten_free') return item.isGlutenFree;
    if (dietFilter === 'nut_free') return item.isNutFree;
    return true;
  });

  // Sold Out Filtering
  const availabilityFilteredItems = dietFilteredItems.filter((item) => {
    const isSoldOut = item.isSoldOut || soldOutItemIds.includes(item.id);
    if (hideSoldOut && isSoldOut) return false;
    return true;
  });

  const categories = ['All', ...Array.from(new Set(availabilityFilteredItems.map((i) => i.category)))];
  const filteredItems =
    activeCategory === 'All'
      ? availabilityFilteredItems
      : availabilityFilteredItems.filter((i) => i.category === activeCategory);

  // Financial totals calculation
  const cartSubtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const couponDiscount = appliedCoupon && cartSubtotal >= appliedCoupon.minOrder ? appliedCoupon.discountAmount : 0;
  const coinsDiscount = redeemCredits ? Math.min(falconCredits, Math.floor((cartSubtotal - couponDiscount) * 0.35)) : 0;
  const totalDiscount = couponDiscount + coinsDiscount;
  const taxes = Math.round(Math.max(0, cartSubtotal - totalDiscount) * 0.05);
  const finalTotal = Math.max(0, cartSubtotal - totalDiscount + taxes);

  const currentTrackedOrder = orders.find((o) => o.id === trackedOrderId) || orders[0];

  const handlePlaceOrder = () => {
    // If phone OTP not verified and not guest checkout, ask for OTP
    if (!otpVerified && !isGuestCheckout) {
      triggerOtpVerification();
      return;
    }

    const areaMap: Record<string, string> = {
      '560034': 'Koramangala 4th Block',
      '560038': 'Indiranagar 100ft Rd',
      '560102': 'HSR Layout Sector 3',
      '560066': 'Whitefield ITPL Main Rd',
      '560103': 'Bellandur Outer Ring Rd',
    };

    // Idempotency key prevents double click duplicate charges
    const idempotencyKey = `idem-${Date.now()}-${customerPhone}`;

    const newOrder = placeOrder({
      customerName,
      customerPhone,
      pinCode: deliveryPinCode,
      area: areaMap[deliveryPinCode] || 'Bengaluru Central',
      paymentMethod,
      allergyNote,
      gateInstructions,
      landmark,
      isGuest: isGuestCheckout,
      scheduledTime: scheduledTime || undefined,
      splitPayment: redeemCredits ? { creditsUsed: coinsDiscount, upiPaid: finalTotal } : undefined,
      meetingPointAssigned: serviceMeetingPoint || undefined,
      idempotencyKey,
    });

    setIsCheckoutModalOpen(false);
    setTrackedOrderId(newOrder.id);
    setCustomerSubTab('track');
  };

  const handleAdvanceOrderStatus = () => {
    if (!currentTrackedOrder) return;
    const stages: Order['status'][] = ['Placed', 'Preparing', 'Ready', 'Out for delivery', 'Delivered'];
    const currentIdx = stages.indexOf(currentTrackedOrder.status);
    if (currentIdx < stages.length - 1) {
      updateOrderStatus(currentTrackedOrder.id, stages[currentIdx + 1]);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTrackedOrder) return;
    addReviewToOrder(
      currentTrackedOrder.id,
      reviewRating,
      reviewComment || 'Superb Bangalore meal! Authentic taste and delivered sizzling hot.',
      reviewTravelScore
    );
    setReviewComment('');
    setReviewSubmittedToast(true);
    setTimeout(() => setReviewSubmittedToast(false), 3000);
  };

  const handleApplyCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    applyCoupon(couponCodeInput, cartSubtotal);
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = verifyOtpInput(enteredOtp);
    if (ok) setEnteredOtp('');
  };

  // Curated food visual background colors and food icons for appetizing cards
  const getFoodItemGradient = (brandId: string) => {
    if (brandId === 'thali-theory') return 'from-amber-100 to-orange-100';
    if (brandId === 'bowl-republic') return 'from-emerald-100 to-teal-100';
    return 'from-rose-100 to-amber-100';
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* View Header with Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#3A2E25] tracking-tight">Customer Direct Ordering</h1>
          <p className="text-xs sm:text-sm text-[#7A6A5C] mt-0.5">
            Zero 22% commissions, 5% Falcon Coins cashback, and live Bangalore kitchen dispatch.
          </p>
        </div>

        {/* Sub-Tabs: Order | Track | Wallet | Reviews */}
        <div className="inline-flex items-center p-1 bg-white border border-orange-200 rounded-2xl shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setCustomerSubTab('order')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              customerSubTab === 'order'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Order
          </button>
          <button
            onClick={() => setCustomerSubTab('track')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              customerSubTab === 'track'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Track {currentTrackedOrder && <span className="ml-1 text-[10px] bg-black/20 px-1 rounded-full">Live</span>}
          </button>
          <button
            onClick={() => setCustomerSubTab('wallet')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              customerSubTab === 'wallet'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Wallet (₹{falconCredits})
          </button>
          <button
            onClick={() => setCustomerSubTab('reviews')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              customerSubTab === 'reviews'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#3A2E25]'
            }`}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Sync sweep notice banner if active */}
      {syncSweepNotice && (
        <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl flex items-center justify-between text-xs text-emerald-950 shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{syncSweepNotice}</span>
          </div>
          <button onClick={dismissSyncSweepNotice} className="text-emerald-800 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* ================= SUB-TAB 1: ORDER ================= */}
      {customerSubTab === 'order' && (
        <div className="space-y-6">
          {/* Brand Picker, Delivery Pin & Group Order Trigger */}
          <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-black text-[#7A6A5C] uppercase tracking-wider">
                Select Cloud Kitchen Virtual Brand
              </span>
              <div className="flex items-center space-x-2">
                {/* Group order pill button */}
                <button
                  onClick={() => {
                    if (!groupOrderActive) startGroupOrder();
                    setGroupShareModalOpen(true);
                  }}
                  className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-xl border transition ${
                    groupOrderActive
                      ? 'bg-orange-50 border-orange-300 text-orange-900 font-bold'
                      : 'bg-white border-orange-200 text-[#7A6A5C] hover:text-[#3A2E25]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-orange-600" />
                  <span>{groupOrderActive ? `Group Cart (${groupMembers.length + 1})` : 'Start Group Order'}</span>
                </button>

                {/* Pin code selector */}
                <div className="flex items-center space-x-2 text-xs bg-[#FFF8EE] px-3 py-1.5 rounded-xl border border-orange-200">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-[#7A6A5C]">Deliver to:</span>
                  <select
                    value={deliveryPinCode}
                    onChange={(e) => setDeliveryPinCode(e.target.value)}
                    className="bg-transparent text-[#3A2E25] font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="560034">560034 Koramangala</option>
                    <option value="560038">560038 Indiranagar</option>
                    <option value="560102">560102 HSR Layout</option>
                    <option value="560066">560066 Whitefield</option>
                    <option value="560103">560103 Bellandur</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Brand Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {BRANDS.map((brand) => {
                const isSelected = activeBrandId === brand.id;
                return (
                  <button
                    key={brand.id}
                    onClick={() => {
                      setActiveBrandId(brand.id);
                      setActiveCategory('All');
                    }}
                    className={`text-left p-4 rounded-2xl border transition-all food-card ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/30'
                        : 'border-orange-100 bg-white hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl">
                        {brand.id === 'thali-theory' ? '🍱' : brand.id === 'bowl-republic' ? '🥗' : '🌯'}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        {brand.badge}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-[#3A2E25] text-sm">{brand.name}</h3>
                    <p className="text-xs text-[#7A6A5C] mt-0.5">{brand.tagline}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phase 1 Filters: Dietary & Allergen Segmented Tabs + Hide Sold Out Toggle */}
          <div className="bg-white border border-orange-100 p-4 rounded-2xl shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                <span className="text-xs font-bold text-[#7A6A5C] mr-2 flex items-center space-x-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Diet:</span>
                </span>
                {(
                  [
                    { id: 'all', label: 'All Items' },
                    { id: 'veg', label: 'Pure Veg 🥬' },
                    { id: 'jain', label: 'Jain (No Onion/Garlic) ✨' },
                    { id: 'vegan', label: '100% Vegan 🌱' },
                    { id: 'gluten_free', label: 'Gluten-Free 🌾' },
                    { id: 'nut_free', label: 'Nut-Free 🥜' },
                  ] as const
                ).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDietFilter(d.id as DietFilterType)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      dietFilter === d.id
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-[#FFF8EE] text-[#7A6A5C] border border-orange-200/80 hover:bg-orange-50 hover:text-[#3A2E25]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Hide sold-out toggle */}
              <label className="flex items-center space-x-2 text-xs font-bold text-[#7A6A5C] cursor-pointer self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={hideSoldOut}
                  onChange={(e) => setHideSoldOut(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <span>Hide Sold-Out (86)</span>
              </label>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-orange-100 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    activeCategory === cat
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-[#FFF8EE] text-[#7A6A5C] hover:bg-orange-100 hover:text-[#3A2E25]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items with Allergen Chips and Sold-Out Handlers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const inCart = cart.find((c) => c.item.id === item.id);
              const isItemSoldOut = item.isSoldOut || soldOutItemIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all food-card space-y-3 shadow-xs ${
                    isItemSoldOut ? 'border-slate-200 opacity-60 bg-slate-50/70' : 'border-orange-100'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    {/* Visual Food Thumbnail */}
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${getFoodItemGradient(
                        item.brandId
                      )} flex flex-col items-center justify-center text-3xl shadow-xs flex-shrink-0 relative overflow-hidden border border-orange-200/60`}
                    >
                      <span>{item.imageEmoji}</span>
                      <span className="absolute bottom-1 right-1 text-[8px] font-bold px-1 rounded bg-black/40 text-white">
                        {item.prepTime}m
                      </span>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center p-0.5 ${
                              item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            />
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            Travel {item.travelScore}/5 ★
                          </span>
                        </div>
                        {isItemSoldOut ? (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 border border-rose-200">
                            Sold Out (86)
                          </span>
                        ) : item.statusBadge ? (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-orange-100 text-orange-800">
                            {item.statusBadge}
                          </span>
                        ) : null}
                      </div>

                      <h4 className="font-extrabold text-[#3A2E25] text-base leading-snug">{item.name}</h4>
                      <p className="text-xs text-[#7A6A5C] line-clamp-2 leading-relaxed">{item.description}</p>

                      {/* Allergen & Dietary Chips */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.allergens &&
                          item.allergens.map((alg) => (
                            <span
                              key={alg}
                              className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200/80"
                            >
                              {alg}
                            </span>
                          ))}
                        {item.isJain && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Jain
                          </span>
                        )}
                        {item.isVegan && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200">
                            Vegan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-orange-100">
                    <div>
                      <span className="text-lg font-black text-[#3A2E25]">₹{item.price}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold block">+5% Coins</span>
                    </div>

                    {isItemSoldOut ? (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">
                        Unavailable
                      </span>
                    ) : inCart ? (
                      <div className="flex items-center space-x-2 bg-orange-500 text-white rounded-xl px-3 py-1.5 shadow-xs">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="hover:bg-orange-600 p-0.5 rounded"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-extrabold text-xs px-1">{inCart.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="hover:bg-orange-600 p-0.5 rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition shadow-xs hover:scale-105 active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Cart Bar if items exist */}
          {cart.length > 0 && (
            <div className="sticky bottom-6 z-30 bg-white border border-orange-200 p-4 rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-bottom-2">
              <div>
                <p className="text-xs text-[#3A2E25]">
                  <span className="font-extrabold text-[#3A2E25]">
                    {cart.reduce((s, i) => s + i.quantity, 0)} items
                  </span>{' '}
                  in basket · Total: <span className="text-emerald-700 font-black">₹{finalTotal}</span>
                  {appliedCoupon && (
                    <span className="ml-2 text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      Coupon -₹{appliedCoupon.discountAmount}
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-orange-600 font-medium">
                  Direct Kitchen Price · Save 22% vs Swiggy/Zomato markups
                </p>
              </div>

              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold rounded-xl shadow-md shadow-orange-500/20 transition hover:scale-105"
              >
                Checkout Now →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= SUB-TAB 2: TRACK ================= */}
      {customerSubTab === 'track' && (
        <div className="space-y-6">
          {currentTrackedOrder ? (
            <div className="bg-white border border-orange-100 p-6 rounded-2xl space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                        currentTrackedOrder.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {currentTrackedOrder.status === 'Cancelled' ? 'Cancelled / Refunded' : 'Live Dispatch'}
                    </span>
                    <h3 className="text-lg font-black text-[#3A2E25]">
                      Order #{currentTrackedOrder.id} • {currentTrackedOrder.brandName}
                    </h3>
                  </div>
                  <p className="text-xs text-[#7A6A5C] mt-1">
                    Hub: {currentTrackedOrder.kitchenName} · Delivery to {currentTrackedOrder.area}
                    {currentTrackedOrder.meetingPointAssigned && (
                      <span className="ml-2 text-emerald-700 font-bold">
                        (Meeting Point: {currentTrackedOrder.meetingPointAssigned})
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Pre-accept Edit & Cancel Buttons (Phase 1 operational cases) */}
                  {currentTrackedOrder.status === 'Placed' && (
                    <>
                      <button
                        onClick={() => {
                          setEditAddressInput(currentTrackedOrder.landmark || '');
                          setEditAreaInput(currentTrackedOrder.area);
                          setEditPinInput(currentTrackedOrder.pinCode);
                          setIsEditAddressModalOpen(true);
                        }}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-orange-200 text-[#3A2E25] hover:bg-orange-50 transition flex items-center space-x-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-orange-600" />
                        <span>Edit Address</span>
                      </button>
                      <button
                        onClick={() => customerCancelOrder(currentTrackedOrder.id)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
                      >
                        Cancel (100% Refund)
                      </button>
                    </>
                  )}

                  {/* Cancel during cooking (50% refund rule per platform rules) */}
                  {currentTrackedOrder.status === 'Preparing' && (
                    <button
                      onClick={() => customerCancelOrder(currentTrackedOrder.id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
                    >
                      Cancel (50% Refund per Rules)
                    </button>
                  )}

                  <button
                    onClick={handleAdvanceOrderStatus}
                    disabled={currentTrackedOrder.status === 'Delivered' || currentTrackedOrder.status === 'Cancelled'}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl transition ${
                      currentTrackedOrder.status === 'Delivered' || currentTrackedOrder.status === 'Cancelled'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {currentTrackedOrder.status === 'Delivered'
                      ? 'Delivered ✓'
                      : currentTrackedOrder.status === 'Cancelled'
                      ? 'Cancelled'
                      : 'Simulate Next Stage →'}
                  </button>

                  {/* 1-tap reorder */}
                  {(currentTrackedOrder.status === 'Delivered' || currentTrackedOrder.status === 'Cancelled') && (
                    <button
                      onClick={() => oneTapReorder(currentTrackedOrder)}
                      className="text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90 transition flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder Meal</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Allergy Safety Notice on Tracker */}
              {currentTrackedOrder.allergyNote && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>
                      <strong>Allergen Safety Note:</strong> &quot;{currentTrackedOrder.allergyNote}&quot;
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      currentTrackedOrder.allergyAcknowledgedByKitchen
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentTrackedOrder.allergyAcknowledgedByKitchen
                      ? 'Chef Acknowledged ✓'
                      : 'Awaiting Kitchen Acknowledgment'}
                  </span>
                </div>
              )}

              {/* Special Instruction Chef Inquiry Card (Phase 2 operational case) */}
              {currentTrackedOrder.specialInstructionInquiry &&
                currentTrackedOrder.specialInstructionInquiry.status === 'pending' && (
                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3">
                    <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-sm">
                      <ChefHat className="w-5 h-5 text-amber-600" />
                      <span>Message from Head Chef:</span>
                    </div>
                    <p className="text-xs text-[#3A2E25]">
                      &quot;{currentTrackedOrder.specialInstructionInquiry.question}&quot;
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => customerAnswerSpecialInstruction(currentTrackedOrder.id, 'swap')}
                        className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Swap with {currentTrackedOrder.specialInstructionInquiry.suggestedSwap}
                      </button>
                      <button
                        onClick={() => customerAnswerSpecialInstruction(currentTrackedOrder.id, 'remove')}
                        className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Remove Item & Refund ₹80
                      </button>
                      <button
                        onClick={() => customerAnswerSpecialInstruction(currentTrackedOrder.id, 'accept')}
                        className="px-3 py-1.5 bg-white border border-orange-200 text-[#3A2E25] text-xs font-bold rounded-xl"
                      >
                        Proceed as is
                      </button>
                    </div>
                  </div>
                )}

              {/* Kitchen Delay Notice with Cancel/Refund Option (Phase 2 operational case) */}
              {currentTrackedOrder.kitchenDelayNotice && !currentTrackedOrder.kitchenDelayNotice.customerAccepted && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-xs text-rose-950 space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-rose-900">
                    <Clock className="w-4 h-4 text-rose-600 animate-spin" />
                    <span>
                      Kitchen Delay Notice (+{currentTrackedOrder.kitchenDelayNotice.delayedMinutes} mins):{' '}
                      {currentTrackedOrder.kitchenDelayNotice.reason}
                    </span>
                  </div>
                  <p className="text-[#7A6A5C]">
                    We prioritize food freshness. You may wait for your meal or cancel immediately for a 100% full
                    refund plus a ₹{rules.lateDeliveryTier1Credit} courtesy credit to your wallet.
                  </p>
                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={() => customerAcknowledgeDelay(currentTrackedOrder.id, true)}
                      className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs"
                    >
                      I Can Wait (+{currentTrackedOrder.kitchenDelayNotice.delayedMinutes}m)
                    </button>
                    <button
                      onClick={() => customerAcknowledgeDelay(currentTrackedOrder.id, false)}
                      className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs"
                    >
                      Cancel Order & Get ₹{rules.lateDeliveryTier1Credit} Credit
                    </button>
                  </div>
                </div>
              )}

              {/* Cancellation & Refund banner if cancelled */}
              {currentTrackedOrder.cancellationRefundDetails && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1">
                  <span className="font-extrabold text-slate-900">Cancellation & Refund Breakdown:</span>
                  <p>Policy: {currentTrackedOrder.cancellationRefundDetails.ruleApplied}</p>
                  <p className="text-emerald-700 font-bold">
                    Amount Refunded to Falcon Wallet: ₹{currentTrackedOrder.cancellationRefundDetails.amount}
                  </p>
                </div>
              )}

              {/* 4 Stepper Cards with animated progression */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Placed', icon: <Package className="w-4 h-4" /> },
                  { label: 'Preparing', icon: <ChefHat className="w-4 h-4" /> },
                  { label: 'Out for delivery', icon: <Bike className="w-4 h-4" /> },
                  { label: 'Delivered', icon: <CheckCircle2 className="w-4 h-4" /> },
                ].map((step, idx) => {
                  const stages: Order['status'][] = ['Placed', 'Preparing', 'Ready', 'Out for delivery', 'Delivered'];
                  const currentIdx = stages.indexOf(currentTrackedOrder.status);
                  const isPastOrCurrent = currentIdx >= (idx === 2 ? 3 : idx === 3 ? 4 : idx);
                  const isCurrent = currentTrackedOrder.status === step.label;

                  return (
                    <div
                      key={step.label}
                      className={`p-4 rounded-2xl border flex items-center space-x-3 transition-all ${
                        isCurrent
                          ? 'bg-orange-50 border-orange-400 text-orange-950 ring-2 ring-orange-400/30'
                          : isPastOrCurrent
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : 'bg-[#FFF8EE] border-orange-100 text-[#7A6A5C]/60'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl ${
                          isCurrent
                            ? 'bg-orange-500 text-white shadow-sm animate-pulse'
                            : isPastOrCurrent
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-400 border'
                        }`}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-[#7A6A5C]">Step 0{idx + 1}</p>
                        <p className="text-xs font-black text-[#3A2E25]">{step.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Multi-Brand Part Status Breakdown if applicable */}
              {currentTrackedOrder.multiBrandParts && (
                <div className="p-4 bg-[#FFF8EE] rounded-2xl border border-orange-200 space-y-2 text-xs">
                  <span className="font-extrabold text-[#3A2E25]">Multi-Brand Dispatch Coordination:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentTrackedOrder.multiBrandParts.map((part, idx) => (
                      <div key={idx} className="p-2.5 bg-white rounded-xl border border-orange-100 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-[#3A2E25]">{part.itemName}</p>
                          <p className="text-[10px] text-[#7A6A5C]">{part.brandName}</p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            part.status === 'ready'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {part.status === 'ready' ? 'Ready for Bagging' : `Cooking (${part.delayMinutes || 4}m left)`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned Rider & Items Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FFF8EE] p-5 rounded-2xl border border-orange-100 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <Bike className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#3A2E25] text-sm">
                        {currentTrackedOrder.riderName || 'Ramesh Kumar (EV Partner)'}
                      </p>
                      <p className="text-xs text-[#7A6A5C]">Ather 450X · 4.9★ (1,240 deliveries)</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#7A6A5C] pt-2 border-t border-orange-200/60">
                    <span>
                      Payment: <strong className="text-[#3A2E25]">{currentTrackedOrder.paymentMethod}</strong>
                    </span>
                    <span>
                      Target Prep: <strong className="text-emerald-700">{currentTrackedOrder.targetPrepMinutes}m</strong>
                    </span>
                  </div>
                </div>

                <div className="bg-[#FFF8EE] p-5 rounded-2xl border border-orange-100 space-y-2 text-xs">
                  <span className="font-extrabold text-[#3A2E25]">Items Ordered:</span>
                  <div className="space-y-1">
                    {currentTrackedOrder.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between text-[#7A6A5C]">
                        <span>
                          {i.quantity}x {i.name}
                        </span>
                        <span className="text-[#3A2E25] font-bold">₹{i.price * i.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2 border-t border-orange-200/60 text-[#3A2E25] font-black text-sm">
                    <span>Total Paid</span>
                    <span className="text-emerald-700">₹{currentTrackedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* In-Transit Special Cases & Exception Banner (Phase 3) */}
              <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-orange-100">
                  <div className="flex items-center space-x-2">
                    <Bike className="w-4 h-4 text-orange-600" />
                    <span className="font-extrabold text-sm text-[#3A2E25]">Live Delivery & Exception Handling</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setChatDrawerOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 text-xs font-bold flex items-center space-x-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat with Rider (Auto-Translate)</span>
                      <span className="ml-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </button>
                    {currentTrackedOrder.status === 'Out for delivery' && (
                      <button
                        onClick={() => {
                          setMidNewAddress(currentTrackedOrder.area);
                          setMidAddressModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center space-x-1.5 transition"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Change Address Mid-Way</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Gate Hold Alert */}
                {currentTrackedOrder.securityGateHold?.active && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <span>
                        <strong>Security Gate Hold:</strong> Society gate denied vehicle entry. Delivery partner waiting at main gate.
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-200 text-amber-900 rounded-lg font-bold text-[11px]">
                      Countdown: {rules.customerAbsentWaitMin}m
                    </span>
                  </div>
                )}

                {/* Address changed banner */}
                {currentTrackedOrder.addressChangedMidDelivery && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <span>
                      ✓ Rerouted to <strong>{currentTrackedOrder.addressChangedMidDelivery.newAddress}</strong> ({currentTrackedOrder.addressChangedMidDelivery.distanceKm} km). Delivery partner credited ₹{currentTrackedOrder.addressChangedMidDelivery.extraFee} bonus.
                    </span>
                    <span className="font-extrabold text-emerald-700 text-[11px] uppercase tracking-wider">Reroute Active</span>
                  </div>
                )}

                {/* In-Transit Notes Form */}
                {currentTrackedOrder.status === 'Out for delivery' && (
                  <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                      <input
                        type="text"
                        value={instructionInput}
                        onChange={(e) => setInstructionInput(e.target.value)}
                        placeholder="Add note mid-way: e.g. 'Leave with guard', 'Call on arrival'"
                        className="w-full text-xs px-3 py-2 bg-[#FFF8EE] border border-orange-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-400 text-[#3A2E25]"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (instructionInput.trim()) {
                          addMidDeliveryInstruction(currentTrackedOrder.id, instructionInput.trim());
                          setInstructionInput('');
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center space-x-1 transition flex-shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Push to Rider Screen</span>
                    </button>
                  </div>
                )}

                {/* Mid-delivery instruction active display */}
                {currentTrackedOrder.midDeliveryInstruction && (
                  <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 flex items-center justify-between">
                    <span>
                      Active Rider Note: &quot;{currentTrackedOrder.midDeliveryInstruction}&quot;
                    </span>
                    <span className="text-[10px] text-orange-700 font-extrabold uppercase">Synced ✓</span>
                  </div>
                )}

                {/* Alternate In-App Handoff OTP if SMS Drops */}
                <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-orange-100 gap-2">
                  <div className="flex items-center space-x-2 text-[#7A6A5C]">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>In-App Fallback OTP (if SMS delayed):</span>
                    <strong className="text-base font-black text-[#3A2E25] tracking-widest bg-orange-100 px-2 py-0.5 rounded-md">
                      {currentTrackedOrder.alternateDropCode || '7419'}
                    </strong>
                  </div>
                  <button
                    onClick={() => generateAlternateDropCode(currentTrackedOrder.id)}
                    className="text-[11px] font-bold text-orange-600 hover:underline flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate Code</span>
                  </button>
                </div>
              </div>

              {/* Post-Delivery Resolution & Quality Hub (Phase 4 Cases) */}
              {currentTrackedOrder.status === 'Delivered' && (
                <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-orange-100">
                    <div>
                      <span className="font-extrabold text-sm text-[#3A2E25]">Delivered Successfully · Quality & Support</span>
                      <p className="text-[11px] text-[#7A6A5C]">
                        Complaint SLA: {rules.complaintWindowHours}h window · 100% Rider Tip Pass-Through · Tax Invoices
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setTipModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 text-xs font-bold flex items-center space-x-1 shadow-xs transition"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Tip Delivery Partner</span>
                      </button>
                      <button
                        onClick={() => setComplaintModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center space-x-1 transition"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Report Food Issue</span>
                      </button>
                      <button
                        onClick={() => setGstModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-bold flex items-center space-x-1 transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>GST Tax Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Tip given badge */}
                  {currentTrackedOrder.riderTipAmount && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <Heart className="w-4 h-4 text-amber-600 fill-amber-500" />
                        <span>
                          ₹{currentTrackedOrder.riderTipAmount} tip paid directly to {currentTrackedOrder.riderName || 'delivery partner'}!
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold text-amber-700">100% Transferred ✓</span>
                    </div>
                  )}

                  {/* Active Complaint Status Card */}
                  {currentTrackedOrder.complaint && (
                    <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-orange-950 uppercase tracking-wide">
                          Complaint: {currentTrackedOrder.complaint.type.replace('_', ' ')}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            currentTrackedOrder.complaint.status === 'appealed'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {currentTrackedOrder.complaint.status === 'appealed' ? 'Senior Desk Review' : 'Resolved'}
                        </span>
                      </div>
                      <p className="text-[#3A2E25]">{currentTrackedOrder.complaint.resolutionNote}</p>
                      {currentTrackedOrder.complaint.status !== 'appealed' && (
                        <div className="pt-1 flex items-center justify-between border-t border-orange-200/50">
                          <span className="text-[11px] text-[#7A6A5C]">Not satisfied with automated resolution?</span>
                          <button
                            onClick={() => setAppealModalOpen(true)}
                            className="text-xs font-bold text-orange-700 underline hover:text-orange-900"
                          >
                            Appeal to Senior Ops Desk →
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Swapped order banner */}
                  {currentTrackedOrder.swappedOrderReported && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                      <span>✓ Swapped bag resolved: ₹250 wallet credit given + rush re-cook initiated at kitchen hub.</span>
                      <span className="text-[10px] font-extrabold text-emerald-800 uppercase">Re-Cook Dispatched</span>
                    </div>
                  )}

                  {/* Not Received Dispute Banner */}
                  {currentTrackedOrder.notReceivedClaim && (
                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 flex items-center justify-between">
                      <span>
                        Audit In Progress: Courier GPS breadcrumbs & OTP handoff under review ({currentTrackedOrder.notReceivedClaim.status}).
                      </span>
                      <span className="text-[10px] font-extrabold text-purple-800 uppercase">Audit Ticket Open</span>
                    </div>
                  )}

                  {/* Quick Exceptions Bar */}
                  <div className="flex flex-wrap items-center justify-between pt-1 text-xs text-[#7A6A5C] gap-2">
                    <span className="text-[11px]">Special incident tools:</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => reportSwappedOrder(currentTrackedOrder.id, 'Customer received wrong items from batched order')}
                        className="text-orange-600 hover:underline font-semibold text-[11px]"
                      >
                        Report Swapped Bag
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => submitNotReceivedClaim(currentTrackedOrder.id, 'Doorbell not rung, food not found at doorstep')}
                        className="text-orange-600 hover:underline font-semibold text-[11px]"
                      >
                        Dispute: Food Not Received
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-orange-100 p-8 rounded-2xl text-center space-y-3 shadow-xs">
              <Package className="w-10 h-10 text-orange-400 mx-auto" />
              <h3 className="text-sm font-bold text-[#3A2E25]">No Active Order Selected</h3>
              <p className="text-xs text-[#7A6A5C]">
                Place an order in the Order tab to follow live kitchen prep and rider tracking.
              </p>
              <button
                onClick={() => setCustomerSubTab('order')}
                className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl"
              >
                Go to Order Menu
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= SUB-TAB 3: WALLET ================= */}
      {customerSubTab === 'wallet' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards for Wallet */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Falcon Coins</span>
              <div className="text-2xl font-black text-amber-600">₹{falconCredits}</div>
              <p className="text-xs text-[#7A6A5C]">1 Coin = ₹1 cash value</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Cashback Rate</span>
              <div className="text-2xl font-black text-emerald-600">5.0%</div>
              <p className="text-xs text-[#7A6A5C]">On all Direct App orders</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Lifetime Savings</span>
              <div className="text-2xl font-black text-[#3A2E25]">₹1,840</div>
              <p className="text-xs text-[#7A6A5C]">Saved vs Swiggy/Zomato</p>
            </div>

            <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all food-card space-y-1">
              <span className="text-xs text-[#7A6A5C] font-semibold">Corporate Plan</span>
              <div className="text-2xl font-black text-orange-600">Active</div>
              <p className="text-xs text-[#7A6A5C]">Mon-Fri tech lunch pass</p>
            </div>
          </div>

          {/* Sync Sweep button & info */}
          <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[#3A2E25]">Lost Payment Reconciliation (Sync Sweep)</h3>
                <p className="text-xs text-[#7A6A5C] mt-0.5">
                  If an app crash or network timeout occurred during UPI confirmation, our background sync sweep
                  verifies bank gateway webhooks and either releases the order or refunds to your wallet in 180 seconds.
                </p>
              </div>
              <button
                onClick={runSyncSweep}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simulate Sync Sweep</span>
              </button>
            </div>
          </div>

          {/* Corporate Lunch Plan Subscription & Pause */}
          <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800">
                    Weekly Pass
                  </span>
                  <h3 className="text-base font-extrabold text-[#3A2E25]">Falcon Daily Tech Lunch Pass</h3>
                </div>
                <p className="text-xs text-[#7A6A5C] mt-1">
                  Automated delivery Mon-Fri 1:15 PM to your corporate desk. Skip anytime before 11:30 AM without forfeiting prepaid credits.
                </p>
              </div>
              <button
                onClick={toggleLunchPlanPause}
                className={`px-4 py-2 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition ${
                  lunchPlanPaused
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                <span>{lunchPlanPaused ? 'Resume Lunch Plan' : 'Pause / Skip Today'}</span>
              </button>
            </div>
            {lunchPlanPaused && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                Notice: Lunch plan is paused for today. ₹140 daily credit retained in your balance. No meal will be prepared.
              </div>
            )}
          </div>

          {/* Customer Privacy Rights & DPDP 2023 Charter */}
          <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-orange-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-orange-600" />
                  <h3 className="text-base font-extrabold text-[#3A2E25]">Privacy, Data Governance & DPDP Rights</h3>
                </div>
                <p className="text-xs text-[#7A6A5C] mt-0.5">
                  Under the India Digital Personal Data Protection Act 2023, you maintain complete ownership of your order history and consent.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#FFF8EE] border border-orange-100 space-y-2 text-xs">
                <span className="font-bold text-[#3A2E25] block">Data Portability</span>
                <p className="text-[#7A6A5C] text-[11px]">
                  Export all past order timestamps, dietary preferences, and billing records in standard JSON format.
                </p>
                <button
                  onClick={downloadUserData}
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-orange-200 text-[#3A2E25] font-bold text-xs rounded-lg hover:bg-orange-50 flex items-center justify-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5 text-orange-600" />
                  <span>Download My Data (JSON)</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF8EE] border border-orange-100 space-y-2 text-xs">
                <span className="font-bold text-[#3A2E25] block">Marketing Consent</span>
                <p className="text-[#7A6A5C] text-[11px]">
                  Opt out of promotional WhatsApp alerts and SMS campaigns. Statutory NBFC loan repayments continue.
                </p>
                <button
                  onClick={withdrawMarketingConsent}
                  disabled={marketingConsentRevoked}
                  className={`w-full mt-1 px-3 py-1.5 font-bold text-xs rounded-lg flex items-center justify-center space-x-1 ${
                    marketingConsentRevoked
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white border border-orange-200 text-[#3A2E25] hover:bg-orange-50'
                  }`}
                >
                  <span>{marketingConsentRevoked ? 'Consent Revoked ✓' : 'Revoke Marketing'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF8EE] border border-orange-100 space-y-2 text-xs">
                <span className="font-bold text-[#3A2E25] block">Account Deletion</span>
                <p className="text-[#7A6A5C] text-[11px]">
                  Initiate 30-day grace period for permanent account scrubbing once all escrow liabilities clear.
                </p>
                <button
                  onClick={requestAccountDeletion}
                  disabled={accountDeletedState}
                  className={`w-full mt-1 px-3 py-1.5 font-bold text-xs rounded-lg flex items-center justify-center space-x-1 ${
                    accountDeletedState
                      ? 'bg-rose-100 text-rose-700 cursor-not-allowed'
                      : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>{accountDeletedState ? 'Deletion Scheduled (30d)' : 'Request Deletion'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 4: REVIEWS ================= */}
      {customerSubTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-orange-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#3A2E25]">Rate Your Growth Falcon Meal</h3>
                <p className="text-xs text-[#7A6A5C]">
                  Ratings train our kitchen prep SLA timers and biodegradable packaging insulation scores.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                {currentTrackedOrder?.id || 'GF-9485'}
              </span>
            </div>

            {reviewSubmittedToast && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Review submitted! This feedback is now visible in the Kitchen & Marketing dashboards.</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#3A2E25] font-bold block mb-1">Food Taste & Quality</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl transition ${
                          star <= reviewRating ? 'text-amber-400' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[#3A2E25] font-bold block mb-1">
                    Transit Travel Score (Crispness & Temp)
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewTravelScore(star)}
                        className={`text-2xl transition ${
                          star <= reviewTravelScore ? 'text-emerald-500' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[#3A2E25] font-bold block mb-1">Review Feedback</label>
                <textarea
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="e.g. Paratha was flaky and filter coffee was boiling hot! Loved the sealed packaging."
                  className="w-full bg-[#FFF8EE] border border-orange-200 rounded-xl p-3 text-[#3A2E25] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl text-xs transition shadow-xs hover:scale-105"
              >
                Submit Review
              </button>
            </form>
          </div>

          {/* Past Reviews Feed */}
          <div className="bg-white border border-orange-100 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#3A2E25]">Verified Customer Review Feed</h3>
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-[#FFF8EE] border border-orange-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#3A2E25]">{rev.customerName}</span>
                      <span className="text-[#7A6A5C] text-[11px] ml-2">· {rev.brandName}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-amber-500 font-bold">
                      <span>{rev.rating}★</span>
                      <span className="text-[#7A6A5C] text-[10px]">({rev.timeAgo})</span>
                    </div>
                  </div>
                  <p className="text-[#3A2E25] italic">&quot;{rev.reviewText}&quot;</p>
                  <div className="flex items-center justify-between text-[11px] text-[#7A6A5C] pt-1 border-t border-orange-200/50">
                    <span>Dish: {rev.dishName}</span>
                    <span className="text-emerald-700 font-bold">Travel Score: {rev.travelRating}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: CHECKOUT MODAL ================= */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-[#FFF8EE] border border-orange-200 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <h3 className="text-base font-extrabold text-[#3A2E25] flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                <span>Confirm Direct Order (Save 22%)</span>
              </h3>
              <button onClick={() => setIsCheckoutModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs max-h-[65vh] overflow-y-auto pr-1 no-scrollbar">
              {/* Customer Info & Guest Checkout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#3A2E25] font-bold block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-[#3A2E25] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label className="text-[#3A2E25] font-bold block mb-1">Mobile Phone (Bangalore)</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-[#3A2E25] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Guest Checkout Toggle */}
              <label className="flex items-center space-x-2 text-[11px] font-bold text-[#7A6A5C] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGuestCheckout}
                  onChange={(e) => setIsGuestCheckout(e.target.checked)}
                  className="rounded text-orange-600"
                />
                <span>Guest Checkout (Skip account creation, instant checkout)</span>
              </label>

              {/* Delivery Address & Gated Society Info */}
              <div className="space-y-2">
                <label className="text-[#3A2E25] font-bold block">Bangalore Delivery Address</label>
                <textarea
                  rows={2}
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-[#3A2E25] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />

                {/* Gated Society Fields: Gate code + landmark */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[#7A6A5C] font-bold block mb-1 flex items-center space-x-1">
                      <KeyRound className="w-3.5 h-3.5 text-orange-600" />
                      <span>Gate Code / Entry Instructions</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tower B Gate 3, dial 402 on MyGate"
                      value={gateInstructions}
                      onChange={(e) => setGateInstructions(e.target.value)}
                      className="w-full bg-white border border-orange-200 rounded-xl p-2 text-[#3A2E25] placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="text-[#7A6A5C] font-bold block mb-1 flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-orange-600" />
                      <span>Nearby Landmark</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Opp. Wipro Gate 5, near Cafe Coffee Day"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full bg-white border border-orange-200 rounded-xl p-2 text-[#3A2E25] placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Meeting Point Fallback (Outside Boundary / Society Guard Gate) */}
              <div className="bg-white p-3 rounded-xl border border-orange-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#3A2E25] flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    <span>Designated Service Meeting Point (Optional)</span>
                  </span>
                  {serviceMeetingPoint && (
                    <button
                      onClick={() => setServiceMeetingPoint(null)}
                      className="text-[10px] text-rose-600 font-bold hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#7A6A5C]">
                  Outside direct rider boundary or want quick roadside handover? Select a verified junction:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {SERVICE_MEETING_POINTS.map((mp) => (
                    <button
                      key={mp.id}
                      type="button"
                      onClick={() => setServiceMeetingPoint(mp.name)}
                      className={`text-left p-2 rounded-lg border text-[11px] transition ${
                        serviceMeetingPoint === mp.name
                          ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold'
                          : 'border-orange-100 bg-[#FFF8EE] text-[#7A6A5C] hover:border-orange-200'
                      }`}
                    >
                      <p className="font-bold truncate">{mp.name}</p>
                      <p className="text-[10px] opacity-70">Distance: {mp.distance}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Timing: Instant vs Scheduled */}
              <div className="space-y-1.5">
                <label className="text-[#3A2E25] font-bold block flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>Delivery Timing</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduledTime(null)}
                    className={`p-2.5 rounded-xl border font-bold text-center transition ${
                      scheduledTime === null
                        ? 'border-orange-500 bg-orange-100 text-orange-900 ring-1 ring-orange-500'
                        : 'border-orange-100 bg-white text-[#7A6A5C]'
                    }`}
                  >
                    ⚡ Instant (18-25 mins)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduledTime('Tonight, 8:30 PM (Dinner Slot)')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition ${
                      scheduledTime !== null
                        ? 'border-orange-500 bg-orange-100 text-orange-900 ring-1 ring-orange-500'
                        : 'border-orange-100 bg-white text-[#7A6A5C]'
                    }`}
                  >
                    📅 Schedule (Tonight 8:30 PM)
                  </button>
                </div>
              </div>

              {/* Prominent Red-Accented Allergy Note (Highlighted on KDS ticket) */}
              <div className="space-y-1.5 bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200">
                <label className="text-rose-950 font-extrabold flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Chef Allergy Alert (Highlighted in Red on Kitchen KDS)</span>
                </label>
                <p className="text-[11px] text-rose-900/80">
                  Must be acknowledged by head chef before cooking begins.
                </p>
                <textarea
                  rows={2}
                  placeholder="e.g. Severe peanut & shellfish allergy. Please use fresh segregated pans and ladles."
                  value={allergyNote}
                  onChange={(e) => setAllergyNote(e.target.value)}
                  className="w-full bg-white border border-rose-300 rounded-xl p-2.5 text-[#3A2E25] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {/* Coupon Promo Code Input */}
              <div className="space-y-1.5">
                <label className="text-[#3A2E25] font-bold block flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-600" />
                  <span>Promo Code & Discounts</span>
                </label>
                <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter FALCON50 or WELCOME100"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="flex-1 bg-white border border-orange-200 rounded-xl px-3 py-2 text-[#3A2E25] uppercase font-bold focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white font-bold rounded-xl text-xs shadow-xs"
                  >
                    Apply
                  </button>
                </form>

                {/* Feedback for coupon status / suggestions */}
                {appliedCoupon && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px]">
                    <span className="font-bold">
                      ✓ Coupon {appliedCoupon.code} applied! (-₹{appliedCoupon.discountAmount})
                    </span>
                    <button onClick={removeCoupon} className="text-rose-600 font-bold hover:underline">
                      Remove
                    </button>
                  </div>
                )}
                {couponError && (
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] space-y-1">
                    <p className="font-bold">{couponError}</p>
                    {suggestedCoupon && (
                      <p className="text-slate-700">
                        Recommendation: Use{' '}
                        <strong
                          className="text-orange-700 underline cursor-pointer"
                          onClick={() => {
                            setCouponCodeInput(suggestedCoupon.code);
                            applyCoupon(suggestedCoupon.code, cartSubtotal);
                          }}
                        >
                          {suggestedCoupon.code}
                        </strong>{' '}
                        for ₹{suggestedCoupon.discountAmount} discount.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Methods & Split Payment */}
              <div>
                <label className="text-[#3A2E25] font-bold block mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Card', 'COD'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 rounded-xl border font-bold text-center transition ${
                        paymentMethod === method
                          ? 'border-orange-500 bg-orange-100 text-orange-900 ring-1 ring-orange-500'
                          : 'border-orange-100 bg-white text-[#7A6A5C]'
                      }`}
                    >
                      {method === 'UPI' ? '⚡ UPI' : method === 'Card' ? '💳 Card' : '💵 Cash'}
                    </button>
                  ))}
                </div>

                {/* Split payment with Falcon credits toggle */}
                {falconCredits > 0 && (
                  <label className="flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={redeemCredits}
                      onChange={(e) => setRedeemCredits(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>
                      Split Payment: Pay ₹{coinsDiscount} with Falcon Credits + ₹{finalTotal} via {paymentMethod}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Total and Dispatch Button */}
            <div className="border-t border-orange-200 pt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#7A6A5C] block">Total Payable</span>
                <span className="text-base font-black text-emerald-700">₹{finalTotal}</span>
                {totalDiscount > 0 && (
                  <span className="text-[10px] text-orange-600 block">Total Saved: ₹{totalDiscount}</span>
                )}
              </div>
              <button
                onClick={handlePlaceOrder}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-xl text-xs transition shadow-sm hover:scale-105 active:scale-95"
              >
                Pay & Dispatch Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: EDIT ADDRESS PRE-ACCEPTANCE ================= */}
      {isEditAddressModalOpen && currentTrackedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#FFF8EE] border border-orange-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <h3 className="text-base font-extrabold text-[#3A2E25] flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-orange-600" />
                <span>Edit Address (Before Kitchen Accept)</span>
              </h3>
              <button onClick={() => setIsEditAddressModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#3A2E25] font-bold block mb-1">Area / Locality</label>
                <input
                  type="text"
                  value={editAreaInput}
                  onChange={(e) => setEditAreaInput(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-[#3A2E25]"
                />
              </div>
              <div>
                <label className="text-[#3A2E25] font-bold block mb-1">Pin Code</label>
                <input
                  type="text"
                  value={editPinInput}
                  onChange={(e) => setEditPinInput(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-[#3A2E25]"
                />
              </div>
              <div>
                <label className="text-[#3A2E25] font-bold block mb-1">Building & Landmark</label>
                <textarea
                  rows={2}
                  value={editAddressInput}
                  onChange={(e) => setEditAddressInput(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-[#3A2E25]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-orange-200">
              <button
                onClick={() => setIsEditAddressModalOpen(false)}
                className="px-4 py-2 bg-white border border-orange-200 text-[#7A6A5C] text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  customerEditOrderBeforeAccept(
                    currentTrackedOrder.id,
                    editAddressInput,
                    editAreaInput,
                    editPinInput
                  );
                  setIsEditAddressModalOpen(false);
                }}
                className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: OTP VERIFICATION ================= */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#FFF8EE] border border-orange-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#3A2E25]">Verify Device & Phone</h3>
              <p className="text-xs text-[#7A6A5C] mt-1">
                New device detected. Enter demo OTP <strong>8492</strong> sent to {customerPhone}.
              </p>
            </div>

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="8492"
                maxLength={4}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="w-32 mx-auto text-center font-mono text-2xl tracking-widest bg-white border-2 border-orange-300 rounded-xl p-2 font-black text-[#3A2E25] focus:outline-none"
              />
              <div className="flex justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => setOtpModalOpen(false)}
                  className="px-4 py-2 bg-white border border-orange-200 text-xs font-bold rounded-xl text-[#7A6A5C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Confirm OTP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: GROUP ORDER COLLABORATION ================= */}
      {groupShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#FFF8EE] border border-orange-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <h3 className="text-base font-extrabold text-[#3A2E25] flex items-center space-x-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span>Office Group Order & Split Cart</span>
              </h3>
              <button onClick={() => setGroupShareModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-orange-200 space-y-1">
                <span className="font-bold text-[#3A2E25] block">Shareable Group Cart Link:</span>
                <div className="flex items-center justify-between bg-orange-50 p-2 rounded-lg font-mono text-[11px] text-orange-950">
                  <span>growthfalcon.in/order/grp-821</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText('https://growthfalcon.in/order/grp-821');
                    }}
                    className="text-orange-600 font-bold hover:underline"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-2">
                <span className="font-bold text-[#3A2E25]">Group Members & Split Bill:</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {groupMembers.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 bg-white rounded-xl border border-orange-100 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-[#3A2E25]">{m.name}</p>
                        <p className="text-[10px] text-[#7A6A5C]">{m.itemsSummary}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-700">₹{m.shareAmount}</span>
                        <span className="block text-[9px] text-slate-400 font-semibold">
                          {m.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Mock Colleague Item */}
              <div className="p-3 bg-white rounded-xl border border-orange-100 space-y-2">
                <span className="font-bold text-[#3A2E25]">Add Team Member:</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Colleague Name (e.g. Rahul)"
                    value={newGroupMemberName}
                    onChange={(e) => setNewGroupMemberName(e.target.value)}
                    className="bg-[#FFF8EE] border border-orange-200 rounded-lg p-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Dish (e.g. Masala Dosa)"
                    value={newGroupMemberDish}
                    onChange={(e) => setNewGroupMemberDish(e.target.value)}
                    className="bg-[#FFF8EE] border border-orange-200 rounded-lg p-2 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (newGroupMemberName && newGroupMemberDish) {
                      addGroupMemberItem(newGroupMemberName, newGroupMemberDish, 195);
                      setNewGroupMemberName('');
                      setNewGroupMemberDish('');
                    }
                  }}
                  className="w-full py-1.5 bg-orange-500 text-white font-bold rounded-lg text-xs"
                >
                  + Add Member to Shared Bill
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-orange-200">
              <button onClick={clearGroupOrder} className="text-xs text-rose-600 font-bold hover:underline">
                End Group Session
              </button>
              <button
                onClick={() => setGroupShareModalOpen(false)}
                className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mid-Delivery Address Change Modal (Phase 3) */}
      {midAddressModalOpen && currentTrackedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-orange-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-orange-100">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <h3 className="font-extrabold text-base text-[#3A2E25]">Change Address Mid-Transit</h3>
              </div>
              <button onClick={() => { setMidAddressModalOpen(false); setMidChangeResult(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#7A6A5C]">
              Current drop area: <strong>{currentTrackedOrder.area}</strong>. Platform rule allows free rerouting within {rules.midDeliveryAddressChangeMaxKm || 1} km with a +₹25 courier incentive.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#3A2E25] block mb-1">New Address / Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. 100ft Road, Near Metro Pillar 42"
                  value={midNewAddress}
                  onChange={(e) => setMidNewAddress(e.target.value)}
                  className="w-full p-2.5 bg-[#FFF8EE] border border-orange-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#3A2E25] block mb-1">Neighborhood Area</label>
                  <input
                    type="text"
                    value={midNewArea}
                    onChange={(e) => setMidNewArea(e.target.value)}
                    className="w-full p-2.5 bg-[#FFF8EE] border border-orange-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3A2E25] block mb-1">Estimated Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={midDistanceKm}
                    onChange={(e) => setMidDistanceKm(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FFF8EE] border border-orange-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Threshold Status Feedback */}
              <div className={`p-3 rounded-xl text-xs ${midDistanceKm <= (rules.midDeliveryAddressChangeMaxKm || 1) ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-amber-50 border border-amber-300 text-amber-950'}`}>
                {midDistanceKm <= (rules.midDeliveryAddressChangeMaxKm || 1) ? (
                  <span>✓ Within {rules.midDeliveryAddressChangeMaxKm || 1} km free radius: Growth Falcon pays ₹25 reroute compensation to your delivery partner.</span>
                ) : (
                  <span>⚠️ Distance exceeds {rules.midDeliveryAddressChangeMaxKm || 1} km threshold: Requires ₹{rules.midDeliveryAddressChangeFee || 45} rerouting surcharge to re-assign dispatch corridor.</span>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-orange-100">
              <button
                onClick={() => { setMidAddressModalOpen(false); setMidChangeResult(null); }}
                className="px-4 py-2 border border-orange-200 text-[#7A6A5C] text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const res = requestMidDeliveryAddressChange(
                    currentTrackedOrder.id,
                    midNewAddress || 'Updated Street Address',
                    midNewArea,
                    midDistanceKm
                  );
                  if (res.feeRequired) {
                    confirmMidDeliveryAddressChangeFee(currentTrackedOrder.id);
                  }
                  setMidAddressModalOpen(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                {midDistanceKm <= (rules.midDeliveryAddressChangeMaxKm || 1) ? 'Confirm Free Update' : `Pay ₹${rules.midDeliveryAddressChangeFee || 45} & Reroute`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multilingual In-Transit Chat Drawer (Phase 3) */}
      {chatDrawerOpen && currentTrackedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 border-b border-orange-100 flex items-center justify-between bg-[#FFF8EE]">
              <div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                  <h3 className="font-extrabold text-sm text-[#3A2E25]">Chat with Delivery Partner</h3>
                </div>
                <p className="text-[11px] text-[#7A6A5C]">
                  {currentTrackedOrder.riderName || 'Ramesh Kumar'} · Ather EV
                </p>
              </div>
              <button onClick={() => setChatDrawerOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Translation notice banner */}
            <div className="px-4 py-2 bg-orange-100/70 border-b border-orange-200/50 flex items-center justify-between text-[11px] text-orange-900">
              <span>Auto-translating: <strong>English ⇄ Kannada / Hindi</strong></span>
              <span className="font-extrabold text-[10px] bg-white px-2 py-0.5 rounded-full text-emerald-700">Live AI ✓</span>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FFF8EE]/40 text-xs">
              {chatMessages.map((m) => {
                const isMe = m.sender === 'customer';
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-400 mb-0.5">{m.senderName} • {m.timestamp}</span>
                    <div className={`p-3 rounded-2xl max-w-[85%] space-y-1 ${isMe ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white border border-orange-200 text-[#3A2E25] rounded-bl-none shadow-xs'}`}>
                      <p className="font-medium">{m.text}</p>
                      {m.translatedText && (
                        <p className={`text-[11px] pt-1 border-t ${isMe ? 'border-orange-400/50 text-orange-100' : 'border-orange-100 text-emerald-800 font-semibold'}`}>
                          {m.translatedText}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick chips */}
            <div className="p-2 border-t border-orange-100 bg-white flex flex-wrap gap-1.5">
              {[
                "I'm heading down to the gate",
                "Please leave with security guard",
                "Don't ring bell, please call",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendChatMessage(currentTrackedOrder.id, 'customer', chip)}
                  className="px-2.5 py-1 bg-[#FFF8EE] hover:bg-orange-100 border border-orange-200 rounded-full text-[11px] font-medium text-[#3A2E25]"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <div className="p-3 border-t border-orange-100 bg-white flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type in English (will translate for rider)..."
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatInputText.trim()) {
                    sendChatMessage(currentTrackedOrder.id, 'customer', chatInputText.trim());
                    setChatInputText('');
                  }
                }}
                className="flex-1 text-xs px-3 py-2 bg-[#FFF8EE] border border-orange-200 rounded-xl focus:outline-none"
              />
              <button
                onClick={() => {
                  if (chatInputText.trim()) {
                    sendChatMessage(currentTrackedOrder.id, 'customer', chatInputText.trim());
                    setChatInputText('');
                  }
                }}
                className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Delivery Complaint & Resolution Modal (Phase 4) */}
      {complaintModalOpen && currentTrackedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-orange-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-orange-100">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-base text-[#3A2E25]">Report Food Issue / Quality SLA</h3>
              </div>
              <button onClick={() => setComplaintModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#7A6A5C]">
              Order #{currentTrackedOrder.id} • Window: {rules.complaintWindowHours}h. If reported outside 48 hours, a courtesy ₹40 coupon is issued per platform rules.
            </p>

            {/* Complaint category picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3A2E25]">Select Issue Category:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'spilled', label: 'Spilled / Leaking Container' },
                  { id: 'missing_item', label: 'Missing Item' },
                  { id: 'wrong_item', label: 'Wrong Item Delivered' },
                  { id: 'cold_food', label: 'Cold / Inadequate Insulation' },
                  { id: 'short_quantity', label: 'Short Quantity / Portion' },
                  { id: 'foreign_object', label: 'Foreign Object (Safety Fast-Track)' },
                  { id: 'late', label: 'Severe Delivery Delay' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedComplaintType(cat.id as any)}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition ${
                      selectedComplaintType === cat.id
                        ? 'bg-rose-50 border-rose-400 text-rose-900 ring-1 ring-rose-400'
                        : 'bg-[#FFF8EE] border-orange-100 text-[#3A2E25] hover:bg-orange-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Foreign object critical warning */}
            {selectedComplaintType === 'foreign_object' && (
              <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-950 text-xs space-y-1">
                <strong className="block text-rose-800 uppercase tracking-wider font-black">Critical Safety Fast-Track Trigger</strong>
                <p>Submitting this immediately pauses kitchen batch dispatch, freezes related raw ingredient inventory, and notifies the Chief Quality Officer.</p>
              </div>
            )}

            {/* Resolution Choice */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-[#3A2E25]">Preferred Resolution:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedResolution('refund')}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    selectedResolution === 'refund'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="font-extrabold">Instant Wallet Refund</p>
                  <p className="text-[11px] text-[#7A6A5C]">₹{currentTrackedOrder.totalAmount} credited to Falcon Wallet</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedResolution('replacement')}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    selectedResolution === 'replacement'
                      ? 'bg-orange-50 border-orange-400 text-orange-950 ring-1 ring-orange-400'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="font-extrabold">Free Replacement Meal</p>
                  <p className="text-[11px] text-[#7A6A5C]">Priority re-cook & expedited dispatch</p>
                </button>
              </div>
            </div>

            {/* Note & Photo */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-[#3A2E25] block">Description & Notes:</label>
              <textarea
                rows={2}
                placeholder="Please describe what happened..."
                value={complaintNotes}
                onChange={(e) => setComplaintNotes(e.target.value)}
                className="w-full p-2.5 bg-[#FFF8EE] border border-orange-200 rounded-xl"
              />
              <div className="p-3 rounded-xl border border-dashed border-orange-200 text-center text-[#7A6A5C] text-[11px]">
                Photo evidence verified automatically via visual QC model (demo placeholder included)
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-orange-100">
              <button
                onClick={() => setComplaintModalOpen(false)}
                className="px-4 py-2 border border-orange-200 text-[#7A6A5C] text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  submitOrderComplaint(
                    currentTrackedOrder.id,
                    selectedComplaintType,
                    selectedResolution,
                    undefined,
                    complaintNotes
                  );
                  setComplaintModalOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Submit & Resolve Under SLA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Senior Desk Appeal Modal (Phase 4) */}
      {appealModalOpen && currentTrackedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-orange-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-orange-100">
              <h3 className="font-extrabold text-base text-[#3A2E25]">Appeal to Senior Ops Desk</h3>
              <button onClick={() => setAppealModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#7A6A5C]">
              Your appeal will bypass automated bots and route directly to a Senior Operations Controller in Bangalore. Target SLA: 2 hours.
            </p>
            <textarea
              rows={3}
              placeholder="Why was the automated outcome unsatisfactory? Please provide details..."
              value={appealNotes}
              onChange={(e) => setAppealNotes(e.target.value)}
              className="w-full text-xs p-3 bg-[#FFF8EE] border border-orange-200 rounded-xl"
            />
            <div className="flex justify-end space-x-2 pt-2 border-t border-orange-100">
              <button onClick={() => setAppealModalOpen(false)} className="px-4 py-2 text-xs font-bold text-[#7A6A5C]">
                Cancel
              </button>
              <button
                onClick={() => {
                  appealComplaint(currentTrackedOrder.id, appealNotes || 'Diner requested senior supervisor review');
                  setAppealModalOpen(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl"
              >
                Submit Appeal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tip Delivery Partner Modal (Phase 3 & 4) */}
      {tipModalOpen && currentTrackedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-orange-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#3A2E25]">Tip {currentTrackedOrder.riderName || 'Ramesh Kumar'}</h3>
              <p className="text-xs text-[#7A6A5C] mt-1">
                100% of your tip goes directly to the delivery partner with zero platform deduction.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[20, 30, 50].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTipAmount(amt)}
                  className={`py-2.5 rounded-xl font-black text-sm border transition ${
                    tipAmount === amt
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-[#FFF8EE] text-[#3A2E25] border-orange-200 hover:bg-orange-50'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setTipModalOpen(false)}
                className="flex-1 py-2 border border-orange-200 text-[#7A6A5C] text-xs font-bold rounded-xl"
              >
                Skip
              </button>
              <button
                onClick={() => {
                  tipRider(currentTrackedOrder.id, tipAmount);
                  setTipModalOpen(false);
                }}
                className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Send ₹{tipAmount} Tip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GST Tax Invoice Modal (Phase 4) */}
      {gstModalOpen && currentTrackedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-orange-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-orange-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-slate-700" />
                <h3 className="font-extrabold text-base text-[#3A2E25]">GST Tax Invoice (PDF)</h3>
              </div>
              <button onClick={() => setGstModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#FFF8EE] border border-orange-100 text-xs space-y-1">
              <div className="flex justify-between font-bold text-[#3A2E25]">
                <span>Invoice #{currentTrackedOrder.id}-GST</span>
                <span>Date: {currentTrackedOrder.createdAt}</span>
              </div>
              <div className="flex justify-between text-[#7A6A5C]">
                <span>Subtotal: ₹{currentTrackedOrder.subtotal}</span>
                <span>5% GST (2.5% CGST + 2.5% SGST): ₹{currentTrackedOrder.taxes}</span>
              </div>
              <div className="flex justify-between font-black text-[#3A2E25] pt-1 border-t border-orange-200">
                <span>Net Total Paid:</span>
                <span className="text-emerald-700">₹{currentTrackedOrder.totalAmount}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-[#3A2E25]">Company GSTIN (Optional for B2B Input Credit):</label>
              <input
                type="text"
                placeholder="29AABCG1234F1Z5"
                value={gstinInput}
                onChange={(e) => setGstinInput(e.target.value)}
                className="w-full p-2.5 bg-[#FFF8EE] border border-orange-200 rounded-xl font-mono text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-orange-100">
              <button
                onClick={() => setGstModalOpen(false)}
                className="px-4 py-2 border border-orange-200 text-[#7A6A5C] text-xs font-bold rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  requestGstInvoice(currentTrackedOrder.id, gstinInput);
                  setGstModalOpen(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generate & Download Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
