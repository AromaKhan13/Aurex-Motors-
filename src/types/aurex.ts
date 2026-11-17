export type RouteId =
  | 'home'
  | 'inventory'
  | 'new-cars'
  | 'used-cars'
  | 'brands'
  | 'about'
  | 'contact'
  | 'vehicle-detail'
  | 'auth'
  | 'customer-portal'
  | 'admin-portal';

export type PortalSubTab =
  | 'overview'
  | 'favorites'
  | 'saved'
  | 'inquiries'
  | 'test-drives'
  | 'recent'
  | 'profile'
  | 'notifications';

export type AdminSubTab =
  | 'dashboard'
  | 'inventory'
  | 'add-vehicle'
  | 'leads'
  | 'appointments'
  | 'brands'
  | 'analytics'
  | 'settings';

export type VehicleCondition = 'Brand New' | 'Certified Pre-Owned';

export type VehiclePowertrain =
  | 'Internal Combustion'
  | 'Hybrid'
  | 'Electric'
  | 'Plug-In Hybrid';

export type VehicleSilhouette =
  | 'Coupe'
  | 'Roadster'
  | 'SUV'
  | 'Sedan'
  | 'Grand Tourer'
  | 'Estate'
  | 'Hypercar';

export type ExteriorShade =
  | 'Obsidian Black'
  | 'Chalk Gray'
  | 'Champagne Silver'
  | 'Rosso Corsa'
  | 'British Racing Green'
  | 'Sapphire Blue'
  | 'Pearl White'
  | 'Magmabeam Orange';

export type AllocationStatus =
  | 'Immediate Delivery'
  | 'Showroom Floor'
  | 'Private Vault'
  | 'Factory Allocation'
  | 'Reserved';

export interface VehicleGalleryImage {
  label: string;
  url: string;
}

export interface VehicleSpecs {
  engine: string;
  horsepower: string;
  torque: string;
  zeroToSixty: string;
  topSpeed: string;
  transmission: string;
  drivetrain: string;
  weight: string;
  fuelEconomy: string;
  warranty: string;
  downforce?: string;
  braking?: string;
}

export interface Vehicle {
  id: string;
  stockCode: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  title: string;
  condition: VehicleCondition;
  silhouette: VehicleSilhouette;
  powertrain: VehiclePowertrain;
  exteriorColor: string;
  exteriorShade: ExteriorShade;
  interiorColor: string;
  mileage: number;
  price: number;
  msrp?: number;
  monthlyLeaseEstimate: number;
  allocationStatus: AllocationStatus;
  location: string;
  badges: string[];
  featured: boolean;
  cpoTier?: 'Aurex Certified' | 'Heritage Purist';
  ownersCount?: number;
  cleanCarfax?: boolean;
  inspectionScore?: string;
  image: string;
  gallery: VehicleGalleryImage[];
  curatorNotes: string;
  highlights: string[];
  factoryOptions: string[];
  specs: VehicleSpecs;
  syndicatePublic: boolean;
  viewsCount: number;
}

export type MarqueCategory =
  | 'All'
  | 'Hypercar'
  | 'Grand Touring'
  | 'Executive Sport'
  | 'All-Terrain';

export interface Marque {
  id: string;
  name: string;
  origin: string;
  founded: number;
  category: Exclude<MarqueCategory, 'All'>;
  tagline: string;
  availableCount: number;
  heroImage: string;
  popular: boolean;
}

export type InquiryStatus =
  | 'In-Review'
  | 'Concierge Assigned'
  | 'Allocation Confirmed'
  | 'Completed'
  | 'Closed';

export interface Inquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  vehicleId?: string;
  vehicleTitle: string;
  inquiryType:
    | 'Acquisition Request'
    | 'Finance Consultation'
    | 'Private Salon Viewing'
    | 'Bespoke Commissioning'
    | 'Consignment Valuation';
  preferredContact: 'Phone' | 'Email' | 'WhatsApp';
  preferredDate?: string;
  preferredWindow?: string;
  notes: string;
  ndaRequired?: boolean;
  enclosedTransport?: boolean;
  status: InquiryStatus;
  assignedSpecialist: string;
  createdAt: string;
}

export type TestDriveStatus = 'Scheduled' | 'Confirmed' | 'Completed' | 'Rescheduled';

export interface TestDriveBooking {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleImage: string;
  clientName: string;
  date: string;
  timeWindow: string;
  location: string;
  specialist: string;
  status: TestDriveStatus;
  checklistReady: boolean;
}

export interface ClientProfile {
  id: string;
  name: string;
  tier: string;
  email: string;
  phone: string;
  city: string;
  preferredContact: 'Phone' | 'Email' | 'WhatsApp';
  assignedConcierge: string;
  conciergeTitle: string;
  primaryInterests: string[];
  portfolioValuation: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  read: boolean;
  category: 'allocation' | 'concierge' | 'schedule' | 'security';
}

export type FinanceMode = 'loan' | 'lease';

export interface FinanceParams {
  mode: FinanceMode;
  vehiclePrice: number;
  downPayment: number;
  termMonths: number;
  aprPercent: number;
  residualPercent?: number;
}

export interface FinanceResult {
  monthlyPayment: number;
  financedAmount: number;
  totalInterestOrRent: number;
  totalOutlay: number;
  downPaymentPercent: number;
  residualValue: number;
}

export interface InventoryFilters {
  condition: 'All' | VehicleCondition;
  searchQuery: string;
  makes: string[];
  silhouette: 'All' | VehicleSilhouette;
  minPrice: number;
  maxPrice: number;
  year: 'All' | number;
  maxMileage: 'All' | number;
  powertrains: VehiclePowertrain[];
  exteriorShades: ExteriorShade[];
}

export type SortOption =
  | 'featured'
  | 'price-desc'
  | 'price-asc'
  | 'year-desc'
  | 'mileage-asc';

export interface AuthSession {
  signedIn: boolean;
  role: 'client' | 'admin';
  userName: string;
  email: string;
}
