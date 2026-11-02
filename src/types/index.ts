export type BrandId = 'thali-theory' | 'bowl-republic' | 'midnight-maska';

export interface Brand {
  id: BrandId;
  name: string;
  tagline: string;
  cuisine: string;
  themeColor: string;
  accentColor: string;
  badge: string;
  description: string;
}

export interface MenuItem {
  id: string;
  brandId: BrandId;
  name: string;
  description: string;
  price: number;
  prepTime: number; // in minutes
  travelScore: number; // 1 to 5 scale
  travelNote: string;
  foodCostPct: number; // e.g. 28%
  isVeg: boolean;
  category: string;
  orders90Days: number;
  avgRating: number;
  reorderRate: number; // %
  imageEmoji: string;
  statusBadge?: 'Star Performer' | 'High Margin' | 'Fix Packaging' | 'Optimize Prep' | 'Under Review';
  isJain?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isNutFree?: boolean;
  allergens?: string[];
  isSoldOut?: boolean;
  packagingRequired?: 'bagasse_box' | 'foil_container' | 'paper_bowl' | 'flask_thermo';
}

export interface Kitchen {
  id: string;
  name: string;
  type: 'owned' | 'partner';
  partnerRestaurant?: string;
  location: string;
  pinCode: string;
  spareCapacityUtilizedPct: number;
  chefInCharge: string;
  dailyCapacity: number;
  rating: number;
  hygieneAuditScore: number;
  todayCompletedOrders: number;
  isOpen?: boolean;
  isPaused?: boolean;
  packagingStock?: Record<string, number>;
  pickupWaitScore?: number;
}

export interface DeliveryRider {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'EV' | 'Petrol' | 'Bicycle';
  vehicleModel: string;
  tripsToday: number;
  hoursOnline: number;
  todayEarnings: number;
  accruedBalance: number;
  lifetimeTrips: number;
  rating: number;
  pinCodeBase: string;
  enrolledMicroInsurance: boolean;
  autoSavePerTrip: number; // ₹ per trip into RD
  accumulatedSavings: number;
  status: 'idle' | 'to_kitchen' | 'waiting' | 'delivering' | 'offline';
  acceptanceRate: number;
  onTimePct: number;
  cancellationRate: number;
  complimentsCount: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  cashInHand: number;
  batteryPct: number;
  trainingCompleted: boolean;
  currentOrderId?: string;
}

export type OrderChannel = 'Direct App' | 'Swiggy' | 'Zomato' | 'ONDC' | 'WhatsApp';
export type OrderStatus = 'Placed' | 'Preparing' | 'Ready' | 'Out for delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  prepTime: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  pinCode: string;
  area: string;
  brandId: BrandId;
  brandName: string;
  kitchenId: string;
  kitchenName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  taxes: number;
  totalAmount: number;
  channel: OrderChannel;
  status: OrderStatus;
  createdAt: string; // ISO string or human string
  elapsedMinutes: number;
  targetPrepMinutes: number;
  riderName?: string;
  riderId?: string;
  paymentMethod: 'UPI' | 'Card' | 'COD';
  rating?: number;
  reviewText?: string;
  allergyNote?: string;
  allergyAcknowledgedByKitchen?: boolean;
  gateInstructions?: string;
  landmark?: string;
  isGuest?: boolean;
  scheduledTime?: string;
  splitPayment?: { creditsUsed: number; upiPaid: number };
  groupOrderId?: string;
  groupMembers?: { name: string; itemsSummary: string; shareAmount: number; paid: boolean }[];
  priceAdjustedNotice?: { oldTotal: number; newTotal: number; confirmed: boolean };
  kitchenDelayNotice?: { delayedMinutes: number; reason: string; customerAccepted: boolean };
  specialInstructionInquiry?: {
    question: string;
    suggestedSwap: string;
    status: 'pending' | 'customer_swapped' | 'customer_removed' | 'auto_decided';
    expiresAt: number;
  };
  qcStatus?: 'passed' | 're_cooking' | 'failed';
  multiBrandParts?: { brandName: string; itemName: string; status: 'ready' | 'cooking' | 'delayed'; delayMinutes?: number }[];
  isBatched?: boolean;
  cancellationRefundDetails?: { amount: number; ruleApplied: string; reason: string };
  meetingPointAssigned?: string;
  idempotencyKey?: string;
  // Phase 3 & 4 additions
  addressChangedMidDelivery?: {
    oldAddress: string;
    newAddress: string;
    distanceKm: number;
    extraFee: number;
    status: 'accepted' | 'fee_required' | 'refused';
  };
  midDeliveryInstruction?: string;
  securityGateHold?: { active: boolean; waitTimerSeconds: number };
  alternateDropCode?: string;
  swappedOrderReported?: boolean;
  notReceivedClaim?: { status: 'investigating' | 'upheld' | 'rejected'; evidence: string };
  riderTipAmount?: number;
  complaint?: {
    id: string;
    type: 'missing_item' | 'wrong_item' | 'cold_food' | 'short_quantity' | 'spilled' | 'foreign_object' | 'late';
    evidencePhotoUrl?: string;
    requestedResolution: 'refund' | 'replacement';
    status: 'pending' | 'resolved' | 'appealed';
    resolutionNote?: string;
    appealNote?: string;
  };
  gstin?: string;
  gstInvoiceUrl?: string;
  reviewEdited?: boolean;
  reviewFlaggedFake?: boolean;
  batchDecision?: 'wait_together' | 'unbatch_dispatch';
}

