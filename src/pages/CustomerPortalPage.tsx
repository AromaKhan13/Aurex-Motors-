import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  Bell,
  Bookmark,
  Calendar,
  CarFront,
  CheckCircle2,
  Clock,
  FileText,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import { AUREX_ASSETS, SEED_LEADERSHIP } from '../data/seedData';
import type { PortalSubTab } from '../types/aurex';
import { formatCurrency } from '../utils/finance';
import { AurexImage } from '../components/AurexImage';
import { VehicleCard } from '../components/VehicleCard';

const PORTAL_TABS: { id: PortalSubTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'favorites', label: 'My Favorites', icon: Bookmark },
  { id: 'saved', label: 'Saved Vault', icon: ShieldCheck },
  { id: 'inquiries', label: 'My Inquiries', icon: FileText },
  { id: 'test-drives', label: 'Test Drives', icon: Calendar },
  { id: 'recent', label: 'Recently Viewed', icon: Clock },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export const CustomerPortalPage: React.FC = () => {
  const {
    portalTab,
    setPortalTab,
    navigate,
    clientProfile,
    updateClientProfile,
    vehicles,
    favorites,
    savedVaultIds,
    recentlyViewedIds,
    inquiries,
    testDriveBookings,
    toggleTestDriveChecklist,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    comparisonIds,
    setCompareModalOpen,
    signOut,
  } = useAurex();

  const [profileName, setProfileName] = useState(clientProfile.name);
  const [profilePhone, setProfilePhone] = useState(clientProfile.phone);
  const [profileCity, setProfileCity] = useState(clientProfile.city);
  const [profileContact, setProfileContact] = useState(clientProfile.preferredContact);

  const concierge = SEED_LEADERSHIP[2]; // Marcus Sterling
  const favoriteVehicles = vehicles.filter((v) => favorites.includes(v.id));
  const savedVehicles = vehicles.filter((v) => savedVaultIds.includes(v.id));
  const recentVehicles = recentlyViewedIds
    .map((id) => vehicles.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateClientProfile({
      name: profileName.trim() || clientProfile.name,
      phone: profilePhone.trim() || clientProfile.phone,
      city: profileCity.trim() || clientProfile.city,
      preferredContact: profileContact,
    });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col justify-between bg-surface-container-lowest border-r border-outline-variant/40 p-5 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/40">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-primary/50 bg-[#0c0c0e] p-0.5 flex items-center justify-center shrink-0">
              <AurexImage src={AUREX_ASSETS.logo} alt="Aurex Motors" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <div className="font-serif text-base font-semibold text-on-surface">AUREX PORTAL</div>
              <div className="text-[10px] font-mono text-primary">{clientProfile.id}</div>
            </div>
          </div>

          <nav className="space-y-1" aria-label="Client Portal Navigation">
            {PORTAL_TABS.map((item) => {
              const Icon = item.icon;
              const active = portalTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPortalTab(item.id)}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    active
                      ? 'bg-primary text-on-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </span>
                  {item.id === 'notifications' && unreadNotifs > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                        active ? 'bg-on-primary text-primary' : 'bg-primary text-on-primary'
                      }`}
                    >
                      {unreadNotifs}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-outline-variant/40">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container border border-outline-variant/50 text-xs text-on-surface hover:border-primary hover:text-primary transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Showroom</span>
          </button>
          <button
            type="button"
            onClick={signOut}
            className="w-full px-3.5 py-2 rounded-lg text-xs text-outline hover:text-error flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 pb-24 lg:pb-12">
        {/* Top Portal Bar */}
        <header className="sticky top-0 z-30 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant/40 px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="lg:hidden p-2 rounded-lg bg-surface-container border border-outline-variant/50 text-primary"
              aria-label="Back to Showroom"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-outline">
                Private Client Portal
              </div>
              <div className="font-serif text-base font-semibold text-on-surface">
                {PORTAL_TABS.find((t) => t.id === portalTab)?.label}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {comparisonIds.length > 0 && (
              <button
                type="button"
                onClick={() => setCompareModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-surface-container border border-primary/40 text-xs text-primary inline-flex items-center gap-1.5"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Compare ({comparisonIds.length})</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('inventory')}
              className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider"
            >
              Browse Showroom
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
          {portalTab === 'overview' && (
            <>
              {/* Welcome Banner & Concierge Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-surface-container border border-primary/40 flex flex-col justify-between gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/15 border border-primary/40 text-[10px] uppercase tracking-[0.16em] text-primary font-semibold">
                      <Sparkles className="w-3 h-3" />
                      {clientProfile.tier}
                    </span>
                    <span className="font-mono text-xs text-outline">{clientProfile.id}</span>
                  </div>
                  <div>
                    <h1 className="font-serif text-3xl font-semibold text-on-surface">
                      Welcome back, {clientProfile.name}
                    </h1>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Your Beverly Hills &amp; Thermal Club dossiers, saved chassis, and private
                      test-drive briefings are synchronized below.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/50 flex flex-col justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AurexImage
                      src={concierge.image}
                      alt={concierge.name}
                      className="w-12 h-12 rounded-full object-cover border border-primary/50 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.14em] text-primary">
                        Assigned Marque Concierge
                      </div>
                      <div className="font-serif text-base font-semibold text-on-surface truncate">
                        {concierge.name}
                      </div>
                      <div className="text-[11px] text-outline truncate">{concierge.role}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('contact')}
                    className="w-full py-2 rounded-lg bg-surface-container border border-primary/40 text-xs font-medium text-primary hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    Message Concierge Desk
                  </button>
                </div>
              </div>

              {/* 4 KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Favorited Chassis', val: `${favorites.length} Chassis`, sub: 'Live Vault Sync', tab: 'favorites' as PortalSubTab },
                  { label: 'Active Inquiries', val: `${inquiries.length} Dossiers`, sub: 'Concierge Tracked', tab: 'inquiries' as PortalSubTab },
                  { label: 'Scheduled Drives', val: `${testDriveBookings.length} Sessions`, sub: testDriveBookings[0]?.date ?? 'Upcoming', tab: 'test-drives' as PortalSubTab },
                  { label: 'Portfolio Valuation', val: formatCurrency(clientProfile.portfolioValuation), sub: 'Tracked Collection', tab: 'profile' as PortalSubTab },
                ].map((kpi) => (
                  <button
                    key={kpi.label}
                    type="button"
                    onClick={() => setPortalTab(kpi.tab)}
                    className="text-left p-5 rounded-xl bg-surface-container border border-outline-variant/40 hover:border-primary/50 transition-colors"
                  >
                    <div className="text-[10px] uppercase tracking-[0.16em] text-outline">{kpi.label}</div>
                    <div className="font-serif text-2xl font-semibold text-primary mt-1 tabular-nums">
                      {kpi.val}
                    </div>
                    <div className="text-[11px] text-on-surface-variant mt-1">{kpi.sub}</div>
                  </button>
                ))}
              </div>

              {/* Formal Inquiries & Allocations Table */}
              <section className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
                <div className="px-5 py-4 border-b border-outline-variant/40 flex items-center justify-between">
                  <h2 className="font-serif text-lg font-semibold text-on-surface">
                    Formal Inquiries &amp; Allocations
                  </h2>
                  <button
                    type="button"
                    onClick={() => setPortalTab('inquiries')}
                    className="text-xs text-primary hover:underline"
                  >
                    View All ({inquiries.length})
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container-low text-outline uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Dossier</th>
                        <th className="py-3 px-4">Vehicle</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Specialist</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30">
                      {inquiries.slice(0, 4).map((inq) => (
                        <tr key={inq.id} className="hover:bg-surface-container-high/40">
                          <td className="py-3 px-4 font-mono text-primary">{inq.id}</td>
                          <td className="py-3 px-4 font-medium text-on-surface">{inq.vehicleTitle}</td>
                          <td className="py-3 px-4 text-on-surface-variant">{inq.inquiryType}</td>
                          <td className="py-3 px-4 text-on-surface-variant">{inq.assignedSpecialist}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded bg-primary/15 border border-primary/40 text-primary text-[10px] font-semibold uppercase tracking-wider">
                              {inq.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Private Salon Test Drive Experience Card */}
              {testDriveBookings[0] && (
                <section className="rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/40 grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-5 aspect-[16/10] md:aspect-auto bg-surface-container-lowest">
                    <AurexImage
                      src={AUREX_ASSETS.trackPavilion}
                      alt="Aurex Private Track & Salon Experience"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-7 p-6 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold">
                        Upcoming Private Salon Briefing
                      </span>
                      <h3 className="font-serif text-2xl font-semibold text-on-surface">
                        {testDriveBookings[0].vehicleTitle}
                      </h3>
                      <p className="text-xs text-on-surface-variant">
                        {testDriveBookings[0].date} • {testDriveBookings[0].timeWindow} •{' '}
                        {testDriveBookings[0].location}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/30">
                      <label className="inline-flex items-center gap-2 text-xs text-on-surface cursor-pointer">
                        <input
                          type="checkbox"
                          checked={testDriveBookings[0].checklistReady}
                          onChange={() => toggleTestDriveChecklist(testDriveBookings[0].id)}
                          className="accent-[#f2ca7d]"
                        />
                        <span>Pre-arrival Driver License &amp; Insurance Packet Verified</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setPortalTab('test-drives')}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Manage Bookings →
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Saved Vault Preview */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-semibold text-on-surface">
                    Saved Vault Favorites
                  </h2>
                  <button
                    type="button"
                    onClick={() => setPortalTab('favorites')}
                    className="text-xs text-primary hover:underline"
                  >
                    Manage All Favorites →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {favoriteVehicles.slice(0, 3).map((v) => (
                    <VehicleCard key={v.id} vehicle={v} />
                  ))}
                </div>
              </section>
            </>
          )}

          {(portalTab === 'favorites' || portalTab === 'saved') && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-serif text-3xl font-semibold text-on-surface">
                  {portalTab === 'favorites' ? 'My Favorited Chassis' : 'Saved Vault Collection'}
                </h1>
                <span className="font-mono text-xs text-primary">
                  {(portalTab === 'favorites' ? favoriteVehicles : savedVehicles).length} Vehicles
                </span>
              </div>

              {(portalTab === 'favorites' ? favoriteVehicles : savedVehicles).length === 0 ? (
                <div className="p-12 rounded-xl bg-surface-container border border-outline-variant/40 text-center space-y-3">
                  <CarFront className="w-8 h-8 text-primary/50 mx-auto" />
                  <p className="text-sm text-on-surface-variant">
                    No vehicles saved yet. Bookmark any chassis in the Master Inventory.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('inventory')}
                    className="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider"
                  >
                    Explore Inventory
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(portalTab === 'favorites' ? favoriteVehicles : savedVehicles).map((v) => (
                    <VehicleCard key={v.id} vehicle={v} />
                  ))}
                </div>
              )}
            </section>
          )}

          {portalTab === 'inquiries' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-serif text-3xl font-semibold text-on-surface">
                  My Inquiries &amp; Commissioning Dossiers
                </h1>
                <button
                  type="button"
                  onClick={() => navigate('contact')}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider"
                >
                  New Inquiry
                </button>
              </div>
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-xl bg-surface-container border border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-primary font-semibold">{inq.id}</span>
                        <span className="text-outline">•</span>
                        <span className="text-outline">{inq.createdAt}</span>
                      </div>
                      <div className="font-serif text-lg font-semibold text-on-surface">
                        {inq.vehicleTitle}
                      </div>
                      <p className="text-xs text-on-surface-variant">{inq.notes}</p>
                    </div>
                    <div className="sm:text-right space-y-1 shrink-0">
                      <span className="inline-block px-3 py-1 rounded bg-primary/15 border border-primary/40 text-primary text-[11px] font-semibold uppercase tracking-wider">
                        {inq.status}
                      </span>
                      <div className="text-[11px] text-outline">
                        Specialist: {inq.assignedSpecialist}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {portalTab === 'test-drives' && (
            <section className="space-y-6">
              <h1 className="font-serif text-3xl font-semibold text-on-surface">
                Private Salon &amp; Track Test Drives
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {testDriveBookings.map((td) => (
                  <div
                    key={td.id}
                    className="rounded-xl overflow-hidden bg-surface-container border border-outline-variant/40"
                  >
                    <div className="aspect-[16/9] bg-surface-container-lowest">
                      <AurexImage src={td.vehicleImage} alt={td.vehicleTitle} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-primary">{td.id}</span>
                        <span className="px-2.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/40">
                          {td.status}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-on-surface">
                        {td.vehicleTitle}
                      </h3>
                      <p className="text-xs text-on-surface-variant">
                        {td.date} • {td.timeWindow}
                      </p>
                      <p className="text-xs text-outline">{td.location}</p>
                      <label className="pt-2 border-t border-outline-variant/30 flex items-center gap-2 text-xs text-on-surface cursor-pointer">
                        <input
                          type="checkbox"
                          checked={td.checklistReady}
                          onChange={() => toggleTestDriveChecklist(td.id)}
                          className="accent-[#f2ca7d]"
                        />
                        <span>Pre-Arrival Insurance &amp; License Checklist Ready</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {portalTab === 'recent' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-serif text-3xl font-semibold text-on-surface">
                  Recently Viewed Chassis
                </h1>
                {comparisonIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCompareModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Compare Selected ({comparisonIds.length})</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentVehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            </section>
          )}

          {portalTab === 'profile' && (
            <section className="max-w-2xl space-y-6">
              <h1 className="font-serif text-3xl font-semibold text-on-surface">
                Client Profile &amp; Protocol Preferences
              </h1>
              <form
                onSubmit={handleSaveProfile}
                className="p-6 rounded-2xl bg-surface-container border border-outline-variant/40 space-y-4"
              >
                <div>
                  <label htmlFor="prof-name" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                    Client Name
                  </label>
                  <input
                    id="prof-name"
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-sm text-on-surface"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prof-phone" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                      Direct Phone
                    </label>
                    <input
                      id="prof-phone"
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-sm text-on-surface"
                    />
                  </div>
                  <div>
                    <label htmlFor="prof-city" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                      Primary Residence / Delivery Hub
                    </label>
                    <input
                      id="prof-city"
                      type="text"
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-sm text-on-surface"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="prof-contact" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                    Preferred Concierge Channel
                  </label>
                  <select
                    id="prof-contact"
                    value={profileContact}
                    onChange={(e) => setProfileContact(e.target.value as 'Phone' | 'Email' | 'WhatsApp')}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-sm text-on-surface"
                  >
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em]"
                >
                  Save Protocol Preferences
                </button>
              </form>
            </section>
          )}

          {portalTab === 'notifications' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-serif text-3xl font-semibold text-on-surface">
                  Vault Alerts &amp; Dispatches
                </h1>
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-xs text-primary hover:underline"
                >
                  Mark All Read
                </button>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-5 rounded-xl border flex items-start justify-between gap-4 ${
                      n.read
                        ? 'bg-surface-container border-outline-variant/40'
                        : 'bg-surface-container-high border-primary/50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                        <h3 className="font-serif text-base font-semibold text-on-surface">{n.title}</h3>
                      </div>
                      <p className="text-xs text-on-surface-variant">{n.detail}</p>
                      <span className="text-[11px] font-mono text-outline block">{n.timestamp}</span>
                    </div>
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => markNotificationRead(n.id)}
                        className="px-3 py-1 rounded bg-primary/15 text-primary text-xs shrink-0 inline-flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Read</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav
        aria-label="Mobile Client Portal Tabs"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/40 flex items-center justify-around px-1 py-2"
      >
        {PORTAL_TABS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = portalTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPortalTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 text-[10px] ${
                active ? 'text-primary font-semibold' : 'text-outline'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[60px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
