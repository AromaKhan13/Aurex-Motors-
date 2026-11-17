import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SEED_CLIENT_PROFILE,
  SEED_INQUIRIES,
  SEED_MARQUES,
  SEED_NOTIFICATIONS,
  SEED_TEST_DRIVES,
  SEED_VEHICLES,
} from '../data/seedData';
import type {
  AdminSubTab,
  AuthSession,
  ClientProfile,
  Inquiry,
  InquiryStatus,
  InventoryFilters,
  Marque,
  NotificationItem,
  PortalSubTab,
  RouteId,
  TestDriveBooking,
  TestDriveStatus,
  Vehicle,
} from '../types/aurex';
import { DEFAULT_INVENTORY_FILTERS } from '../utils/inventoryFilter';

const STORAGE_KEY = 'aurex_motors_state_v1';

interface PersistedState {
  vehicles: Vehicle[];
  favorites: string[];
  savedVaultIds: string[];
  recentlyViewedIds: string[];
  comparisonIds: string[];
  inquiries: Inquiry[];
  testDriveBookings: TestDriveBooking[];
  clientProfile: ClientProfile;
  notifications: NotificationItem[];
  authSession: AuthSession;
}

export interface ToastMessage {
  id: string;
  title: string;
  detail?: string;
  variant?: 'gold' | 'success' | 'info';
}

interface AurexContextValue {
  route: RouteId;
  navigate: (route: RouteId, options?: { vehicleId?: string; filters?: Partial<InventoryFilters> }) => void;
  selectedVehicleId: string;
  selectedVehicle: Vehicle;
  vehicles: Vehicle[];
  marques: Marque[];
  favorites: string[];
  savedVaultIds: string[];
  recentlyViewedIds: string[];
  comparisonIds: string[];
  inquiries: Inquiry[];
  testDriveBookings: TestDriveBooking[];
  clientProfile: ClientProfile;
  notifications: NotificationItem[];
  authSession: AuthSession;
  portalTab: PortalSubTab;
  setPortalTab: (tab: PortalSubTab) => void;
  adminTab: AdminSubTab;
  setAdminTab: (tab: AdminSubTab) => void;
  editingVehicleId: string | null;
  setEditingVehicleId: (id: string | null) => void;
  inventoryFilters: InventoryFilters;
  setInventoryFilters: React.Dispatch<React.SetStateAction<InventoryFilters>>;
  resetInventoryFilters: () => void;
  toggleFavorite: (vehicleId: string) => void;
  toggleSavedVault: (vehicleId: string) => void;
  toggleCompare: (vehicleId: string) => void;
  clearCompare: () => void;
  financeModalVehicle: Vehicle | null;
  openFinanceModal: (vehicle?: Vehicle) => void;
  closeFinanceModal: () => void;
  compareModalOpen: boolean;
  setCompareModalOpen: (open: boolean) => void;
  searchOverlayOpen: boolean;
  setSearchOverlayOpen: (open: boolean) => void;
  submitInquiry: (input: Omit<Inquiry, 'id' | 'status' | 'assignedSpecialist' | 'createdAt'>) => Inquiry;
  updateInquiryStatus: (id: string, status: InquiryStatus, specialist?: string) => void;
  bookTestDrive: (input: {
    vehicle: Vehicle;
    clientName: string;
    date: string;
    timeWindow: string;
    location?: string;
  }) => TestDriveBooking;
  updateTestDriveStatus: (id: string, status: TestDriveStatus) => void;
  toggleTestDriveChecklist: (id: string) => void;
  upsertVehicle: (vehicle: Vehicle) => void;
  archiveVehicle: (id: string) => void;
  updateClientProfile: (updates: Partial<ClientProfile>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  signIn: (session: { role: 'client' | 'admin'; userName: string; email: string }) => void;
  signOut: () => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  pushToast: (title: string, detail?: string, variant?: ToastMessage['variant']) => void;
}

const DEFAULT_PERSISTED: PersistedState = {
  vehicles: SEED_VEHICLES,
  favorites: ['veh-gt3rs-weissach', 'veh-vanquish-v12', 'veh-mclaren-765lt'],
  savedVaultIds: ['veh-gt3rs-weissach', 'veh-ferrari-296gts', 'veh-amg-gt-black'],
  recentlyViewedIds: ['veh-gt3rs-weissach', 'veh-vanquish-v12', 'veh-ferrari-296gts', 'veh-gt3-touring-cpo'],
  comparisonIds: ['veh-gt3rs-weissach', 'veh-ferrari-296gtb'],
  inquiries: SEED_INQUIRIES,
  testDriveBookings: SEED_TEST_DRIVES,
  clientProfile: SEED_CLIENT_PROFILE,
  notifications: SEED_NOTIFICATIONS,
  authSession: {
    signedIn: false,
    role: 'client',
    userName: 'Jonathan Vance',
    email: 'j.vance@vancemanagement.com',
  },
};

function loadInitialState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PERSISTED;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      vehicles: Array.isArray(parsed.vehicles) && parsed.vehicles.length > 0 ? parsed.vehicles : SEED_VEHICLES,
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : DEFAULT_PERSISTED.favorites,
      savedVaultIds: Array.isArray(parsed.savedVaultIds) ? parsed.savedVaultIds : DEFAULT_PERSISTED.savedVaultIds,
      recentlyViewedIds: Array.isArray(parsed.recentlyViewedIds)
        ? parsed.recentlyViewedIds
        : DEFAULT_PERSISTED.recentlyViewedIds,
      comparisonIds: Array.isArray(parsed.comparisonIds) ? parsed.comparisonIds : DEFAULT_PERSISTED.comparisonIds,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : SEED_INQUIRIES,
      testDriveBookings: Array.isArray(parsed.testDriveBookings) ? parsed.testDriveBookings : SEED_TEST_DRIVES,
      clientProfile: parsed.clientProfile ?? SEED_CLIENT_PROFILE,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : SEED_NOTIFICATIONS,
      authSession: parsed.authSession ?? DEFAULT_PERSISTED.authSession,
    };
  } catch {
    return DEFAULT_PERSISTED;
  }
}

