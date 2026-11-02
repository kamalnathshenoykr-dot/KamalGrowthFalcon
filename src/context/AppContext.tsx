import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BrandId,
  MenuItem,
  Order,
  Review,
  DeliveryRider,
  Kitchen,
  CampaignResult,
  RiderLanguage,
  RiderDeliveryStep,
  ExceptionType,
  SystemEventLog,
  SupportTicket,
  ShiftSlot,
  AppRules,
  CelebrationState,
  Scenario,
  ChatMessage,
} from '../types';
import {
  BRANDS,
  MENU_ITEMS,
  KITCHENS,
  RIDERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  CAMPAIGN_RESULTS,
  RIDER_SHIFTS,
  INITIAL_SUPPORT_TICKETS,
  AVAILABLE_COUPONS,
  Coupon,
  SERVICE_MEETING_POINTS,
} from '../data/mockData';
import {
  DEFAULT_RULES,
  SCENARIOS_DATA,
} from '../data/flowAndScenariosData';

export type ViewTab = 'overview' | 'customer' | 'kitchen' | 'marketing' | 'finance' | 'rider' | 'flowmap' | 'rules';

export type OverviewSubTab = 'summary' | 'unit_economics' | 'how_it_works';
export type CustomerSubTab = 'order' | 'track' | 'wallet' | 'reviews';
export type KitchenSubTab = 'live_orders' | 'performance' | 'inventory' | 'hygiene' | 'fleet';
export type MarketingSubTab = 'acquire' | 'retain' | 'campaigns';
export type FinanceSegment = 'kitchen' | 'rider' | 'inclusion';
export type FinanceSubTab = 'overview' | 'offers' | 'insurance' | 'data_consent';
export type RiderBottomTab = 'home' | 'orders' | 'earnings' | 'safety' | 'profile';