export interface Review {
  id: string;
  orderId: string;
  customerName: string;
  brandId: BrandId;
  brandName: string;
  dishName: string;
  rating: number;
  reviewText: string;
  travelRating: number;
  timeAgo: string;
  pinCode: string;
  channel: OrderChannel;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  pinCode: string;
  area: string;
  segment: 'New' | 'Regular' | 'High-value' | 'Lapsed' | 'Late-night regulars';
  totalOrders: number;
  ltv: number;
  avgOrderValue: number;
  lastOrderDaysAgo: number;
  usualGapDays: number;
  isOverdue: boolean;
  preferredBrand: BrandId;
  preferredDish: string;
}

export interface ChannelFunnel {
  channel: OrderChannel;
  impressions: number;
  menuViews: number;
  orders: number;
  gmv: number;
  commissionPct: number;
  cpa: number;
  netContributionMargin: number;
}

export interface CampaignResult {
  id: string;
  name: string;
  segment: string;
  channel: string;
  sentAt: string;
  recipientsCount: number;
  openRate: number;
  ordersCount: number;
  conversionRate: number;
  revenueGenerated: number;
  roi: string;
}

export interface UnitEconomics {
  channel: 'Direct App (Zero-Commission)' | 'Aggregator (Swiggy/Zomato)';
  orderValue: number;
  foodCost: number;
  packaging: number;
  commission: number;
  delivery: number;
  marketing: number;
  gatewayFee: number;
  netMargin: number;
  marginPct: number;
}

export type RiderLanguage = 'English' | 'Hindi' | 'Kannada';

export type RiderDeliveryStep =
  | 'idle'
  | 'incoming_offer'
  | 'navigating_to_kitchen'
  | 'at_kitchen_waiting'
  | 'pickup_checklist'
  | 'navigating_to_customer'
  | 'arrived_at_customer'
  | 'completed';

export type ExceptionType =
  | 'food_not_ready'
  | 'missing_items'
  | 'spilled_food'
  | 'customer_unreachable'
  | 'wrong_address'
  | 'customer_cancelled'
  | 'vehicle_breakdown'
  | 'battery_low'
  | 'heavy_rain'
  | 'traffic_delay'
  | 'network_lost'
  | 'abusive_customer';

export interface SystemEventLog {
  id: string;
  time: string;
  riderName: string;
  action: string;
  targetView: 'kitchen' | 'customer' | 'finance' | 'ops' | 'rider' | 'marketing';
  impactDetail: string;
}