const AurexContext = createContext<AurexContextValue | null>(null);

export const AurexProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [route, setRoute] = useState<RouteId>('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(SEED_VEHICLES[0].id);
  const [portalTab, setPortalTab] = useState<PortalSubTab>('overview');
  const [adminTab, setAdminTab] = useState<AdminSubTab>('dashboard');
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [inventoryFilters, setInventoryFilters] = useState<InventoryFilters>(DEFAULT_INVENTORY_FILTERS);
  const [financeModalVehicle, setFinanceModalVehicle] = useState<Vehicle | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const pushToast = (title: string, detail?: string, variant: ToastMessage['variant'] = 'gold') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-1), { id, title, detail, variant }]);
    window.setTimeout(() => {
      dismissToast(id);
    }, 2400);
  };

  const selectedVehicle =
    state.vehicles.find((v) => v.id === selectedVehicleId) ?? state.vehicles[0] ?? SEED_VEHICLES[0];

  const marques: Marque[] = SEED_MARQUES.map((m) => ({
    ...m,
    availableCount: state.vehicles.filter((v) => v.syndicatePublic && v.make === m.name).length,
  }));

  const navigate = (
    nextRoute: RouteId,
    options?: { vehicleId?: string; filters?: Partial<InventoryFilters> }
  ) => {
    if (options?.filters) {
      setInventoryFilters({
        ...DEFAULT_INVENTORY_FILTERS,
        ...options.filters,
      });
    }
    if (options?.vehicleId) {
      setSelectedVehicleId(options.vehicleId);
      setState((prev) => ({
        ...prev,
        recentlyViewedIds: [
          options.vehicleId!,
          ...prev.recentlyViewedIds.filter((id) => id !== options.vehicleId),
        ].slice(0, 8),
      }));
    }
    setRoute(nextRoute);
    setSearchOverlayOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetInventoryFilters = () => {
    setInventoryFilters(DEFAULT_INVENTORY_FILTERS);
  };

  const toggleFavorite = (vehicleId: string) => {
    const target = state.vehicles.find((v) => v.id === vehicleId);
    const exists = state.favorites.includes(vehicleId);
    setState((prev) => ({
      ...prev,
      favorites: exists
        ? prev.favorites.filter((id) => id !== vehicleId)
        : [vehicleId, ...prev.favorites],
    }));
    pushToast(
      exists ? 'Removed from Favorites' : 'Saved to Favorites',
      target ? target.title : undefined
    );
  };

  const toggleSavedVault = (vehicleId: string) => {
    const target = state.vehicles.find((v) => v.id === vehicleId);
    const exists = state.savedVaultIds.includes(vehicleId);
    setState((prev) => ({
      ...prev,
      savedVaultIds: exists
        ? prev.savedVaultIds.filter((id) => id !== vehicleId)
        : [vehicleId, ...prev.savedVaultIds],
    }));
    pushToast(
      exists ? 'Removed from Saved Vault' : 'Saved to Client Vault',
      target ? target.title : undefined
    );
  };

  const toggleCompare = (vehicleId: string) => {
    const exists = state.comparisonIds.includes(vehicleId);
    if (!exists && state.comparisonIds.length >= 3) {
      pushToast('Comparison Limit Reached', 'Compare up to 3 vehicles side by side.', 'info');
      return;
    }
    setState((prev) => ({
      ...prev,
      comparisonIds: exists
        ? prev.comparisonIds.filter((id) => id !== vehicleId)
        : [...prev.comparisonIds, vehicleId],
    }));
  };

  const clearCompare = () => {
    setState((prev) => ({ ...prev, comparisonIds: [] }));
  };

  const openFinanceModal = (vehicle?: Vehicle) => {
    setFinanceModalVehicle(vehicle ?? selectedVehicle);
  };

  const closeFinanceModal = () => {
    setFinanceModalVehicle(null);
  };

  const submitInquiry: AurexContextValue['submitInquiry'] = (input) => {
    const created: Inquiry = {
      ...input,
      id: `INQ-${Math.floor(9050 + Math.random() * 900)}`,
      status: 'In-Review',
      assignedSpecialist: 'Marcus Sterling',
      createdAt: 'Just now',
    };
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `${input.inquiryType} Registered`,
      detail: `Concierge dossier ${created.id} opened for ${input.vehicleTitle}.`,
      timestamp: 'Just now',
      read: false,
      category: 'concierge',
    };
    setState((prev) => ({
      ...prev,
      inquiries: [created, ...prev.inquiries],
      notifications: [notif, ...prev.notifications],
    }));
    pushToast('Concierge Request Confirmed', `${created.id} • ${input.vehicleTitle}`, 'success');
    return created;
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus, specialist?: string) => {
    setState((prev) => ({
      ...prev,
      inquiries: prev.inquiries.map((inq) =>
        inq.id === id
          ? {
              ...inq,
              status,
              assignedSpecialist: specialist ?? inq.assignedSpecialist,
            }
          : inq
      ),
    }));
    pushToast('Inquiry Status Updated', `${id} marked ${status}`);
  };

  const bookTestDrive: AurexContextValue['bookTestDrive'] = ({
    vehicle,
    clientName,
    date,
    timeWindow,
    location,
  }) => {
    const booking: TestDriveBooking = {
      id: `TD-${Math.floor(4100 + Math.random() * 800)}`,
      vehicleId: vehicle.id,
      vehicleTitle: vehicle.title,
      vehicleImage: vehicle.image,
      clientName,
      date,
      timeWindow,
      location: location || 'Beverly Hills Main Salon — Private Vault Bay 1',
      specialist: 'Marcus Sterling',
      status: 'Scheduled',
      checklistReady: true,
    };
    setState((prev) => ({
      ...prev,
      testDriveBookings: [booking, ...prev.testDriveBookings],
    }));
    pushToast('Private Viewing Scheduled', `${vehicle.title} • ${date}`, 'success');
    return booking;
  };

  const updateTestDriveStatus = (id: string, status: TestDriveStatus) => {
    setState((prev) => ({
      ...prev,
      testDriveBookings: prev.testDriveBookings.map((b) => (b.id === id ? { ...b, status } : b)),
    }));
  };

  const toggleTestDriveChecklist = (id: string) => {
    setState((prev) => ({
      ...prev,
      testDriveBookings: prev.testDriveBookings.map((b) =>
        b.id === id ? { ...b, checklistReady: !b.checklistReady } : b
      ),
    }));
  };

  const upsertVehicle = (vehicle: Vehicle) => {
    setState((prev) => {
      const exists = prev.vehicles.some((v) => v.id === vehicle.id);
      return {
        ...prev,
        vehicles: exists
          ? prev.vehicles.map((v) => (v.id === vehicle.id ? vehicle : v))
          : [vehicle, ...prev.vehicles],
      };
    });
    pushToast('Showroom Inventory Updated', `${vehicle.title} saved`, 'success');
  };

  const archiveVehicle = (id: string) => {
    setState((prev) => ({
      ...prev,
      vehicles: prev.vehicles.map((v) => (v.id === id ? { ...v, syndicatePublic: !v.syndicatePublic } : v)),
    }));
    pushToast('Vehicle Syndication Updated');
  };

  const updateClientProfile = (updates: Partial<ClientProfile>) => {
    setState((prev) => ({
      ...prev,
      clientProfile: { ...prev.clientProfile, ...updates },
    }));
    pushToast('Client Profile Updated', 'Protocol preferences synchronized.', 'success');
  };

  const markNotificationRead = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  };

  const markAllNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const signIn = (session: { role: 'client' | 'admin'; userName: string; email: string }) => {
    setState((prev) => ({
      ...prev,
      authSession: {
        signedIn: true,
        role: session.role,
        userName: session.userName,
        email: session.email,
      },
      clientProfile:
        session.role === 'client'
          ? { ...prev.clientProfile, name: session.userName, email: session.email }
          : prev.clientProfile,
    }));
    if (session.role === 'admin') {
      setAdminTab('dashboard');
      navigate('admin-portal');
      pushToast('Executive Admin Session Active', `Welcome back, ${session.userName}`);
    } else {
      setPortalTab('overview');
      navigate('customer-portal');
      pushToast('Private Client Portal Unlocked', `Welcome, ${session.userName}`);
    }
  };

  const signOut = () => {
    setState((prev) => ({
      ...prev,
      authSession: { ...prev.authSession, signedIn: false },
    }));
    navigate('home');
    pushToast('Session Signed Out');
  };

  return (
    <AurexContext.Provider
      value={{
        route,
        navigate,
        selectedVehicleId,
        selectedVehicle,
        vehicles: state.vehicles,
        marques,
        favorites: state.favorites,
        savedVaultIds: state.savedVaultIds,
        recentlyViewedIds: state.recentlyViewedIds,
        comparisonIds: state.comparisonIds,
        inquiries: state.inquiries,
        testDriveBookings: state.testDriveBookings,
        clientProfile: state.clientProfile,
        notifications: state.notifications,
        authSession: state.authSession,
        portalTab,
        setPortalTab,
        adminTab,
        setAdminTab,
        editingVehicleId,
        setEditingVehicleId,
        inventoryFilters,
        setInventoryFilters,
        resetInventoryFilters,
        toggleFavorite,
        toggleSavedVault,
        toggleCompare,
        clearCompare,
        financeModalVehicle,
        openFinanceModal,
        closeFinanceModal,
        compareModalOpen,
        setCompareModalOpen,
        searchOverlayOpen,
        setSearchOverlayOpen,
        submitInquiry,
        updateInquiryStatus,
        bookTestDrive,
        updateTestDriveStatus,
        toggleTestDriveChecklist,
        upsertVehicle,
        archiveVehicle,
        updateClientProfile,
        markNotificationRead,
        markAllNotificationsRead,
        signIn,
        signOut,
        toasts,
        dismissToast,
        pushToast,
      }}
    >
      {children}
    </AurexContext.Provider>
  );
};

export function useAurex(): AurexContextValue {
  const ctx = useContext(AurexContext);
  if (!ctx) {
    throw new Error('useAurex must be used inside AurexProvider');
  }
  return ctx;
}
