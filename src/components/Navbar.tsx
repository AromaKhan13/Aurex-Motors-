import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Bookmark,
  LogOut,
  Menu,
  Search,
  Shield,
  User,
  X,
} from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import { AUREX_ASSETS } from '../data/seedData';
import type { RouteId } from '../types/aurex';
import { formatCurrency } from '../utils/finance';
import { AurexImage } from './AurexImage';

const PUBLIC_NAV_ITEMS: { id: RouteId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'new-cars', label: 'New Cars' },
  { id: 'used-cars', label: 'Used Cars' },
  { id: 'brands', label: 'Brands' },
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC = () => {
  const {
    route,
    navigate,
    authSession,
    signOut,
    favorites,
    comparisonIds,
    setCompareModalOpen,
    searchOverlayOpen,
    setSearchOverlayOpen,
    vehicles,
  } = useAurex();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const quickResults = quickQuery.trim()
    ? vehicles
        .filter((v) =>
          `${v.title} ${v.make} ${v.stockCode} ${v.exteriorColor}`
            .toLowerCase()
            .includes(quickQuery.trim().toLowerCase())
        )
        .slice(0, 5)
    : vehicles.filter((v) => v.featured).slice(0, 4);

  const handlePortalAction = () => {
    if (!authSession.signedIn) {
      navigate('auth');
    } else if (authSession.role === 'admin') {
      navigate('admin-portal');
    } else {
      navigate('customer-portal');
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left: Brand Lockup */}
          <button
            type="button"
            onClick={() => navigate('home')}
            className="flex items-center gap-3 text-left group shrink-0"
            aria-label="Aurex Motors Home"
          >
            <div className="w-11 h-11 rounded-lg overflow-hidden border border-primary/40 bg-[#0c0c0e] p-1 flex items-center justify-center shrink-0">
              <AurexImage
                src={AUREX_ASSETS.logo}
                alt="Aurex Motors Crest"
                eager
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-semibold tracking-wide text-on-surface group-hover:text-primary transition-colors block leading-none">
                AUREX MOTORS
              </span>
              <span className="text-[10px] uppercase tracking-[0.26em] text-primary/80 block mt-1">
                Atelier &amp; Showroom
              </span>
            </div>
          </button>

          {/* Center: Desktop Primary Links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Primary Showroom Navigation">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const active = route === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={`text-xs uppercase tracking-[0.14em] font-medium py-2 border-b-2 transition-colors whitespace-nowrap ${
                    active
                      ? 'text-primary border-primary'
                      : 'text-on-surface-variant border-transparent hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Utilities & Portal CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOverlayOpen(true)}
              aria-label="Search Aurex Inventory"
              className="p-2.5 rounded-lg bg-surface-container border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {comparisonIds.length > 0 && (
              <button
                type="button"
                onClick={() => setCompareModalOpen(true)}
                aria-label={`Compare ${comparisonIds.length} vehicles`}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container border border-primary/40 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Compare ({comparisonIds.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (authSession.signedIn) {
                  navigate('customer-portal');
                } else {
                  navigate('auth');
                }
              }}
              aria-label={`Saved favorites (${favorites.length})`}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-surface-container border border-outline-variant/50 text-xs text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono tabular-nums">{favorites.length}</span>
            </button>

            <button
              type="button"
              onClick={handlePortalAction}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em] hover:bg-primary-fixed transition-colors whitespace-nowrap"
            >
              {authSession.signedIn ? (
                <>
                  {authSession.role === 'admin' ? (
                    <Shield className="w-3.5 h-3.5" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                  <span>{authSession.role === 'admin' ? 'Admin Console' : 'Client Portal'}</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In / Portal</span>
                </>
              )}
            </button>

            {authSession.signedIn && (
              <button
                type="button"
                onClick={signOut}
                aria-label="Sign out"
                title="Sign out"
                className="hidden md:inline-flex p-2.5 rounded-lg bg-surface-container border border-outline-variant/50 text-on-surface-variant hover:text-error hover:border-error/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2.5 rounded-lg bg-surface-container border border-outline-variant/50 text-on-surface hover:text-primary"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-outline-variant/40 bg-surface-container-low px-4 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    navigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-lg text-left text-xs uppercase tracking-[0.14em] font-medium border ${
                    route === item.id
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container border-outline-variant/40 text-on-surface'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handlePortalAction}
                className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em] text-center"
              >
                {authSession.signedIn
                  ? authSession.role === 'admin'
                    ? 'Open Admin Console'
                    : 'Open Client Portal'
                  : 'Sign In / Portal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('admin-portal');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/50 text-xs font-medium text-on-surface"
              >
                Admin Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Quick Global Inventory Search Modal */}
      {searchOverlayOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Search Aurex Showroom"
        >
          <div className="w-full max-w-2xl bg-surface-container border border-outline-variant/60 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-outline-variant/40 flex items-center gap-3">
              <Search className="w-5 h-5 text-primary shrink-0" />
              <input
                type="text"
                autoFocus
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate('inventory', { filters: { searchQuery: quickQuery } });
                  }
                }}
                placeholder="Search by marque, model, trim, or stock code (e.g. GT3 RS, Vanquish)..."
                className="flex-1 bg-transparent text-on-surface placeholder:text-outline text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOverlayOpen(false)}
                aria-label="Close search"
                className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-outline px-2 pb-1">
                <span>{quickQuery.trim() ? 'Matching Chassis' : 'Featured Showroom Highlights'}</span>
                <button
                  type="button"
                  onClick={() => navigate('inventory', { filters: { searchQuery: quickQuery } })}
                  className="text-primary hover:underline"
                >
                  View All in Master Inventory →
                </button>
              </div>

              {quickResults.length === 0 ? (
                <div className="py-8 text-center text-sm text-on-surface-variant">
                  No chassis match “{quickQuery}”. Try searching Porsche, Ferrari, Aston Martin, or McLaren.
                </div>
              ) : (
                quickResults.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => navigate('vehicle-detail', { vehicleId: v.id })}
                    className="w-full flex items-center gap-4 p-2.5 rounded-lg hover:bg-surface-container-high transition-colors text-left"
                  >
                    <AurexImage
                      src={v.image}
                      alt={v.title}
                      className="w-20 h-14 rounded object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-outline">{v.stockCode} • {v.condition}</div>
                      <div className="font-serif text-base text-on-surface truncate">{v.title}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-serif text-sm font-semibold text-primary tabular-nums">
                        {formatCurrency(v.price)}
                      </div>
                      <div className="text-[11px] text-outline font-mono">{v.mileage.toLocaleString()} mi</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