export interface SupportTicket {
  id: string;
  riderId: string;
  riderName: string;
  category: 'payment' | 'order_issue' | 'safety' | 'app_bug' | 'account';
  query: string;
  reply: string;
  status: 'Open' | 'Resolved' | 'In Progress';
  createdAt: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface ShiftSlot {
  id: string;
  day: string;
  timeRange: string;
  zone: string;
  demandForecast: 'High' | 'Very High' | 'Moderate';
  incentiveBonus: string;
  booked: boolean;
}

export interface RestPoint {
  id: string;
  name: string;
  type: 'Partner Kitchen' | 'Fuel Station' | 'EV Hub';
  zone: string;
  address: string;
  amenities: string[];
  distanceKm: number;
}

export interface RiderTrainingModule {
  id: string;
  title: string;
  category: string;
  duration: string;
  completed: boolean;
  quizScore?: number;
}

export interface AppRules {
  orderCutoffBeforeClosingMin: number;
  kitchenAcceptWindowMin: number;
  paymentRetryAttempts: number;
  orderExpiryMin: number;
  riderNoShowReassignMin: number;
  maxRiderReassignments: number;
  etaSlipAlertMin: number;
  customerAbsentWaitMin: number;
  complaintWindowHours: number;
  resolutionTargetHours: number;
  refundRule: string;
  lateDeliveryTier1Min: number;
  lateDeliveryTier1Credit: number;
  lateDeliveryTier2Min: number;
  lateDeliveryTier2Credit: number;
  perCustomerRefundCapMonth: number;
  codOrderCap: number;
  dailyRiderCashInHandLimit: number;
  busyModeKitchenOpenOrdersCap: number;
  busyModeRiderOpenOrdersCap: number;
  rollingPayoutReservePct: number;
  noFaultRuleFalconAbsorbsFirstMonthly: boolean;
  slowWeekEmiCapPct: number;
  midDeliveryAddressChangeMaxKm: number;
  midDeliveryAddressChangeFee: number;
}

export type FlowLane =
  | 'Customer'
  | 'Channel'
  | 'Falcon platform'
  | 'Payments and bank'
  | 'Partner kitchen'
  | 'Rider'
  | 'Redressal desk';

export type FlowPhase =
  | 'Order and payment'
  | 'Kitchen and dispatch'
  | 'Delivery and close'
  | 'After delivery'
  | 'Any time (outages, disputes, abuse, cash)';

export type FlowNodeType =
  | 'Customer action'
  | 'Goods'
  | 'Information'
  | 'Money'
  | 'Complaint'
  | 'Exception';

export interface FlowMapNode {
  id: string;
  lane: FlowLane;
  phase: FlowPhase;
  type: FlowNodeType;
  title: string;
  summary: string;
  ruleReference?: string;
  relatedScenarioId?: string;
  upstreamIds: string[];
  downstreamIds: string[];
  linksTouched: string[];
}

export interface FlowMapLink {
  from: string;
  to: string;
  isException?: boolean;
}

export type SimulationParty = 'customer' | 'kitchen' | 'rider' | 'bank' | 'ops desk';

export interface ScenarioPerspective {
  party: SimulationParty;
  screenTarget: 'customer' | 'kitchen' | 'rider' | 'finance' | 'overview' | 'rules';
  subTabTarget?: string;
  statusBadge: string;
  description: string;
  impactMetric: string;
}

export interface ScenarioStep {
  stepNumber: number;
  stepTitle: string;
  durationOffset: string;
  ruleInvoked?: string;
  perspectives: ScenarioPerspective[];
}

export interface Scenario {
  id: string;
  title: string;
  phase: FlowPhase;
  triggerType: 'Happy path' | 'Exception' | 'Outage' | 'Dispute' | 'Complaint' | 'Edge Case' | 'Business Logic';
  description: string;
  orderPreview?: {
    brand: string;
    items: string;
    amount: number;
    pinCode: string;
    channel: string;
  };
  rulesApplied: string[];
  outcome: string;
  steps: ScenarioStep[];
}

export interface CelebrationState {
  active: boolean;
  title: string;
  subtitle: string;
  amount?: string;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  sender: 'customer' | 'rider';
  senderName: string;
  text: string;
  translatedText?: string;
  language?: 'English' | 'Hindi' | 'Kannada';
  timestamp: string;
}