export type DietFilterType = 'all' | 'veg' | 'jain' | 'vegan' | 'gluten_free' | 'nut_free';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface AppContextType {
  currentView: ViewTab;
  setCurrentView: (view: ViewTab) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Sub-tabs memory across views
  overviewSubTab: OverviewSubTab;
  setOverviewSubTab: (tab: OverviewSubTab) => void;
  customerSubTab: CustomerSubTab;
  setCustomerSubTab: (tab: CustomerSubTab) => void;
  kitchenSubTab: KitchenSubTab;
  setKitchenSubTab: (tab: KitchenSubTab) => void;
  marketingSubTab: MarketingSubTab;
  setMarketingSubTab: (tab: MarketingSubTab) => void;
  financeSegment: FinanceSegment;
  setFinanceSegment: (seg: FinanceSegment) => void;
  financeSubTab: FinanceSubTab;
  setFinanceSubTab: (tab: FinanceSubTab) => void;
  riderBottomTab: RiderBottomTab;
  setRiderBottomTab: (tab: RiderBottomTab) => void;

  // Global notifications & live activity drawers
  notificationsOpen: boolean;
  setNotificationsOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  systemActivityOpen: boolean;
  setSystemActivityOpen: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Cart & Customer state
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  falconCredits: number;
  redeemCredits: boolean;
  setRedeemCredits: (val: boolean) => void;
  activeBrandId: BrandId;
  setActiveBrandId: (brandId: BrandId) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;

  // Phase 1: Dietary, Allergens, Sold Out, Coupons, Gated Society & Checkout
  dietFilter: DietFilterType;
  setDietFilter: (filter: DietFilterType) => void;
  hideSoldOut: boolean;
  setHideSoldOut: (val: boolean) => void;
  soldOutItemIds: string[];
  toggleItemSoldOut: (itemId: string) => void;
  appliedCoupon: Coupon | null;
  couponCodeInput: string;
  setCouponCodeInput: (code: string) => void;
  couponError: string | null;
  suggestedCoupon: Coupon | null;
  applyCoupon: (code: string, currentSubtotal?: number) => { success: boolean; message: string };
  removeCoupon: () => void;
  allergyNote: string;
  setAllergyNote: (note: string) => void;
  gateInstructions: string;
  setGateInstructions: (val: string) => void;
  landmark: string;
  setLandmark: (val: string) => void;
  scheduledTime: string | null;
  setScheduledTime: (val: string | null) => void;
  isGuestCheckout: boolean;
  setIsGuestCheckout: (val: boolean) => void;
  otpModalOpen: boolean;
  setOtpModalOpen: (val: boolean) => void;
  otpVerified: boolean;
  setOtpVerified: (val: boolean) => void;
  triggerOtpVerification: () => void;
  verifyOtpInput: (enteredOtp: string) => boolean;
  serviceMeetingPoint: string | null;
  setServiceMeetingPoint: (val: string | null) => void;
  upiPendingState: { active: boolean; secondsLeft: number; orderId: string } | null;
  setUpiPendingState: React.Dispatch<React.SetStateAction<{ active: boolean; secondsLeft: number; orderId: string } | null>>;
  syncSweepNotice: string | null;
  runSyncSweep: () => void;
  dismissSyncSweepNotice: () => void;

  // Group Order
  groupOrderActive: boolean;
  setGroupOrderActive: (val: boolean) => void;
  groupMembers: { id: string; name: string; itemsSummary: string; shareAmount: number; paid: boolean }[];
  startGroupOrder: () => void;
  addGroupMemberItem: (name: string, dishName: string, price: number) => void;
  clearGroupOrder: () => void;

  // Price Surge Modal Confirmation
  simulatedPriceSurge: { oldTotal: number; newTotal: number; reason: string } | null;
  triggerPriceSurgeSimulation: () => void;
  confirmPriceSurge: () => void;
  dismissPriceSurge: () => void;

  // Customer Order Cancellation & Editing (Pre-Acceptance)
  customerCancelOrder: (orderId: string) => { refundAmount: number; policyApplied: string };
  customerEditOrderBeforeAccept: (orderId: string, address: string, area: string, pin: string) => boolean;
  oneTapReorder: (pastOrder: Order) => void;

  // Phase 2: Kitchen KDS SLA, Delays, Allergens, Inquiries, QC & Packaging
  kitchenAcknowledgeAllergy: (orderId: string) => void;
  kitchenRejectOrder: (orderId: string, reason: string) => void;
  kitchenDelayOrder: (orderId: string, delayMinutes: number, reason: string) => void;
  customerAcknowledgeDelay: (orderId: string, accept: boolean) => void;
  kitchenSendSpecialInstructionInquiry: (orderId: string, question: string, suggestedSwap: string) => void;
  customerAnswerSpecialInstruction: (orderId: string, action: 'swap' | 'remove' | 'accept') => void;
  kitchenTriggerQCReCook: (orderId: string, reason: string) => void;
  depletedIngredients: string[];
  depleteIngredient: (ingredient: string, affectedDishId: string) => void;
  restoreIngredient: (ingredient: string, dishId: string) => void;
  packagingStock: Record<string, number>;
  updatePackagingStock: (pkgType: string, delta: number) => void;
  kitchenOnline: boolean;
  setKitchenOnline: (val: boolean) => void;
  batchedDeliveryDecision: 'wait_together' | 'unbatch_dispatch';
  setBatchedDeliveryDecision: (val: 'wait_together' | 'unbatch_dispatch') => void;
  pausedKitchenIds: string[];
  toggleKitchenPause: (kitchenId: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    pinCode: string;
    area: string;
    paymentMethod: 'UPI' | 'Card' | 'COD';
    allergyNote?: string;
    gateInstructions?: string;
    landmark?: string;
    isGuest?: boolean;
    scheduledTime?: string;
    splitPayment?: { creditsUsed: number; upiPaid: number };
    meetingPointAssigned?: string;
    idempotencyKey?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addReviewToOrder: (orderId: string, rating: number, reviewText: string, travelRating: number) => void;

  // Kitchen Dashboard
  activeKitchenId: string;
  setActiveKitchenId: (kitchenId: string) => void;
  hygieneChecks: Record<string, boolean>;
  toggleHygieneCheck: (taskId: string) => void;

  // Reviews
  reviews: Review[];

  // Finance & Rider
  riders: DeliveryRider[];
  activeRiderId: string;
  setActiveRiderId: (riderId: string) => void;
  dataSharingConsent: { sales: boolean; settlements: boolean; ratings: boolean };
  setDataSharingConsent: React.Dispatch<React.SetStateAction<{ sales: boolean; settlements: boolean; ratings: boolean }>>;
  instantSettlementDone: boolean;
  triggerInstantSettlement: () => void;
  riderWithdrawalDone: boolean;
  triggerRiderWithdrawal: () => void;
  riderAutoSaveVal: number;
  setRiderAutoSaveVal: (val: number) => void;
  riderMicroInsurance: boolean;
  setRiderMicroInsurance: (val: boolean) => void;

  // Marketing
  campaigns: CampaignResult[];
  addCampaign: (camp: CampaignResult) => void;
  activeSegment: string;
  setActiveSegment: (seg: string) => void;

  // RIDER APP SPECIFIC STATE
  riderOnline: boolean;
  setRiderOnline: (val: boolean) => void;
  riderOnBreak: boolean;
  setRiderOnBreak: (val: boolean) => void;
  riderLanguage: RiderLanguage;
  setRiderLanguage: (lang: RiderLanguage) => void;
  lowNetworkMode: boolean;
  setLowNetworkMode: (val: boolean) => void;
  isSyncing: boolean;
  offlineQueueCount: number;

  activeDeliveryOrder: Order | null;
  deliveryStep: RiderDeliveryStep;
  setDeliveryStep: (step: RiderDeliveryStep) => void;

  acceptDeliveryOrder: (orderId?: string) => void;
  rejectDeliveryOrder: (reason: string) => void;
  markRiderArrivedKitchen: () => void;
  claimWaitingCompensation: () => void;
  confirmPickup: () => void;
  arrivedCustomerLocation: () => void;
  completeCustomerDrop: (otpOrCode: string, collectedCash?: number) => void;
  handleRiderException: (type: ExceptionType, detail?: string) => void;

  // System Events Log (Integration Monitor)
  systemEvents: SystemEventLog[];
  logSystemEvent: (action: string, targetView: SystemEventLog['targetView'], impactDetail: string) => void;

  // Support Tickets
  supportTickets: SupportTicket[];
  addSupportTicket: (ticket: SupportTicket) => void;
  resolveSupportTicket: (ticketId: string) => void;

  // Cash in Hand
  depositCashInHand: () => void;

  // SOS
  sosActive: boolean;
  triggerSOS: () => void;
  resolveSOS: () => void;

  // Shift planner
  shiftSlots: ShiftSlot[];
  toggleShiftBooking: (shiftId: string) => void;

  // Ops Fleet Reassignment
  reassignOrder: (orderId: string, newRiderId: string) => void;

  // Rain Surge Mode
  rainSurgeActive: boolean;
  setRainSurgeActive: (val: boolean) => void;

  // Platform Rules Engine
  rules: AppRules;
  updateRule: <K extends keyof AppRules>(key: K, value: AppRules[K]) => void;
  resetRulesToDefault: () => void;

  // Celebration Animation
  celebration: CelebrationState | null;
  triggerCelebration: (title: string, subtitle: string, amount?: string) => void;
  dismissCelebration: () => void;

  // Scenario Simulator
  scenarioDrawerOpen: boolean;
  setScenarioDrawerOpen: (val: boolean) => void;
  activeScenario: Scenario | null;
  activeScenarioStepIndex: number;
  runScenario: (scenarioId: string) => void;
  nextScenarioStep: () => void;
  prevScenarioStep: () => void;
  closeScenario: () => void;

  // Phase 3: Delivery & In-transit Real-time Cases
  requestMidDeliveryAddressChange: (orderId: string, newAddress: string, newArea: string, distanceKm: number) => { accepted: boolean; feeRequired: boolean; fee: number; message: string };
  confirmMidDeliveryAddressChangeFee: (orderId: string) => void;
  addMidDeliveryInstruction: (orderId: string, instruction: string) => void;
  triggerSecurityGateHold: (orderId: string) => void;
  generateAlternateDropCode: (orderId: string) => string;
  reportSwappedOrder: (orderId: string, notes: string) => void;
  submitNotReceivedClaim: (orderId: string, explanation: string) => void;
  tipRider: (orderId: string, amount: number) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (orderId: string, sender: 'customer' | 'rider', text: string) => void;

  // Phase 4: Post-Delivery & Customer Support Cases
  submitOrderComplaint: (
    orderId: string,
    complaintType: 'missing_item' | 'wrong_item' | 'cold_food' | 'short_quantity' | 'spilled' | 'foreign_object' | 'late',
    requestedResolution: 'refund' | 'replacement',
    evidencePhotoUrl?: string,
    notes?: string
  ) => void;
  appealComplaint: (orderId: string, notes: string) => void;
  requestGstInvoice: (orderId: string, gstin?: string) => void;
  lunchPlanPaused: boolean;
  toggleLunchPlanPause: () => void;
  downloadUserData: () => void;
  withdrawMarketingConsent: () => void;
  marketingConsentRevoked: boolean;
  requestAccountDeletion: () => void;
  accountDeletedState: boolean;
  reportCustomerConduct: (orderId: string, riderId: string, reason: string) => void;
  reportKitchenConduct: (orderId: string, riderId: string, reason: string) => void;
  disputePartnerDeduction: (partnerId: string, deductionType: string, amount: number, reason: string) => void;
  partnerDeductionDisputes: { id: string; partnerId: string; type: string; amount: number; reason: string; status: 'in_review' | 'reversed' | 'upheld' }[];

  // Phase 5: Outages, Aggregator Sync & Quality Recalls
  recalledBatches: { batchNumber: string; ingredient: string; dish: string; time: string; quarantined: boolean }[];
  triggerBatchRecall: (batchNumber: string, ingredientName: string, affectedDish: string) => void;
  aggregatorPriceMismatchCount: number;
  syncAggregatorPrices: () => void;
  initiatePartnerOffboarding: (partnerType: 'kitchen' | 'rider', id: string, name: string) => void;
  offboardingSettlement: { partnerName: string; pendingPayout: number; deductions: number; netPayable: number; nocGenerated: boolean } | null;
  closeOffboardingSettlement: () => void;

  // Finance Cases
  slowWeekRolloverActive: boolean;
  toggleSlowWeekRollover: () => void;
  appealInsuranceClaim: (ticketId: string, reason: string) => void;
  instantPayoutFallbackBatch: boolean;
  toggleInstantPayoutFallback: () => void;

  // Latest toast notification
  liveToast: string | null;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewTab>('overview');
  const [demoMode, setDemoMode] = useState<boolean>(false);

  // Sub-tabs memory across views
  const [overviewSubTab, setOverviewSubTab] = useState<OverviewSubTab>('summary');
  const [customerSubTab, setCustomerSubTab] = useState<CustomerSubTab>('order');
  const [kitchenSubTab, setKitchenSubTab] = useState<KitchenSubTab>('live_orders');
  const [marketingSubTab, setMarketingSubTab] = useState<MarketingSubTab>('acquire');
  const [financeSegment, setFinanceSegment] = useState<FinanceSegment>('kitchen');
  const [financeSubTab, setFinanceSubTab] = useState<FinanceSubTab>('overview');
  const [riderBottomTab, setRiderBottomTab] = useState<RiderBottomTab>('home');

  // Global drawers
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [systemActivityOpen, setSystemActivityOpen] = useState<boolean>(false);

  const [cart, setCart] = useState<CartItem[]>([
    { item: MENU_ITEMS[0], quantity: 1 },
    { item: MENU_ITEMS[3], quantity: 1 },
  ]);
  const [falconCredits, setFalconCredits] = useState<number>(380);
  const [redeemCredits, setRedeemCredits] = useState<boolean>(false);
  const [activeBrandId, setActiveBrandId] = useState<BrandId>('thali-theory');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [activeKitchenId, setActiveKitchenId] = useState<string>('k-1');
  const [riders, setRiders] = useState<DeliveryRider[]>(RIDERS);
  const [activeRiderId, setActiveRiderId] = useState<string>('r-1');

  // Rider App specific state
  const [riderOnline, setRiderOnline] = useState<boolean>(true);
  const [riderOnBreak, setRiderOnBreak] = useState<boolean>(false);
  const [riderLanguage, setRiderLanguage] = useState<RiderLanguage>('English');
  const [lowNetworkMode, setLowNetworkMode] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<Array<{ id: string; action: string; timestamp: string }>>([]);

  const [deliveryStep, setDeliveryStep] = useState<RiderDeliveryStep>('navigating_to_kitchen');
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [shiftSlots, setShiftSlots] = useState<ShiftSlot[]>(RIDER_SHIFTS);
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [rainSurgeActive, setRainSurgeActive] = useState<boolean>(false);

  // System Events Log for live integration monitoring
  const [systemEvents, setSystemEvents] = useState<SystemEventLog[]>([
    {
      id: 'evt-1',
      time: '12 mins ago',
      riderName: 'Ramesh Kumar',
      action: 'Order Accepted (GF-9481)',
      targetView: 'kitchen',
      impactDetail: 'Kitchen Koramangala notified: Dispatch ETA 14 mins. Customer tracker updated to "Preparing".',
    },
    {
      id: 'evt-2',
      time: '8 mins ago',
      riderName: 'Priya Nair',
      action: 'Arrived at Kitchen',
      targetView: 'kitchen',
      impactDetail: 'Indiranagar Central unit: Rider waiting at counter. Packing slip verified.',
    },
    {
      id: 'evt-3',
      time: '4 mins ago',
      riderName: 'Karthik Rao',
      action: 'Delivered (GF-9485)',
      targetView: 'finance',
      impactDetail: 'Partner Bank: ₹68 trip wage accrued to wallet, ₹25 auto-deducted to 7.2% Recurring Deposit.',
    },
  ]);

  const [hygieneChecks, setHygieneChecks] = useState<Record<string, boolean>>({
    'h-1': true,
    'h-2': true,
    'h-3': true,
    'h-4': true,
    'h-5': false,
    'h-6': true,
  });

  const [dataSharingConsent, setDataSharingConsent] = useState({
    sales: true,
    settlements: true,
    ratings: true,
  });

  const [instantSettlementDone, setInstantSettlementDone] = useState(false);
  const [riderWithdrawalDone, setRiderWithdrawalDone] = useState(false);
  const [riderAutoSaveVal, setRiderAutoSaveVal] = useState(25);
  const [riderMicroInsurance, setRiderMicroInsurance] = useState(true);

  const [campaigns, setCampaigns] = useState<CampaignResult[]>(CAMPAIGN_RESULTS);
  const [activeSegment, setActiveSegment] = useState<string>('Late-night regulars');
  const [liveToast, setLiveToast] = useState<string | null>(null);

  // Phase 1 States: Dietary, Sold Out, Coupons, Gated Society & Checkout
  const [dietFilter, setDietFilter] = useState<DietFilterType>('all');
  const [hideSoldOut, setHideSoldOut] = useState<boolean>(false);
  const [soldOutItemIds, setSoldOutItemIds] = useState<string[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [suggestedCoupon, setSuggestedCoupon] = useState<Coupon | null>(null);
  const [allergyNote, setAllergyNote] = useState<string>('');
  const [gateInstructions, setGateInstructions] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [isGuestCheckout, setIsGuestCheckout] = useState<boolean>(false);
  const [otpModalOpen, setOtpModalOpen] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(true);
  const [serviceMeetingPoint, setServiceMeetingPoint] = useState<string | null>(null);
  const [upiPendingState, setUpiPendingState] = useState<{ active: boolean; secondsLeft: number; orderId: string } | null>(null);
  const [syncSweepNotice, setSyncSweepNotice] = useState<string | null>(null);

  // Group Order
  const [groupOrderActive, setGroupOrderActive] = useState<boolean>(false);
  const [groupMembers, setGroupMembers] = useState<{ id: string; name: string; itemsSummary: string; shareAmount: number; paid: boolean }[]>([]);

  // Price surge simulation
  const [simulatedPriceSurge, setSimulatedPriceSurge] = useState<{ oldTotal: number; newTotal: number; reason: string } | null>(null);

  // Phase 2 States: Kitchen KDS, Delays, Inquiries, Ingredients, Packaging & Fleet
  const [depletedIngredients, setDepletedIngredients] = useState<string[]>([]);
  const [packagingStock, setPackagingStock] = useState<Record<string, number>>({
    bagasse_box: 48,
    foil_container: 32,
    paper_bowl: 55,
    flask_thermo: 14,
  });
  const [kitchenOnline, setKitchenOnline] = useState<boolean>(true);
  const [batchedDeliveryDecision, setBatchedDeliveryDecision] = useState<'wait_together' | 'unbatch_dispatch'>('wait_together');
  const [pausedKitchenIds, setPausedKitchenIds] = useState<string[]>([]);

  // Platform Rules Engine State
  const [rules, setRules] = useState<AppRules>(DEFAULT_RULES);

  const updateRule = <K extends keyof AppRules>(key: K, value: AppRules[K]) => {
    setRules((prev) => ({ ...prev, [key]: value }));
    setLiveToast(`Rule updated: ${String(key)} = ${value}`);
  };

  const resetRulesToDefault = () => {
    setRules(DEFAULT_RULES);
    setLiveToast('All rules & operational thresholds reset to defaults.');
  };

  // Celebration state
  const [celebration, setCelebration] = useState<CelebrationState | null>(null);

  const triggerCelebration = (title: string, subtitle: string, amount?: string) => {
    setCelebration({ active: true, title, subtitle, amount });
  };

  const dismissCelebration = () => {
    setCelebration(null);
  };

  // Scenario Simulator Drawer State
  const [scenarioDrawerOpen, setScenarioDrawerOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [activeScenarioStepIndex, setActiveScenarioStepIndex] = useState(0);

  const runScenario = (scenarioId: string) => {
    const scen = SCENARIOS_DATA.find((s) => s.id === scenarioId) || SCENARIOS_DATA[0];
    setActiveScenario(scen);
    setActiveScenarioStepIndex(0);
    setScenarioDrawerOpen(true);
    setLiveToast(`Loaded Scenario: "${scen.title}"`);
    logSystemEvent(`Scenario Started: ${scen.title}`, 'ops', `Running step 1 of ${scen.steps.length}`);
  };

  const nextScenarioStep = () => {
    if (!activeScenario) return;
    if (activeScenarioStepIndex < activeScenario.steps.length - 1) {
      const nextIdx = activeScenarioStepIndex + 1;
      setActiveScenarioStepIndex(nextIdx);
      const step = activeScenario.steps[nextIdx];
      logSystemEvent(`Scenario Step ${nextIdx + 1}`, 'ops', step.stepTitle);
    }
  };

  const prevScenarioStep = () => {
    if (activeScenarioStepIndex > 0) {
      setActiveScenarioStepIndex((prev) => prev - 1);
    }
  };

  const closeScenario = () => {
    setScenarioDrawerOpen(false);
    setActiveScenario(null);
    setActiveScenarioStepIndex(0);
  };

  // Phase 3, 4, 5, Finance States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      orderId: 'GF-9481',
      sender: 'customer',
      senderName: 'Priya Sharma',
      text: 'Please call when you reach the gate, guard needs intercom approval.',
      translatedText: 'ದಯವಿಟ್ಟು ಗೇಟ್‌ಗೆ ತಲುಪಿದಾಗ ಕರೆ ಮಾಡಿ, ಗಾರ್ಡ್‌ಗೆ ಅನುಮೋದನೆ ಬೇಕು.',
      language: 'English',
      timestamp: '10 mins ago',
    },
    {
      id: 'msg-2',
      orderId: 'GF-9481',
      sender: 'rider',
      senderName: 'Ramesh Kumar',
      text: 'ನಾನು ಬೈಕ್‌ನಲ್ಲಿ ಬಂದಿದ್ದೇನೆ, ಗೇಟ್ ಬಳಿ ೨ ನಿಮಿಷದಲ್ಲಿ ತಲುಪುತ್ತೇನೆ.',
      translatedText: 'I have arrived on bike, will reach near gate in 2 minutes.',
      language: 'Kannada',
      timestamp: '8 mins ago',
    },
  ]);
  const [lunchPlanPaused, setLunchPlanPaused] = useState<boolean>(false);
  const [marketingConsentRevoked, setMarketingConsentRevoked] = useState<boolean>(false);
  const [accountDeletedState, setAccountDeletedState] = useState<boolean>(false);
  const [partnerDeductionDisputes, setPartnerDeductionDisputes] = useState<{
    id: string;
    partnerId: string;
    type: string;
    amount: number;
    reason: string;
    status: 'in_review' | 'reversed' | 'upheld';
  }[]>([
    {
      id: 'disp-1',
      partnerId: 'k-1',
      type: 'Packaging Defect Surcharge',
      amount: 150,
      reason: 'Batch seal inspection passed; thermal tape log provided',
      status: 'in_review',
    },
  ]);
  const [recalledBatches, setRecalledBatches] = useState<{
    batchNumber: string;
    ingredient: string;
    dish: string;
    time: string;
    quarantined: boolean;
  }[]>([
    {
      batchNumber: 'LOT-560-DAIRY-88',
      ingredient: 'Organic Cow Ghee',
      dish: 'Royal South Indian Thali',
      time: 'Today, 11:30 AM',
      quarantined: true,
    },
  ]);
  const [aggregatorPriceMismatchCount, setAggregatorPriceMismatchCount] = useState<number>(3);
  const [offboardingSettlement, setOffboardingSettlement] = useState<{
    partnerName: string;
    pendingPayout: number;
    deductions: number;
    netPayable: number;
    nocGenerated: boolean;
  } | null>(null);
  const [slowWeekRolloverActive, setSlowWeekRolloverActive] = useState<boolean>(true);
  const [instantPayoutFallbackBatch, setInstantPayoutFallbackBatch] = useState<boolean>(false);

  const dismissToast = () => setLiveToast(null);

  // Helper to log system sync event
  const logSystemEvent = (action: string, targetView: SystemEventLog['targetView'], impactDetail: string) => {
    const currentRider = riders.find((r) => r.id === activeRiderId) || riders[0];
    const newEvent: SystemEventLog = {
      id: `evt-${Date.now()}`,
      time: 'Just now',
      riderName: currentRider.name,
      action,
      targetView,
      impactDetail,
    };
    setSystemEvents((prev) => [newEvent, ...prev.slice(0, 25)]);
  };

  // Sync offline queue when network is restored
  useEffect(() => {
    if (!lowNetworkMode && offlineQueue.length > 0) {
      setIsSyncing(true);
      const timer = setTimeout(() => {
        setIsSyncing(false);
        const count = offlineQueue.length;
        setOfflineQueue([]);
        setLiveToast(`Network Restored: ${count} queued rider actions synced to Bangalore Dispatch Server ✓`);
        logSystemEvent('Offline Queue Synced', 'ops', `${count} cached trip updates reconciled with central database.`);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [lowNetworkMode, offlineQueue.length]);

  // Find active delivery order for the active rider
  const currentRider = riders.find((r) => r.id === activeRiderId) || riders[0];
  const activeDeliveryOrder = orders.find(
    (o) => (o.riderId === currentRider.id || o.riderName === currentRider.name) && o.status !== 'Delivered'
  ) || orders.find((o) => o.status === 'Preparing') || orders[0];

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => (i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { item, quantity: 1 }];
    });
    setLiveToast(`Added "${item.name}" to cart`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.item.id === itemId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  // Sold-out items toggling
  const toggleItemSoldOut = (itemId: string) => {
    setSoldOutItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
    const item = MENU_ITEMS.find((m) => m.id === itemId);
    const isNowSoldOut = !soldOutItemIds.includes(itemId);
    setLiveToast(
      isNowSoldOut
        ? `Kitchen 86: "${item?.name || 'Item'}" marked Sold Out.`
        : `Kitchen Restock: "${item?.name || 'Item'}" marked Available.`
    );
    logSystemEvent(
      `Inventory Update (${item?.name || itemId})`,
      'kitchen',
      isNowSoldOut ? 'Marked sold-out across Bangalore live menus.' : 'Restocked on live menus.'
    );
  };

  // Coupons Engine
  const applyCoupon = (code: string, currentSubtotal?: number): { success: boolean; message: string } => {
    const subtotal = currentSubtotal ?? cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
    const cleanCode = code.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);

    if (!found) {
      setCouponError('Invalid coupon code. Try FALCON50 or WELCOME100.');
      const bestValid = AVAILABLE_COUPONS.find((c) => !c.isExpired && subtotal >= c.minOrder);
      setSuggestedCoupon(bestValid || AVAILABLE_COUPONS[0]);
      return { success: false, message: 'Invalid coupon code.' };
    }

    if (found.isExpired) {
      setCouponError(`Coupon "${found.code}" expired yesterday.`);
      const bestValid = AVAILABLE_COUPONS.find((c) => !c.isExpired && subtotal >= c.minOrder);
      setSuggestedCoupon(bestValid || AVAILABLE_COUPONS[0]);
      return { success: false, message: `Coupon "${found.code}" has expired.` };
    }

    if (subtotal < found.minOrder) {
      setCouponError(`Min order ₹${found.minOrder} required. Add ₹${found.minOrder - subtotal} more items.`);
      const bestValid = AVAILABLE_COUPONS.find((c) => !c.isExpired && subtotal >= c.minOrder);
      setSuggestedCoupon(bestValid || null);
      return { success: false, message: `Minimum cart value of ₹${found.minOrder} not met.` };
    }

    setAppliedCoupon(found);
    setCouponError(null);
    setSuggestedCoupon(null);
    setLiveToast(`Coupon ${found.code} applied! ₹${found.discountAmount} discount activated.`);
    return { success: true, message: `Applied! You saved ₹${found.discountAmount}.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setLiveToast('Coupon removed.');
  };

  // OTP Verification
  const triggerOtpVerification = () => {
    setOtpModalOpen(true);
    setLiveToast('SMS OTP "8492" dispatched to saved device.');
  };

  const verifyOtpInput = (enteredOtp: string): boolean => {
    if (enteredOtp.trim() === '8492' || enteredOtp.trim() === '1234') {
      setOtpVerified(true);
      setOtpModalOpen(false);
      setLiveToast('Device & Mobile Re-verified ✓ Saved UPI & Addresses unlocked.');
      logSystemEvent('Device OTP Verified', 'customer', 'Two-factor auth confirmed before direct payment release.');
      return true;
    }
    setLiveToast('Invalid OTP. Please enter 8492.');
    return false;
  };

  // Group Order
  const startGroupOrder = () => {
    setGroupOrderActive(true);
    setGroupMembers([
      { id: 'gm-1', name: 'Aishwarya (Host)', itemsSummary: '1x Royal Thali, 1x Filter Coffee', shareAmount: 290, paid: true },
      { id: 'gm-2', name: 'Rohit Verma (Colleague)', itemsSummary: '1x Malabar Paratha Combo', shareAmount: 180, paid: true },
    ]);
    setLiveToast('Group Cart created! Shareable link generated: growthfalcon.in/order/grp-821');
    logSystemEvent('Group Cart Active', 'customer', 'Office lunch split bill session active (2 members).');
  };

  const addGroupMemberItem = (name: string, dishName: string, price: number) => {
    setGroupMembers((prev) => [
      ...prev,
      { id: `gm-${Date.now()}`, name, itemsSummary: `1x ${dishName}`, shareAmount: price, paid: false },
    ]);
    setLiveToast(`${name} added ${dishName} to the group cart!`);
  };

  const clearGroupOrder = () => {
    setGroupOrderActive(false);
    setGroupMembers([]);
  };

  // Price Surge simulation
  const triggerPriceSurgeSimulation = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
    setSimulatedPriceSurge({
      oldTotal: subtotal,
      newTotal: Math.round(subtotal * 1.15),
      reason: 'Sudden rain surge over Koramangala & high order intake (+15%).',
    });
  };

  const confirmPriceSurge = () => {
    setSimulatedPriceSurge(null);
    setLiveToast('Price adjustment confirmed by customer. Order processing resumed.');
  };

  const dismissPriceSurge = () => {
    setSimulatedPriceSurge(null);
    setLiveToast('Surge rejected. Items remain saved in your cart.');
  };

  // Sync sweep (auto reconcile lost confirmation / double tap)
  const runSyncSweep = () => {
    setSyncSweepNotice(
      'Sync Sweep Completed: 1 orphaned UPI transaction verified. ₹320 auto-refunded to customer account within 180 seconds via Partner Bank IMPS gateway.'
    );
    setLiveToast('Sync Sweep: Reconciled 1 pending payment ✓');
    logSystemEvent('Sync Sweep Executed', 'finance', 'Partner Bank gateway reconciled missing webhook confirmation.');
  };

  const dismissSyncSweepNotice = () => setSyncSweepNotice(null);

  // Customer Pre-Acceptance Cancellation & Editing
  const customerCancelOrder = (orderId: string): { refundAmount: number; policyApplied: string } => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { refundAmount: 0, policyApplied: 'Order not found' };

    let refundAmount = 0;
    let policyApplied = '';

    if (order.status === 'Placed') {
      refundAmount = order.totalAmount;
      policyApplied = '100% Full Refund (Cancelled before kitchen acceptance)';
    } else if (order.status === 'Preparing') {
      refundAmount = Math.round(order.totalAmount * 0.5);
      policyApplied = `50% Partial Refund (Cancelled after cooking started per Rules: ${rules.refundRule})`;
    } else {
      refundAmount = 0;
      policyApplied = 'No refund (Order is already packed or in transit)';
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Cancelled',
              cancellationRefundDetails: {
                amount: refundAmount,
                ruleApplied: policyApplied,
                reason: 'Customer requested cancellation via tracker',
              },
            }
          : o
      )
    );

    if (refundAmount > 0) {
      setFalconCredits((prev) => prev + refundAmount);
      triggerCelebration(
        'Refund Processed Instantaneously',
        policyApplied,
        `₹${refundAmount}`
      );
    } else {
      setLiveToast(`Order ${orderId} cancelled. ${policyApplied}`);
    }

    logSystemEvent(
      `Order Cancelled (${orderId})`,
      'ops',
      `${policyApplied}. Credited ₹${refundAmount} to customer balance.`
    );

    return { refundAmount, policyApplied };
  };

  const customerEditOrderBeforeAccept = (orderId: string, address: string, area: string, pin: string): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status !== 'Placed') {
      setLiveToast('Editing locked: Kitchen has already started preparing the meal.');
      return false;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, area, pinCode: pin, landmark: address }
          : o
      )
    );
    setLiveToast(`Order #${orderId} delivery address updated successfully.`);
    logSystemEvent(
      `Customer Edited Order (${orderId})`,
      'kitchen',
      `Address amended to ${area} (${pin}) before kitchen ticket was punched.`
    );
    return true;
  };

  const oneTapReorder = (pastOrder: Order) => {
    const itemsToAdd = pastOrder.items.map((item) => {
      const match = MENU_ITEMS.find((m) => m.name === item.name) || MENU_ITEMS[0];
      return { item: match, quantity: item.quantity };
    });
    setCart(itemsToAdd);
    setActiveBrandId(pastOrder.brandId);
    setCustomerSubTab('order');
    setLiveToast(`Reorder loaded! ${pastOrder.items.length} items from ${pastOrder.brandName} ready in basket.`);
  };

  // Kitchen SLA & Delay Actions
  const kitchenAcknowledgeAllergy = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, allergyAcknowledgedByKitchen: true } : o))
    );
    setLiveToast(`Kitchen Chef acknowledged allergen safety checklist for Order #${orderId} ✓`);
    logSystemEvent(
      `Allergen Verified (${orderId})`,
      'kitchen',
      'Head Chef verified segregated utensils & zero cross-contamination.'
    );
  };

  const kitchenRejectOrder = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Cancelled',
              cancellationRefundDetails: {
                amount: o.totalAmount,
                ruleApplied: 'Kitchen 3-Min SLA Breach / Rejection',
                reason,
              },
            }
          : o
      )
    );
    setLiveToast(`Order ${orderId} rejected by kitchen hub. Escalated to Ops Desk.`);
    logSystemEvent(
      `Kitchen SLA Rejection (${orderId})`,
      'ops',
      `Reason: ${reason}. Automated failover triggered to alternate Bangalore hub.`
    );
  };

  const kitchenDelayOrder = (orderId: string, delayMinutes: number, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              targetPrepMinutes: o.targetPrepMinutes + delayMinutes,
              kitchenDelayNotice: {
                delayedMinutes: delayMinutes,
                reason,
                customerAccepted: false,
              },
            }
          : o
      )
    );
    setLiveToast(`Delay notice (+${delayMinutes}m) broadcasted to Customer Order #${orderId}`);
    logSystemEvent(
      `Kitchen Delay Alert (+${delayMinutes}m)`,
      'customer',
      `Hub informed customer: ${reason}. Option to cancel for 100% refund offered.`
    );
  };

  const customerAcknowledgeDelay = (orderId: string, accept: boolean) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (accept) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId && o.kitchenDelayNotice
            ? { ...o, kitchenDelayNotice: { ...o.kitchenDelayNotice, customerAccepted: true } }
            : o
        )
      );
      setLiveToast(`Delay accepted. Kitchen prioritized your order with extra care.`);
    } else {
      // Customer cancels due to delay -> full refund + Tier 1 late credit ₹30
      const refundAmt = order.totalAmount;
      const creditAmt = rules.lateDeliveryTier1Credit;
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: 'Cancelled',
                cancellationRefundDetails: {
                  amount: refundAmt + creditAmt,
                  ruleApplied: `Full refund + ₹${creditAmt} late delivery credit per Rules`,
                  reason: 'Customer declined kitchen prep delay',
                },
              }
            : o
        )
      );
      setFalconCredits((prev) => prev + refundAmt + creditAmt);
      triggerCelebration(
        'Order Cancelled: Full Refund + Credit',
        `₹${refundAmt} refunded + ₹${creditAmt} late-delivery courtesy credit added to your wallet.`,
        `₹${refundAmt + creditAmt}`
      );
      logSystemEvent(
        `Delay Declined (${orderId})`,
        'finance',
        `Refund ₹${refundAmt} + courtesy ₹${creditAmt} credited per operational rules.`
      );
    }
  };

  // Special Instruction Chef Inquiry
  const kitchenSendSpecialInstructionInquiry = (orderId: string, question: string, suggestedSwap: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              specialInstructionInquiry: {
                question,
                suggestedSwap,
                status: 'pending',
                expiresAt: Date.now() + 180000, // 3 mins auto-decision
              },
            }
          : o
      )
    );
    setLiveToast(`Query sent to customer: "${question}" (3-min timer started)`);
    logSystemEvent(
      `Chef Query Dispatched (${orderId})`,
      'customer',
      `Customer prompted: "${question}". Suggesting: "${suggestedSwap}".`
    );
  };

  const customerAnswerSpecialInstruction = (orderId: string, action: 'swap' | 'remove' | 'accept') => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId || !o.specialInstructionInquiry) return o;
        if (action === 'swap') {
          return {
            ...o,
            specialInstructionInquiry: { ...o.specialInstructionInquiry, status: 'customer_swapped' },
          };
        } else if (action === 'remove') {
          return {
            ...o,
            specialInstructionInquiry: { ...o.specialInstructionInquiry, status: 'customer_removed' },
            discount: o.discount + 80,
            totalAmount: Math.max(0, o.totalAmount - 80),
          };
        } else {
          return {
            ...o,
            specialInstructionInquiry: { ...o.specialInstructionInquiry, status: 'auto_decided' },
          };
        }
      })
    );
    setLiveToast(`Customer resolved chef inquiry: ${action.toUpperCase()}`);
    logSystemEvent(
      `Inquiry Resolved (${orderId})`,
      'kitchen',
      `Customer chose: ${action === 'swap' ? 'Swap Item' : action === 'remove' ? 'Remove & Refund' : 'Proceed as is'}.`
    );
  };

  // QC Failure & Priority Re-cook
  const kitchenTriggerQCReCook = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              qcStatus: 're_cooking',
              targetPrepMinutes: o.targetPrepMinutes + 6,
              elapsedMinutes: 0,
            }
          : o
      )
    );
    setLiveToast(`QC Check Failed (${reason}): Priority re-cook ticket dispatched to station!`);
    logSystemEvent(
      `QC Station Alert (${orderId})`,
      'kitchen',
      `Quality check failed: ${reason}. Rush re-cook ticket placed at front of queue.`
    );
  };

  // Recipe Ingredient Depletion
  const depleteIngredient = (ingredient: string, affectedDishId: string) => {
    setDepletedIngredients((prev) => (prev.includes(ingredient) ? prev : [...prev, ingredient]));
    setSoldOutItemIds((prev) => (prev.includes(affectedDishId) ? prev : [...prev, affectedDishId]));
    setLiveToast(`Ingredient depleted: ${ingredient}. Affected dish 86'd across Bangalore.`);
    logSystemEvent(
      `Ingredient Depleted (${ingredient})`,
      'kitchen',
      `Stock depleted. Live customer menu updated to avoid failed order intake.`
    );
  };

  const restoreIngredient = (ingredient: string, dishId: string) => {
    setDepletedIngredients((prev) => prev.filter((i) => i !== ingredient));
    setSoldOutItemIds((prev) => prev.filter((id) => id !== dishId));
    setLiveToast(`Ingredient restocked: ${ingredient}. Dish is back on live menu.`);
  };

  // Packaging Inventory Management
  const updatePackagingStock = (pkgType: string, delta: number) => {
    setPackagingStock((prev) => {
      const current = prev[pkgType] ?? 30;
      const next = Math.max(0, current + delta);
      if (next < 10) {
        setLiveToast(`Low Packaging Warning: Only ${next} ${pkgType} remaining in hub!`);
      }
      return { ...prev, [pkgType]: next };
    });
  };

  // Kitchen Pause / Failover
  const toggleKitchenPause = (kitchenId: string) => {
    setPausedKitchenIds((prev) =>
      prev.includes(kitchenId) ? prev.filter((id) => id !== kitchenId) : [...prev, kitchenId]
    );
    const k = KITCHENS.find((item) => item.id === kitchenId);
    const isPaused = !pausedKitchenIds.includes(kitchenId);
    setLiveToast(
      isPaused
        ? `Kitchen "${k?.name}" paused! Incoming orders will failover to nearest hub.`
        : `Kitchen "${k?.name}" resumed operations.`
    );
    logSystemEvent(
      `Kitchen Status Changed (${k?.name})`,
      'ops',
      isPaused ? 'Hub paused due to overflow. Auto-failover activated.' : 'Hub resumed online status.'
    );
  };

  // Place order from Customer App (Enriched with Phase 1 parameters)
  const placeOrder = (data: {
    customerName: string;
    customerPhone: string;
    pinCode: string;
    area: string;
    paymentMethod: 'UPI' | 'Card' | 'COD';
    allergyNote?: string;
    gateInstructions?: string;
    landmark?: string;
    isGuest?: boolean;
    scheduledTime?: string;
    splitPayment?: { creditsUsed: number; upiPaid: number };
    meetingPointAssigned?: string;
    idempotencyKey?: string;
  }) => {
    // Idempotency check: prevent duplicate tap double-orders
    if (data.idempotencyKey) {
      const existing = orders.find((o) => o.idempotencyKey === data.idempotencyKey);
      if (existing) {
        setLiveToast(`Idempotent tap acknowledged: Order #${existing.id} already placed.`);
        return existing;
      }
    }

    const brand = BRANDS.find((b) => b.id === activeBrandId) || BRANDS[0];
    const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

    // Apply loyalty credits and applied coupon discount
    let couponDiscount = appliedCoupon && subtotal >= appliedCoupon.minOrder ? appliedCoupon.discountAmount : 0;
    const creditsDiscount = redeemCredits ? Math.min(falconCredits, Math.floor((subtotal - couponDiscount) * 0.4)) : 0;
    const totalDiscount = couponDiscount + creditsDiscount;

    const taxes = Math.round(Math.max(0, subtotal - totalDiscount) * 0.05);
    const totalAmount = Math.max(0, subtotal - totalDiscount + taxes);

    let assignedKitchen = KITCHENS[0];
    if (data.pinCode === '560038') assignedKitchen = KITCHENS[1];
    else if (data.pinCode === '560102') assignedKitchen = KITCHENS[2];
    else if (data.pinCode === '560066') assignedKitchen = KITCHENS[3];
    else if (data.pinCode === '560103') assignedKitchen = KITCHENS[4];

    // Check if preferred kitchen is paused; failover to next nearest
    if (pausedKitchenIds.includes(assignedKitchen.id)) {
      assignedKitchen = KITCHENS.find((k) => !pausedKitchenIds.includes(k.id)) || KITCHENS[0];
      setLiveToast(`Routing Failover: Original hub paused. Order routed to ${assignedKitchen.name}.`);
    }

    // Pick available active rider
    const availableRider = riders.find((r) => r.status === 'idle') || riders[0];
    const maxPrepTime = Math.max(...cart.map((i) => i.item.prepTime), 10);
    const newOrderId = `GF-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: newOrderId,
      customerName: data.customerName || 'Aditi Sharma',
      customerPhone: data.customerPhone || '+91 98450 77123',
      pinCode: data.pinCode || '560034',
      area: data.area || 'Koramangala 4th Block',
      brandId: activeBrandId,
      brandName: brand.name,
      kitchenId: assignedKitchen.id,
      kitchenName: assignedKitchen.name,
      items: cart.map((c) => ({
        id: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity,
        prepTime: c.item.prepTime,
      })),
      subtotal,
      discount: totalDiscount,
      taxes,
      totalAmount,
      channel: 'Direct App',
      status: 'Placed',
      createdAt: 'Just now',
      elapsedMinutes: 0,
      targetPrepMinutes: maxPrepTime,
      riderName: availableRider.name,
      riderId: availableRider.id,
      paymentMethod: data.paymentMethod,
      allergyNote: data.allergyNote || allergyNote || undefined,
      allergyAcknowledgedByKitchen: false,
      gateInstructions: data.gateInstructions || gateInstructions || undefined,
      landmark: data.landmark || landmark || undefined,
      isGuest: data.isGuest ?? isGuestCheckout,
      scheduledTime: data.scheduledTime || scheduledTime || undefined,
      splitPayment: data.splitPayment || (redeemCredits ? { creditsUsed: creditsDiscount, upiPaid: totalAmount } : undefined),
      meetingPointAssigned: data.meetingPointAssigned || serviceMeetingPoint || undefined,
      idempotencyKey: data.idempotencyKey || `idem-${Date.now()}`,
      groupOrderId: groupOrderActive ? 'grp-821' : undefined,
      groupMembers: groupOrderActive ? groupMembers : undefined,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update rider state
    setRiders((prev) =>
      prev.map((r) =>
        r.id === availableRider.id
          ? { ...r, status: 'to_kitchen', currentOrderId: newOrderId }
          : r
      )
    );

    const earnedCredits = Math.round(totalAmount * 0.05);
    setFalconCredits((prev) => (redeemCredits ? Math.max(0, prev - creditsDiscount + earnedCredits) : prev + earnedCredits));

    // Deduct packaging stock
    setPackagingStock((prev) => ({
      ...prev,
      bagasse_box: Math.max(0, (prev.bagasse_box ?? 40) - cart.length),
    }));

    clearCart();
    setAllergyNote('');
    setAppliedCoupon(null);
    setLiveToast(`Order ${newOrderId} placed! Assigned to rider ${availableRider.name}.`);
    logSystemEvent(
      `New Order Placed (${newOrderId})`,
      'kitchen',
      `Routed to ${assignedKitchen.name}. Rider ${availableRider.name} assigned for dispatch.`
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const addReviewToOrder = (orderId: string, rating: number, reviewText: string, travelRating: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, rating, reviewText } : o))
    );

    const firstDish = order.items[0]?.name || 'Signature Combo';
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      orderId,
      customerName: order.customerName,
      brandId: order.brandId,
      brandName: order.brandName,
      dishName: firstDish,
      rating,
      reviewText,
      travelRating,
      timeAgo: 'Just now',
      pinCode: order.pinCode,
      channel: order.channel,
    };

    setReviews((prev) => [newReview, ...prev]);
    setLiveToast(`Customer review received: ${rating}★ for ${order.brandName}.`);
    logSystemEvent(
      `Customer Review (${rating}★)`,
      'ops',
      `Feedback logged for ${order.brandName}. Travel quality rated ${travelRating}/5.`
    );
  };

  // RIDER DELIVERY FLOW ACTIONS
  const acceptDeliveryOrder = (orderId?: string) => {
    const targetOrderId = orderId || activeDeliveryOrder?.id;
    if (lowNetworkMode) {
      setOfflineQueue((prev) => [...prev, { id: `q-${Date.now()}`, action: 'Accept Order', timestamp: 'Just now' }]);
      setLiveToast('Offline Mode: Order acceptance queued locally.');
    }

    setDeliveryStep('navigating_to_kitchen');
    if (targetOrderId) {
      updateOrderStatus(targetOrderId, 'Preparing');
      setRiders((prev) =>
        prev.map((r) => (r.id === activeRiderId ? { ...r, status: 'to_kitchen', currentOrderId: targetOrderId } : r))
      );
      logSystemEvent(
        `Order Accepted (${targetOrderId})`,
        'kitchen',
        `Kitchen prep alerted: Rider ${currentRider.name} en route for pickup.`
      );
    }
  };

  const rejectDeliveryOrder = (reason: string) => {
    const targetOrderId = activeDeliveryOrder?.id;
    setRiders((prev) =>
      prev.map((r) =>
        r.id === activeRiderId
          ? { ...r, status: 'idle', acceptanceRate: Math.max(70, r.acceptanceRate - 2) }
          : r
      )
    );
    setDeliveryStep('idle');
    setLiveToast(`Offer rejected (${reason}). Acceptance rate updated.`);
    logSystemEvent(
      `Order Rejected (${targetOrderId || 'GF-9481'})`,
      'ops',
      `Reason: ${reason}. Automated dispatch auto-reassigning to next nearby rider.`
    );
  };

  const markRiderArrivedKitchen = () => {
    if (lowNetworkMode) {
      setOfflineQueue((prev) => [...prev, { id: `q-${Date.now()}`, action: 'Arrived at Kitchen', timestamp: 'Just now' }]);
    }
    setDeliveryStep('at_kitchen_waiting');
    setRiders((prev) =>
      prev.map((r) => (r.id === activeRiderId ? { ...r, status: 'waiting' } : r))
    );
    setLiveToast(`Arrived at kitchen. Waiting timer started.`);
    logSystemEvent(
      `Rider Arrived at Station`,
      'kitchen',
      `Kitchen Board: ${currentRider.name} checked in at dispatch bay for ${activeDeliveryOrder?.brandName}.`
    );
  };

  const claimWaitingCompensation = () => {
    // Add ₹35 waiting pay
    setRiders((prev) =>
      prev.map((r) =>
        r.id === activeRiderId
          ? {
              ...r,
              todayEarnings: r.todayEarnings + 35,
              accruedBalance: r.accruedBalance + 35,
            }
          : r
      )
    );
    setLiveToast('₹35 Long Wait Compensation credited to your wallet!');
    logSystemEvent(
      `Wait Compensation Credited (+₹35)`,
      'finance',
      `Wait exceeded SLA. Partner Bank credited compensation. Kitchen penalized for SLA delay.`
    );
  };

  const confirmPickup = () => {
    if (lowNetworkMode) {
      setOfflineQueue((prev) => [...prev, { id: `q-${Date.now()}`, action: 'Confirm Pickup', timestamp: 'Just now' }]);
    }
    if (activeDeliveryOrder) {
      updateOrderStatus(activeDeliveryOrder.id, 'Out for delivery');
    }
    setDeliveryStep('navigating_to_customer');
    setRiders((prev) =>
      prev.map((r) => (r.id === activeRiderId ? { ...r, status: 'delivering' } : r))
    );
    setLiveToast(`Order picked up! Bag sealed. Customer live tracking activated.`);
    logSystemEvent(
      `Order Handover Complete (${activeDeliveryOrder?.id})`,
      'customer',
      `Customer tracking switched to "Out for delivery". Ather EV route live on map.`
    );
  };

  const arrivedCustomerLocation = () => {
    if (lowNetworkMode) {
      setOfflineQueue((prev) => [...prev, { id: `q-${Date.now()}`, action: 'Arrived at Customer', timestamp: 'Just now' }]);
    }
    setDeliveryStep('arrived_at_customer');
    setLiveToast('Arrived at customer address. Ring bell or verify OTP.');
    logSystemEvent(
      `Rider at Customer Gate`,
      'customer',
      `Customer app notified: Rider ${currentRider.name} has arrived with your hot meal.`
    );
  };

  const completeCustomerDrop = (otpOrCode: string, collectedCash?: number) => {
    const targetOrder = activeDeliveryOrder;
    if (targetOrder) {
      updateOrderStatus(targetOrder.id, 'Delivered');
    }
    const earnedFare = (rainSurgeActive ? 25 : 0) + 65;
    const autoSaveDeduction = riderAutoSaveVal;
    const insuranceDeduction = riderMicroInsurance ? 1.5 : 0;
    const netPayout = earnedFare - autoSaveDeduction - insuranceDeduction;

    setRiders((prev) =>
      prev.map((r) => {
        if (r.id === activeRiderId) {
          return {
            ...r,
            tripsToday: r.tripsToday + 1,
            todayEarnings: r.todayEarnings + Math.round(netPayout),
            accruedBalance: r.accruedBalance + Math.round(netPayout),
            accumulatedSavings: r.accumulatedSavings + autoSaveDeduction,
            cashInHand: collectedCash ? r.cashInHand + collectedCash : r.cashInHand,
            status: 'idle',
            complimentsCount: r.complimentsCount + 1,
          };
        }
        return r;
      })
    );

    setDeliveryStep('completed');
    setLiveToast(`Delivery Completed! Earned ₹${earnedFare} (Auto-saved ₹${autoSaveDeduction} to RD).`);
    logSystemEvent(
      `Delivery Completed (${targetOrder?.id})`,
      'finance',
      `Trip fee ₹${earnedFare} calculated. ₹${autoSaveDeduction} deposited to Partner Bank RD. Cash-in-hand updated.`
    );
  };

  // EXCEPTION HANDLERS
  const handleRiderException = (type: ExceptionType, detail?: string) => {
    switch (type) {
      case 'food_not_ready':
        claimWaitingCompensation();
        break;
      case 'missing_items':
        setLiveToast('Kitchen Alerted: Expediting missing item at packaging station.');
        logSystemEvent('Missing Item at Pickup', 'kitchen', 'Kitchen supervisor re-dispensed missing item immediately.');
        break;
      case 'spilled_food':
        setLiveToast('Spillage Reported: Free replacement triggered for customer. Zero penalty for sealed bag.');
        logSystemEvent('Spillage Reported', 'customer', 'Customer compensated with ₹150 credit. Kitchen packaging audit triggered.');
        break;
      case 'customer_unreachable':
        setLiveToast('Unreachable Logged: 10-min countdown started. Full delivery fee guaranteed.');
        logSystemEvent('Customer Unreachable', 'ops', 'Call attempt logged. If unresolved, rider keeps payout & returns meal.');
        break;
      case 'wrong_address':
        setLiveToast('Address Updated: Map route pin adjusted + extra distance pay ₹18 added.');
        logSystemEvent('Address Corrected', 'customer', 'Customer shared landmark. Extra distance allowance granted to rider.');
        break;
      case 'customer_cancelled':
        setLiveToast('Customer Cancelled: Rider compensated full base fee ₹50 + return allowance.');
        logSystemEvent('Cancellation After Pickup', 'finance', 'Customer charged cancellation fee. Rider paid ₹50 base fee.');
        break;
      case 'vehicle_breakdown':
        setLiveToast('Breakdown Reported: Nearest backup rider Sunil Gowda assigned. Partial pay saved.');
        logSystemEvent('Vehicle Breakdown (Puncture)', 'ops', 'Order reassigned to Sunil Gowda (Ola S1). Partial pay credited.');
        break;
      case 'battery_low':
        setLiveToast('Battery Alert: Filtered out long-distance orders. Routing to Sun Mobility Swap station.');
        logSystemEvent('EV Battery Low (< 20%)', 'ops', 'Restricted to < 2.5 km drops. 2-min swap point indicated.');
        break;
      case 'heavy_rain':
        setRainSurgeActive(true);
        setLiveToast('Monsoon Surge Activated: +₹25 on all deliveries! Slower ETAs shown to diners.');
        logSystemEvent('Monsoon Surge Active', 'customer', 'Rain surge pay enabled across Bangalore. Customer delivery SLAs extended.');
        break;
      case 'traffic_delay':
        setLiveToast('Traffic Delay: Silk Board / 100ft road congestion noted. Customer ETA +10m.');
        logSystemEvent('Traffic Congestion Delay', 'customer', 'Customer tracking dynamic ETA updated by +10 mins.');
        break;
      case 'network_lost':
        setLowNetworkMode(true);
        setLiveToast('Switched to Low Network Mode: Offline Queue enabled.');
        break;
      case 'abusive_customer':
        setLiveToast('Safety Protocol: Incident reported. Customer flagged for unsafe drop.');
        logSystemEvent('Safety Incident Reported', 'ops', 'Customer blacklisted from direct COD. Rider support manager on call.');
        break;
    }
  };

  const depositCashInHand = () => {
    setRiders((prev) =>
      prev.map((r) => (r.id === activeRiderId ? { ...r, cashInHand: 0 } : r))
    );
    setLiveToast('Cash deposited successfully via Partner Bank CDM / UPI QR.');
    logSystemEvent('Cash Deposited', 'finance', 'Rider cash-in-hand reconciled to ₹0 via Partner Bank UPI transfer.');
  };

  const triggerSOS = () => {
    setSosActive(true);
    setLiveToast('EMERGENCY SOS TRIGGERED: Bangalore Police (112) & Growth Falcon Safety alerted with GPS.');
    logSystemEvent('EMERGENCY SOS TRIGGERED', 'ops', `CRITICAL: Live location of ${currentRider.name} shared with response team.`);
  };

  const resolveSOS = () => {
    setSosActive(false);
    setLiveToast('SOS status resolved. Rider confirmed safe.');
    logSystemEvent('SOS Alert Resolved', 'ops', `${currentRider.name} confirmed safe and attended to.`);
  };

  const toggleHygieneCheck = (taskId: string) => {
    setHygieneChecks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const triggerInstantSettlement = () => {
    setInstantSettlementDone(true);
    setLiveToast('₹2,48,600 settled instantly via Partner Bank IMPS! (0.15% fee applied).');
  };

  const triggerRiderWithdrawal = () => {
    setRiderWithdrawalDone(true);
    const rider = riders.find((r) => r.id === activeRiderId) || riders[0];
    setLiveToast(`₹${rider.todayEarnings} transferred to UPI ID instantly via Partner Bank EWA!`);
    logSystemEvent('Earned Wage Withdrawal', 'finance', `Instant payout of ₹${rider.todayEarnings} transferred to rider bank account.`);
  };

  const addCampaign = (camp: CampaignResult) => {
    setCampaigns((prev) => [camp, ...prev]);
    setLiveToast(`Campaign "${camp.name}" launched to ${camp.recipientsCount} customers via WhatsApp!`);
  };

  const addSupportTicket = (ticket: SupportTicket) => {
    setSupportTickets((prev) => [ticket, ...prev]);
    setLiveToast(`Support Ticket #${ticket.id} created.`);
    logSystemEvent(`Support Ticket #${ticket.id}`, 'ops', `Issue (${ticket.category}) logged with AI recommended resolution.`);
  };

  const resolveSupportTicket = (ticketId: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'Resolved' } : t))
    );
    setLiveToast(`Support Ticket #${ticketId} marked as resolved.`);
  };

  const toggleShiftBooking = (shiftId: string) => {
    setShiftSlots((prev) =>
      prev.map((s) => (s.id === shiftId ? { ...s, booked: !s.booked } : s))
    );
  };

  const reassignOrder = (orderId: string, newRiderId: string) => {
    const targetRider = riders.find((r) => r.id === newRiderId);
    if (!targetRider) return;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, riderId: targetRider.id, riderName: targetRider.name } : o))
    );

    setRiders((prev) =>
      prev.map((r) => {
        if (r.id === newRiderId) return { ...r, status: 'to_kitchen', currentOrderId: orderId };
        if (r.currentOrderId === orderId) return { ...r, status: 'idle', currentOrderId: undefined };
        return r;
      })
    );

    setLiveToast(`Order ${orderId} reassigned to ${targetRider.name}.`);
    logSystemEvent(
      `Order Reassigned (${orderId})`,
      'ops',
      `Fleet controller reassigned dispatch from previous partner to ${targetRider.name}.`
    );
  };

  // PHASE 3: DELIVERY & IN-TRANSIT REAL-TIME CASES
  const requestMidDeliveryAddressChange = (
    orderId: string,
    newAddress: string,
    newArea: string,
    distanceKm: number
  ) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { accepted: false, feeRequired: false, fee: 0, message: 'Order not found' };

    const maxFreeKm = rules.midDeliveryAddressChangeMaxKm || 1;
    const rerouteFee = rules.midDeliveryAddressChangeFee || 45;

    if (distanceKm <= maxFreeKm) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                area: newArea,
                addressChangedMidDelivery: {
                  oldAddress: o.area,
                  newAddress,
                  distanceKm,
                  extraFee: 25,
                  status: 'accepted',
                },
              }
            : o
        )
      );
      // Credit active rider bonus
      setRiders((prev) =>
        prev.map((r) =>
          r.id === order.riderId ? { ...r, cashInHand: r.cashInHand + 25 } : r
        )
      );
      setLiveToast(`Address updated to "${newArea}". Delivery partner credited ₹25 bonus.`);
      logSystemEvent(
        `Address Changed Mid-Transit (${orderId})`,
        'rider',
        `Within ${maxFreeKm} km. Rider GPS rerouted to ${newArea}; +₹25 incentive credited.`
      );
      return {
        accepted: true,
        feeRequired: false,
        fee: 0,
        message: 'Address updated within 1 km threshold. ₹25 incentive credited to rider.',
      };
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                addressChangedMidDelivery: {
                  oldAddress: o.area,
                  newAddress,
                  distanceKm,
                  extraFee: rerouteFee,
                  status: 'fee_required',
                },
              }
            : o
        )
      );
      setLiveToast(`Address change > ${maxFreeKm} km: Confirm ₹${rerouteFee} rerouting surcharge to proceed.`);
      logSystemEvent(
        `Address Reroute Fee Required (${orderId})`,
        'customer',
        `Distance ${distanceKm} km exceeds free threshold (${maxFreeKm} km). Awaiting ₹${rerouteFee} approval.`
      );
      return {
        accepted: false,
        feeRequired: true,
        fee: rerouteFee,
        message: `Distance (${distanceKm} km) exceeds free ${maxFreeKm} km limit. Surcharge of ₹${rerouteFee} required.`,
      };
    }
  };

  const confirmMidDeliveryAddressChangeFee = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || !order.addressChangedMidDelivery) return;

    const fee = order.addressChangedMidDelivery.extraFee;
    const newArea = order.addressChangedMidDelivery.newAddress;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              area: newArea,
              totalAmount: o.totalAmount + fee,
              addressChangedMidDelivery: {
                ...o.addressChangedMidDelivery!,
                status: 'accepted',
              },
            }
          : o
      )
    );

    setLiveToast(`Reroute confirmed (+₹${fee}). Delivery partner rerouted to new location.`);
    logSystemEvent(
      `Reroute Fee Paid (+₹${fee})`,
      'rider',
      `Customer approved ₹${fee} fee. Dispatch reroute pushed to rider console.`
    );
  };

  const addMidDeliveryInstruction = (orderId: string, instruction: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, midDeliveryInstruction: instruction } : o))
    );
    setLiveToast(`Instruction pushed to rider: "${instruction}"`);
    logSystemEvent(
      `Delivery Note Added (${orderId})`,
      'rider',
      `Live instruction: "${instruction}" synced instantly to rider phone.`
    );
  };

  const triggerSecurityGateHold = (orderId: string) => {
    const waitSeconds = (rules.customerAbsentWaitMin || 8) * 60;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, securityGateHold: { active: true, waitTimerSeconds: waitSeconds } }
          : o
      )
    );
    setLiveToast(`"Meet at Gate" triggered. Customer notified with ${rules.customerAbsentWaitMin}m countdown.`);
    logSystemEvent(
      `Security Gate Hold (${orderId})`,
      'customer',
      `Security denied entry. Customer notified to collect order at society main gate.`
    );
  };

  const generateAlternateDropCode = (orderId: string) => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, alternateDropCode: code } : o))
    );
    setLiveToast(`Alternate in-app OTP generated: ${code}`);
    logSystemEvent(
      `Alternate OTP Issued (${orderId})`,
      'rider',
      `SMS network delay bypassed. In-app verified code ${code} active for handoff.`
    );
    return code;
  };

  const reportSwappedOrder = (orderId: string, notes: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, swappedOrderReported: true } : o))
    );
    setFalconCredits((prev) => prev + 250);
    setLiveToast(`Swapped order reported: ₹250 refund credited & priority rush re-cook initiated!`);
    logSystemEvent(
      `Batched Order Swapped (${orderId})`,
      'ops',
      `Dual-drop mix-up resolved: Priority re-cook ticket fired to kitchen; customer wallet reimbursed. Note: ${notes}`
    );
  };

  const submitNotReceivedClaim = (orderId: string, explanation: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, notReceivedClaim: { status: 'investigating', evidence: explanation } }
          : o
      )
    );
    setLiveToast('Dispute lodged: Geofence logs and OTP audit submitted to Senior Operations Desk.');
    logSystemEvent(
      `Delivery Disputed (${orderId})`,
      'ops',
      `Claim lodged. Cross-referencing rider timestamp, GPS coordinates, and OTP handoff.`
    );
  };

  const tipRider = (orderId: string, amount: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, riderTipAmount: (o.riderTipAmount || 0) + amount } : o
      )
    );
    const order = orders.find((o) => o.id === orderId);
    if (order?.riderId) {
      setRiders((prev) =>
        prev.map((r) =>
          r.id === order.riderId ? { ...r, cashInHand: r.cashInHand + amount } : r
        )
      );
    }
    triggerCelebration(
      `₹${amount} Tip Delivered!`,
      `100% of your tip goes directly to ${order?.riderName || 'your delivery partner'}.`,
      `+₹${amount}`
    );
    logSystemEvent(
      `Rider Tip (+₹${amount})`,
      'rider',
      `100% tip pass-through credited directly to ${order?.riderName || 'partner'}.`
    );
  };

  const sendChatMessage = (orderId: string, sender: 'customer' | 'rider', text: string) => {
    const isEnglish = /^[A-Za-z0-9\s.,!?'"()-]+$/.test(text);
    let translated = '';
    if (sender === 'customer') {
      translated = `[Auto-Translated] ದಯವಿಟ್ಟು: "${text}" (Kannada translation for delivery partner)`;
    } else {
      translated = `[Auto-Translated] "${text}" (Translated to English for diner)`;
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      orderId,
      sender,
      senderName: sender === 'customer' ? 'Customer' : 'Delivery Partner',
      text,
      translatedText: translated,
      language: isEnglish ? 'English' : 'Kannada',
      timestamp: 'Just now',
    };

    setChatMessages((prev) => [...prev, newMsg]);
    logSystemEvent(
      `Multilingual Chat (${orderId})`,
      sender === 'customer' ? 'rider' : 'customer',
      `Message auto-translated between English and Kannada with zero delay.`
    );
  };

  // PHASE 4: POST-DELIVERY & CUSTOMER SERVICE CASES
  const submitOrderComplaint = (
    orderId: string,
    complaintType: 'missing_item' | 'wrong_item' | 'cold_food' | 'short_quantity' | 'spilled' | 'foreign_object' | 'late',
    requestedResolution: 'refund' | 'replacement',
    evidencePhotoUrl?: string,
    notes?: string
  ) => {
    const order = orders.find((o) => o.id === orderId);
    const windowHours = rules.complaintWindowHours || 48;

    if (order && order.elapsedMinutes > windowHours * 60) {
      setFalconCredits((prev) => prev + 40);
      setLiveToast(`Order is beyond ${windowHours}h complaint window. ₹40 goodwill coupon added to wallet.`);
      logSystemEvent(
        `Expired Complaint Declined (${orderId})`,
        'customer',
        `Report received after ${windowHours}h. Auto-issued ₹40 goodwill coupon.`
      );
      return;
    }

    if (complaintType === 'foreign_object' && order) {
      if (!pausedKitchenIds.includes(order.kitchenId)) {
        setPausedKitchenIds((prev) => [...prev, order.kitchenId]);
      }
      setLiveToast(`SAFETY FAST-TRACK: Foreign object flagged. ${order.kitchenName} intake paused pending QA review.`);
      logSystemEvent(
        `Safety Alert: Foreign Object (${orderId})`,
        'kitchen',
        `Critical QA breach flagged. Kitchen intake paused and batch flagged for hygiene audit. Note: ${notes || ''}`
      );
    }

    const refundAmt = order ? order.totalAmount : 200;
    if (requestedResolution === 'refund') {
      setFalconCredits((prev) => prev + refundAmt);
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              complaint: {
                id: `cmp-${Date.now()}`,
                type: complaintType,
                requestedResolution,
                status: 'resolved',
                evidencePhotoUrl: evidencePhotoUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300',
                resolutionNote:
                  requestedResolution === 'refund'
                    ? `₹${refundAmt} refunded instantly to Falcon Wallet.`
                    : 'Replacement dispatch priority-scheduled with kitchen.',
              },
            }
          : o
      )
    );

    setLiveToast(
      requestedResolution === 'refund'
        ? `Complaint accepted: ₹${refundAmt} refunded to Falcon Wallet.`
        : 'Complaint accepted: Free replacement order dispatched!'
    );

    logSystemEvent(
      `Issue Resolved: ${complaintType} (${orderId})`,
      'customer',
      `Resolution: ${requestedResolution.toUpperCase()} under ${windowHours}h SLA.`
    );
  };

  const appealComplaint = (orderId: string, notes: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId && o.complaint
          ? {
              ...o,
              complaint: {
                ...o.complaint,
                status: 'appealed',
                appealNote: notes,
              },
            }
          : o
      )
    );
    setLiveToast('Case escalated: Senior Ops Desk agent will review your appeal within 2 hours.');
    logSystemEvent(
      `Customer Appeal Escalated (${orderId})`,
      'ops',
      `Appeal priority assigned to Senior Desk queue. Notes: "${notes}"`
    );
  };

  const requestGstInvoice = (orderId: string, gstin?: string) => {
    const validGstin = gstin?.trim() || '29AABCG1234F1Z5';
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              gstin: validGstin,
              gstInvoiceUrl: `https://growthfalcon.in/invoices/${orderId}-gst.pdf`,
            }
          : o
      )
    );
    setLiveToast(`GST Tax Invoice generated for ${orderId} (GSTIN: ${validGstin}) ✓`);
    logSystemEvent(
      `GST Tax Invoice Generated (${orderId})`,
      'customer',
      `Invoice with 5% GST breakdown, HSN codes, and GSTIN ${validGstin} ready for download.`
    );
  };

  const toggleLunchPlanPause = () => {
    setLunchPlanPaused((prev) => {
      const next = !prev;
      setLiveToast(
        next
          ? 'Corporate Lunch Plan paused for today. No meal scheduled, credits retained.'
          : 'Corporate Lunch Plan resumed. Daily meal schedule active.'
      );
      return next;
    });
  };

  const downloadUserData = () => {
    const data = {
      user: 'Priya Sharma (+91 9876543210)',
      orders: orders.slice(0, 5),
      reviews: reviews.slice(0, 3),
      falconCredits,
      exportedAt: new Date().toISOString(),
      compliance: 'India Digital Personal Data Protection (DPDP) Act 2023',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `growth-falcon-user-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setLiveToast('User profile & transaction history exported under DPDP compliance ✓');
  };

  const withdrawMarketingConsent = () => {
    setMarketingConsentRevoked(true);
    setLiveToast('Marketing & promo consent revoked. NBFC EMI deductions continue as per signed loan agreement.');
    logSystemEvent(
      'Consent Revoked (Marketing)',
      'finance',
      'Promotional tracking stopped. Financial servicing & active loan repayment mandates remain active.'
    );
  };

  const requestAccountDeletion = () => {
    setAccountDeletedState(true);
    setLiveToast('Account deletion requested: 30-day grace period started. Active loan commitments audited.');
    logSystemEvent(
      'Account Deletion Request',
      'customer',
      'Data anonymization scheduled. Finance escrow verified zero outstanding liabilities.'
    );
  };

  const reportCustomerConduct = (orderId: string, riderId: string, reason: string) => {
    setLiveToast(`Safety Report: Customer conduct flagged ("${reason}"). COD restricted for future orders.`);
    logSystemEvent(
      `Rider Safety Report (${orderId})`,
      'ops',
      `Rider ${riderId} reported abusive customer or unsafe drop location. Zone audit triggered.`
    );
  };

  const reportKitchenConduct = (orderId: string, riderId: string, reason: string) => {
    setLiveToast(`Incident Logged: Kitchen handover delay/conduct flagged ("${reason}"). Operations notified.`);
    logSystemEvent(
      `Kitchen Handover Flag (${orderId})`,
      'ops',
      `Rider ${riderId} reported dispatch delay or packaging issue. Kitchen SLA scored penalized.`
    );
  };

  const disputePartnerDeduction = (partnerId: string, deductionType: string, amount: number, reason: string) => {
    const newDispute = {
      id: `disp-${Date.now()}`,
      partnerId,
      type: deductionType,
      amount,
      reason,
      status: 'in_review' as const,
    };
    setPartnerDeductionDisputes((prev) => [newDispute, ...prev]);
    setLiveToast(`Deduction dispute for ₹${amount} submitted to Partner Finance Committee.`);
    logSystemEvent(
      `Deduction Disputed (₹${amount})`,
      'finance',
      `Partner ${partnerId} contested ${deductionType}. Review scheduled within 48h SLA.`
    );
  };

  // PHASE 5: OUTAGES, AGGREGATOR SYNC & QUALITY RECALLS
  const triggerBatchRecall = (batchNumber: string, ingredientName: string, affectedDish: string) => {
    const newRecall = {
      batchNumber,
      ingredient: ingredientName,
      dish: affectedDish,
      time: 'Just now',
      quarantined: true,
    };
    setRecalledBatches((prev) => [newRecall, ...prev]);

    const targetItem = MENU_ITEMS.find((m) => m.name.toLowerCase().includes(affectedDish.toLowerCase()));
    if (targetItem && !soldOutItemIds.includes(targetItem.id)) {
      setSoldOutItemIds((prev) => [...prev, targetItem.id]);
    }

    setLiveToast(`BATCH RECALL ACTIVATED: Batch ${batchNumber} (${ingredientName}) quarantined. 14 diners notified.`);
    logSystemEvent(
      `Batch Quarantined (${batchNumber})`,
      'kitchen',
      `Ingredient ${ingredientName} quarantined across kitchens. Preventative SMS/alerts dispatched to diners.`
    );
  };

  const syncAggregatorPrices = () => {
    setAggregatorPriceMismatchCount(0);
    setLiveToast('All menus synchronized across Swiggy, Zomato & ONDC via central Cloud Kitchen API ✓');
    logSystemEvent(
      'Aggregator Prices Aligned',
      'marketing',
      'Central menu pricing synced across Swiggy, Zomato & ONDC. Zero variance confirmed.'
    );
  };

  const initiatePartnerOffboarding = (partnerType: 'kitchen' | 'rider', id: string, name: string) => {
    const pendingPayout = partnerType === 'kitchen' ? 84200 : 7850;
    const deductions = partnerType === 'kitchen' ? 3200 : 450;
    const netPayable = pendingPayout - deductions;

    setOffboardingSettlement({
      partnerName: name,
      pendingPayout,
      deductions,
      netPayable,
      nocGenerated: true,
    });

    setLiveToast(`Settlement statement & NOC Certificate generated for ${name}.`);
    logSystemEvent(
      `Partner Offboarding (${name})`,
      'finance',
      `Net settlement ₹${netPayable.toLocaleString('en-IN')} approved. Zero-liability NOC issued.`
    );
  };

  const closeOffboardingSettlement = () => setOffboardingSettlement(null);

  // FINANCE CASES
  const toggleSlowWeekRollover = () => {
    setSlowWeekRolloverActive((prev) => {
      const next = !prev;
      setLiveToast(
        next
          ? `Slow week protection enabled: EMI capped at ${rules.slowWeekEmiCapPct || 20}% of weekly revenue.`
          : 'Standard fixed-EMI schedule active.'
      );
      return next;
    });
  };

  const appealInsuranceClaim = (ticketId: string, reason: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'In Progress' } : t))
    );
    setLiveToast('Micro-insurance claim appeal submitted with hospital bills and GPS telematics proof ✓');
    logSystemEvent(
      `Insurance Appeal Submitted (${ticketId})`,
      'finance',
      `ICICI Lombard / Digit micro-insurance desk reviewing GPS crash telematics. SLA: 48 hours. Reason: ${reason}`
    );
  };

  const toggleInstantPayoutFallback = () => {
    setInstantPayoutFallbackBatch((prev) => {
      const next = !prev;
      setLiveToast(
        next
          ? 'IMPS gateway maintenance: Instant payout will queue into 8:00 AM NEFT banking cycle.'
          : 'Instant IMPS wallet payout active.'
      );
      return next;
    });
  };

  // Demo Mode: burst of simulated live orders and rider movements
  useEffect(() => {
    if (!demoMode) return;

    const sampleBangaloreLocations = [
      { name: 'Rohan Mehra', area: 'Koramangala 5th Block', pin: '560034', kitchen: 'k-1' },
      { name: 'Kavita Pillai', area: 'Indiranagar 100ft Rd', pin: '560038', kitchen: 'k-2' },
      { name: 'Siddharth Sen', area: 'HSR Sector 2', pin: '560102', kitchen: 'k-3' },
      { name: 'Aarav Choudhury', area: 'Whitefield EPIP Zone', pin: '560066', kitchen: 'k-4' },
      { name: 'Deepa Hegde', area: 'Bellandur EcoWorld', pin: '560103', kitchen: 'k-5' },
    ];

    const channels: Order['channel'][] = ['Direct App', 'Swiggy', 'Zomato', 'ONDC', 'WhatsApp'];

    let tickCount = 0;
    const interval = setInterval(() => {
      tickCount++;
      const loc = sampleBangaloreLocations[Math.floor(Math.random() * sampleBangaloreLocations.length)];
      const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
      const brandMenuItems = MENU_ITEMS.filter((i) => i.brandId === brand.id);
      const chosenItem = brandMenuItems[Math.floor(Math.random() * brandMenuItems.length)];
      const channel = channels[Math.floor(Math.random() * channels.length)];
      const targetKitchen = KITCHENS.find((k) => k.id === loc.kitchen) || KITCHENS[0];
      const randomRider = riders[Math.floor(Math.random() * riders.length)];

      const simulatedOrder: Order = {
        id: `GF-${Math.floor(2000 + Math.random() * 7900)}`,
        customerName: loc.name,
        customerPhone: '+91 98' + Math.floor(10000000 + Math.random() * 89999999),
        pinCode: loc.pin,
        area: loc.area,
        brandId: brand.id,
        brandName: brand.name,
        kitchenId: targetKitchen.id,
        kitchenName: targetKitchen.name,
        items: [
          {
            id: chosenItem.id,
            name: chosenItem.name,
            price: chosenItem.price,
            quantity: 1,
            prepTime: chosenItem.prepTime,
          },
        ],
        subtotal: chosenItem.price,
        discount: channel === 'Direct App' ? 40 : 20,
        taxes: Math.round(chosenItem.price * 0.05),
        totalAmount: chosenItem.price + Math.round(chosenItem.price * 0.05) - (channel === 'Direct App' ? 40 : 20),
        channel,
        status: 'Preparing',
        createdAt: 'Just now',
        elapsedMinutes: 1,
        targetPrepMinutes: chosenItem.prepTime,
        riderName: randomRider.name,
        riderId: randomRider.id,
        paymentMethod: 'UPI',
      };

      setOrders((prev) => [simulatedOrder, ...prev.slice(0, 40)]);

      // Occasional demo event log
      if (tickCount % 2 === 0) {
        logSystemEvent(
          `Demo Order Dispatched (${simulatedOrder.id})`,
          'kitchen',
          `${targetKitchen.name}: ${chosenItem.name} assigned to ${randomRider.name} for ${loc.area}.`
        );
      } else if (tickCount % 5 === 0) {
        // simulate an occasional exception for presentation demo
        logSystemEvent(
          `Weather Surge Alert (+₹25)`,
          'customer',
          `Rain detected over Indiranagar & HSR. Surge active, ETAs auto-buffered.`
        );
      }

      setLiveToast(`[Demo Burst] Order ${simulatedOrder.id} dispatched from ${targetKitchen.name} to ${loc.area}!`);
    }, 4500);

    return () => clearInterval(interval);
  }, [demoMode, riders]);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        demoMode,
        setDemoMode,
        overviewSubTab,
        setOverviewSubTab,
        customerSubTab,
        setCustomerSubTab,
        kitchenSubTab,
        setKitchenSubTab,
        marketingSubTab,
        setMarketingSubTab,
        financeSegment,
        setFinanceSegment,
        financeSubTab,
        setFinanceSubTab,
        riderBottomTab,
        setRiderBottomTab,
        notificationsOpen,
        setNotificationsOpen,
        systemActivityOpen,
        setSystemActivityOpen,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        falconCredits,
        redeemCredits,
        setRedeemCredits,
        activeBrandId,
        setActiveBrandId,
        activeCategory,
        setActiveCategory,
        orders,
        placeOrder,
        updateOrderStatus,
        addReviewToOrder,
        activeKitchenId,
        setActiveKitchenId,
        hygieneChecks,
        toggleHygieneCheck,
        reviews,
        riders,
        activeRiderId,
        setActiveRiderId,
        dataSharingConsent,
        setDataSharingConsent,
        instantSettlementDone,
        triggerInstantSettlement,
        riderWithdrawalDone,
        triggerRiderWithdrawal,
        riderAutoSaveVal,
        setRiderAutoSaveVal,
        riderMicroInsurance,
        setRiderMicroInsurance,
        campaigns,
        addCampaign,
        activeSegment,
        setActiveSegment,
        riderOnline,
        setRiderOnline,
        riderOnBreak,
        setRiderOnBreak,
        riderLanguage,
        setRiderLanguage,
        lowNetworkMode,
        setLowNetworkMode,
        isSyncing,
        offlineQueueCount: offlineQueue.length,
        activeDeliveryOrder,
        deliveryStep,
        setDeliveryStep,
        acceptDeliveryOrder,
        rejectDeliveryOrder,
        markRiderArrivedKitchen,
        claimWaitingCompensation,
        confirmPickup,
        arrivedCustomerLocation,
        completeCustomerDrop,
        handleRiderException,
        systemEvents,
        logSystemEvent,
        supportTickets,
        addSupportTicket,
        resolveSupportTicket,
        depositCashInHand,
        sosActive,
        triggerSOS,
        resolveSOS,
        shiftSlots,
        toggleShiftBooking,
        reassignOrder,
        rainSurgeActive,
        setRainSurgeActive,
        rules,
        updateRule,
        resetRulesToDefault,
        celebration,
        triggerCelebration,
        dismissCelebration,
        scenarioDrawerOpen,
        setScenarioDrawerOpen,
        activeScenario,
        activeScenarioStepIndex,
        runScenario,
        nextScenarioStep,
        prevScenarioStep,
        closeScenario,
        // Phase 1 & 2 Exports
        dietFilter,
        setDietFilter,
        hideSoldOut,
        setHideSoldOut,
        soldOutItemIds,
        toggleItemSoldOut,
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
        setOtpVerified,
        triggerOtpVerification,
        verifyOtpInput,
        serviceMeetingPoint,
        setServiceMeetingPoint,
        upiPendingState,
        setUpiPendingState,
        syncSweepNotice,
        runSyncSweep,
        dismissSyncSweepNotice,
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
        kitchenAcknowledgeAllergy,
        kitchenRejectOrder,
        kitchenDelayOrder,
        customerAcknowledgeDelay,
        kitchenSendSpecialInstructionInquiry,
        customerAnswerSpecialInstruction,
        kitchenTriggerQCReCook,
        depletedIngredients,
        depleteIngredient,
        restoreIngredient,
        packagingStock,
        updatePackagingStock,
        kitchenOnline,
        setKitchenOnline,
        batchedDeliveryDecision,
        setBatchedDeliveryDecision,
        pausedKitchenIds,
        toggleKitchenPause,
        // Phase 3, 4, 5 & Finance Exports
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
        reportCustomerConduct,
        reportKitchenConduct,
        disputePartnerDeduction,
        partnerDeductionDisputes,
        recalledBatches,
        triggerBatchRecall,
        aggregatorPriceMismatchCount,
        syncAggregatorPrices,
        initiatePartnerOffboarding,
        offboardingSettlement,
        closeOffboardingSettlement,
        slowWeekRolloverActive,
        toggleSlowWeekRollover,
        appealInsuranceClaim,
        instantPayoutFallbackBatch,
        toggleInstantPayoutFallback,
        liveToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
