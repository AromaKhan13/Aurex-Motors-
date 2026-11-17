import React, { useMemo, useState } from 'react';
import {
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import type {
  ExteriorShade,
  SortOption,
  VehicleCondition,
  VehiclePowertrain,
  VehicleSilhouette,
} from '../types/aurex';
import { formatCurrency } from '../utils/finance';
import {
  DEFAULT_INVENTORY_FILTERS,
  filterVehicles,
  getActiveFilterChips,
  sortVehicles,
} from '../utils/inventoryFilter';
import { VehicleCard } from '../components/VehicleCard';

const SHADE_SWATCHES: { shade: ExteriorShade; hex: string }[] = [
  { shade: 'Obsidian Black', hex: '#141416' },
  { shade: 'Chalk Gray', hex: '#9ca3af' },
  { shade: 'Champagne Silver', hex: '#d4af65' },
  { shade: 'Rosso Corsa', hex: '#b91c1c' },
  { shade: 'British Racing Green', hex: '#14532d' },
  { shade: 'Sapphire Blue', hex: '#1d4ed8' },
  { shade: 'Pearl White', hex: '#f3f4f6' },
  { shade: 'Magmabeam Orange', hex: '#ea580c' },
];

const POWERTRAINS: VehiclePowertrain[] = [
  'Internal Combustion',
  'Plug-In Hybrid',
  'Hybrid',
  'Electric',
];

const PAGE_SIZE = 9;

export const InventoryPage: React.FC = () => {
  const {
    vehicles,
    inventoryFilters,
    setInventoryFilters,
    resetInventoryFilters,
    navigate,
  } = useAurex();

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const allMakes = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.make))).sort(),
    [vehicles]
  );

  const filtered = useMemo(() => {
    const matched = filterVehicles(vehicles, inventoryFilters);
    return sortVehicles(matched, sortBy);
  }, [vehicles, inventoryFilters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const activeChips = getActiveFilterChips(inventoryFilters);

  const toggleMake = (make: string) => {
    setPage(1);
    setInventoryFilters((prev) => ({
      ...prev,
      makes: prev.makes.includes(make)
        ? prev.makes.filter((m) => m !== make)
        : [...prev.makes, make],
    }));
  };

  const togglePowertrain = (pt: VehiclePowertrain) => {
    setPage(1);
    setInventoryFilters((prev) => ({
      ...prev,
      powertrains: prev.powertrains.includes(pt)
        ? prev.powertrains.filter((p) => p !== pt)
        : [...prev.powertrains, pt],
    }));
  };

  const toggleShade = (shade: ExteriorShade) => {
    setPage(1);
    setInventoryFilters((prev) => ({
      ...prev,
      exteriorShades: prev.exteriorShades.includes(shade)
        ? prev.exteriorShades.filter((s) => s !== shade)
        : [...prev.exteriorShades, shade],
    }));
  };

  const removeChip = (key: string, value?: string) => {
    setPage(1);
    setInventoryFilters((prev) => {
      switch (key) {
        case 'condition':
          return { ...prev, condition: 'All' };
        case 'searchQuery':
          return { ...prev, searchQuery: '' };
        case 'make':
          return { ...prev, makes: prev.makes.filter((m) => m !== value) };
        case 'silhouette':
          return { ...prev, silhouette: 'All' };
        case 'price':
          return {
            ...prev,
            minPrice: DEFAULT_INVENTORY_FILTERS.minPrice,
            maxPrice: DEFAULT_INVENTORY_FILTERS.maxPrice,
          };
        case 'year':
          return { ...prev, year: 'All' };
        case 'maxMileage':
          return { ...prev, maxMileage: 'All' };
        case 'powertrain':
          return {
            ...prev,
            powertrains: prev.powertrains.filter((p) => p !== value),
          };
        case 'exteriorShade':
          return {
            ...prev,
            exteriorShades: prev.exteriorShades.filter((s) => s !== value),
          };
        default:
          return prev;
      }
    });
  };

  const filterSidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
        <span className="text-xs uppercase tracking-[0.18em] font-semibold text-primary">
          Refine Atelier
        </span>
        <button
          type="button"
          onClick={() => {
            resetInventoryFilters();
            setPage(1);
          }}
          className="text-[11px] text-on-surface-variant hover:text-primary inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <span className="block text-[11px] uppercase tracking-[0.14em] text-outline font-medium">
          Condition
        </span>
        <div className="grid grid-cols-1 gap-1.5">
          {(['All', 'Brand New', 'Certified Pre-Owned'] as const).map((cond) => (
            <button
              key={cond}
              type="button"
              onClick={() => {
                setPage(1);
                setInventoryFilters((prev) => ({
                  ...prev,
                  condition: cond as 'All' | VehicleCondition,
                }));
              }}
              className={`px-3 py-2 rounded-lg text-left text-xs font-medium border transition-colors ${
                inventoryFilters.condition === cond
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:border-primary/40'
              }`}
            >
              {cond === 'All' ? 'All Registry' : cond}
            </button>
          ))}
        </div>
      </div>

      {/* Search Model */}
      <div className="space-y-2">
        <label htmlFor="inv-search-input" className="block text-[11px] uppercase tracking-[0.14em] text-outline font-medium">
          Search Model / Stock
        </label>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="inv-search-input"
            type="text"
            value={inventoryFilters.searchQuery}
            onChange={(e) => {
              setPage(1);
              setInventoryFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
            }}
            placeholder="GT3, Vanquish, ARX..."
            className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg pl-9 pr-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Marque Multi-Select */}
      <div className="space-y-2">
        <span className="block text-[11px] uppercase tracking-[0.14em] text-outline font-medium">
          Partner Marque
        </span>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {allMakes.map((make) => {
            const checked = inventoryFilters.makes.includes(make);
            return (
              <label
                key={make}
                className="flex items-center justify-between text-xs text-on-surface-variant hover:text-on-surface cursor-pointer py-1"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMake(make)}
                    className="accent-[#f2ca7d] rounded border-outline-variant"
                  />
                  <span>{make}</span>
                </span>
                <span className="font-mono text-[10px] text-outline">
                  {vehicles.filter((v) => v.make === make && v.syndicatePublic).length}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Ceiling Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="inv-price-slider" className="text-[11px] uppercase tracking-[0.14em] text-outline font-medium">
            Price Ceiling
          </label>
          <span className="font-mono text-xs text-primary tabular-nums">
            {formatCurrency(inventoryFilters.maxPrice)}
          </span>
        </div>
        <input
          id="inv-price-slider"
          type="range"
          min={120000}
          max={1200000}
          step={10000}
          value={inventoryFilters.maxPrice}
          onChange={(e) => {
            setPage(1);
            setInventoryFilters((prev) => ({
              ...prev,
              maxPrice: Number(e.target.value),
            }));
          }}
          className="w-full aurex-slider"
        />
      </div>

      {/* Silhouette */}
      <div className="space-y-2">
        <label htmlFor="inv-silhouette" className="block text-[11px] uppercase tracking-[0.14em] text-outline font-medium">
          Silhouette
        </label>
        <select
          id="inv-silhouette"
          value={inventoryFilters.silhouette}
          onChange={(e) => {
            setPage(1);
            setInventoryFilters((prev) => ({
              ...prev,
              silhouette: e.target.value as 'All' | VehicleSilhouette,
            }));
          }}
          className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
        >
          <option value="All">All Silhouettes</option>
          <option value="Coupe">Coupe</option>
          <option value="Roadster">Roadster</option>
          <option value="Grand Tourer">Grand Tourer</option>
          <option value="Hypercar">Hypercar</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Estate">Estate</option>
        </select>
      </div>

      {/* Model Year Chips */}
      <div className="space-y-2">
        <span className="block text-[11px] uppercase tracking-[0.14em] text-outline font-medium">
          Model Year
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(['All', 2025, 2024, 2023, 2022] as const).map((yr) => (
            <button
              key={String(yr)}
              type="button"
              onClick={() => {
                setPage(1);
                setInventoryFilters((prev) => ({ ...prev, year: yr }));
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
                inventoryFilters.year === yr
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Max Mileage */}
      <div className="space-y-2">
        <span className="block text-[11px] uppercase tracking-[0.14em] text-outline font-medium">
          Max Mileage
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {(
            [
              ['All', 'Any'],
              [500, '≤ 500 mi'],
              [2500, '≤ 2,500 mi'],
              [6000, '≤ 6,000 mi'],
            ] as const
          ).map(([val, label]) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => {
                setPage(1);
                setInventoryFilters((prev) => ({ ...prev, maxMileage: val }));
              }}
              className={`px-2.5 py-1.5 rounded text-xs font-mono border transition-colors ${
                inventoryFilters.maxMileage === val
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Powertrain */}
      <div className="space-y-2">
        <span className="block text-[11px] uppercase tracking-[0.14em] text-outline font-medium">
          Powertrain
        </span>
        <div className="flex flex-wrap gap-1.5">
          {POWERTRAINS.map((pt) => {
            const active = inventoryFilters.powertrains.includes(pt);
            return (
              <button
                key={pt}
                type="button"
                onClick={() => togglePowertrain(pt)}
                className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                  active
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant'
                }`}
              >
                {pt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exterior Shade Swatches */}
      <div className="space-y-2">
        <span className="block text-[11px] uppercase tracking-[0.14em] text-outline font-medium">
          Exterior Shade
        </span>
        <div className="flex flex-wrap gap-2">
          {SHADE_SWATCHES.map(({ shade, hex }) => {
            const active = inventoryFilters.exteriorShades.includes(shade);
            return (
              <button
                key={shade}
                type="button"
                onClick={() => toggleShade(shade)}
                title={shade}
                aria-label={`Filter exterior shade ${shade}`}
                aria-pressed={active}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  active ? 'border-primary scale-110 ring-2 ring-primary/40' : 'border-outline-variant'
                }`}
                style={{ backgroundColor: hex }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 space-y-8">
      {/* Editorial Banner */}
      <section className="p-7 sm:p-9 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
            Beverly Hills Main Salon &amp; Vault
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-on-surface">
            Master Showroom Inventory
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl">
            Every automobile in our registry is physically housed within our Beverly Hills climate
            vaults and accompanied by complete provenance and telemetry dossiers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('contact')}
          className="px-5 py-2.5 rounded-lg bg-surface-container border border-primary/40 text-primary text-xs font-semibold uppercase tracking-[0.14em] hover:bg-primary hover:text-on-primary transition-colors shrink-0 inline-flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Commission Off-Market Search</span>
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 bg-surface-container border border-outline-variant/40 rounded-xl p-5">
          {filterSidebarContent}
        </aside>

        {/* Results Column */}
        <div className="lg:col-span-9 space-y-6">
          {/* Toolbar */}
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden px-3.5 py-2 rounded-lg bg-surface-container-high border border-primary/40 text-primary text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Refine ({activeChips.length})</span>
              </button>
              <span className="text-sm text-on-surface-variant">
                Showing <strong className="text-primary font-mono">{filtered.length}</strong>{' '}
                {filtered.length === 1 ? 'chassis' : 'chassis'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="inv-sort" className="sr-only">
                Sort inventory
              </label>
              <select
                id="inv-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="featured">Sort: Curated Highlights</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="year-desc">Year: Newest First</option>
                <option value="mileage-asc">Mileage: Lowest First</option>
              </select>

              <div className="hidden sm:flex items-center rounded-lg bg-surface-container-lowest border border-outline-variant/50 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                  className={`p-1.5 rounded ${
                    viewMode === 'grid' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                  className={`p-1.5 rounded ${
                    viewMode === 'list' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Criteria Chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeChips.map((chip, idx) => (
                <button
                  key={`${chip.key}-${chip.value ?? idx}`}
                  type="button"
                  onClick={() => removeChip(chip.key, chip.value)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/40 text-xs text-primary hover:bg-primary/25 transition-colors"
                >
                  <span>{chip.label}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  resetInventoryFilters();
                  setPage(1);
                }}
                className="text-xs text-outline hover:text-primary underline underline-offset-4 ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Grid / List / Empty State */}
          {paginated.length === 0 ? (
            <div className="p-12 rounded-2xl bg-surface-container border border-outline-variant/40 text-center space-y-4">
              <h2 className="font-serif text-2xl font-semibold text-on-surface">
                No Chassis Match Current Criteria
              </h2>
              <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                Adjust your specification filters or engage our Private Acquisition Desk to source
                this configuration directly from our European collector network.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetInventoryFilters();
                    setPage(1);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em]"
                >
                  Reset All Filters
                </button>
                <button
                  type="button"
                  onClick={() => navigate('contact')}
                  className="px-5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/60 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface"
                >
                  Request Bespoke Sourcing
                </button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginated.map((v) => (
                <VehicleCard key={v.id} vehicle={v} layout="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {paginated.map((v) => (
                <VehicleCard key={v.id} vehicle={v} layout="list" />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPage(num)}
                  className={`w-9 h-9 rounded-lg font-mono text-xs border transition-colors ${
                    safePage === num
                      ? 'bg-primary text-on-primary border-primary font-semibold'
                      : 'bg-surface-container border-outline-variant/50 text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex items-end"
          role="dialog"
          aria-modal="true"
          aria-label="Refine Showroom Inventory"
        >
          <div className="w-full max-h-[85vh] bg-surface-container border-t border-outline-variant/60 rounded-t-2xl overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg font-semibold text-on-surface">
                Filter Showroom ({filtered.length} matching)
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close filter drawer"
                className="p-2 rounded-lg bg-surface-container-high text-on-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {filterSidebarContent}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="w-full py-3 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em]"
            >
              Show {filtered.length} Matching Vehicles
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
