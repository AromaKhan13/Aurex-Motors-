import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  DollarSign,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import { AUREX_ASSETS, SEED_TESTIMONIALS } from '../data/seedData';
import type { VehicleCondition, VehicleSilhouette } from '../types/aurex';
import { DEFAULT_INVENTORY_FILTERS, filterVehicles } from '../utils/inventoryFilter';
import { AurexImage } from '../components/AurexImage';
import { VehicleCard } from '../components/VehicleCard';

type HighlightTab = 'All' | 'Brand New' | 'Certified Pre-Owned' | 'Track & Hypercar' | 'Grand Touring';

export const HomePage: React.FC = () => {
  const { vehicles, marques, navigate } = useAurex();

  // Floating Search Console state
  const [searchCond, setSearchCond] = useState<'All' | VehicleCondition>('All');
  const [searchMake, setSearchMake] = useState<string>('All');
  const [searchModel, setSearchModel] = useState<string>('');
  const [searchSilhouette, setSearchSilhouette] = useState<'All' | VehicleSilhouette>('All');
  const [searchMaxPrice, setSearchMaxPrice] = useState<number>(1200000);

  // Curated highlights tab
  const [highlightTab, setHighlightTab] = useState<HighlightTab>('All');

  const liveMatchCount = useMemo(() => {
    return filterVehicles(vehicles, {
      ...DEFAULT_INVENTORY_FILTERS,
      condition: searchCond,
      makes: searchMake === 'All' ? [] : [searchMake],
      searchQuery: searchModel,
      silhouette: searchSilhouette,
      maxPrice: searchMaxPrice,
    }).length;
  }, [vehicles, searchCond, searchMake, searchModel, searchSilhouette, searchMaxPrice]);

  const handleConsoleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('inventory', {
      filters: {
        condition: searchCond,
        makes: searchMake === 'All' ? [] : [searchMake],
        searchQuery: searchModel,
        silhouette: searchSilhouette,
        maxPrice: searchMaxPrice,
      },
    });
  };

  const highlightVehicles = useMemo(() => {
    const publicList = vehicles.filter((v) => v.syndicatePublic);
    switch (highlightTab) {
      case 'Brand New':
        return publicList.filter((v) => v.condition === 'Brand New').slice(0, 6);
      case 'Certified Pre-Owned':
        return publicList.filter((v) => v.condition === 'Certified Pre-Owned').slice(0, 6);
      case 'Track & Hypercar':
        return publicList
          .filter((v) => v.silhouette === 'Coupe' || v.silhouette === 'Hypercar')
          .slice(0, 6);
      case 'Grand Touring':
        return publicList
          .filter((v) => v.silhouette === 'Grand Tourer' || v.silhouette === 'Roadster')
          .slice(0, 6);
      case 'All':
      default:
        return publicList.filter((v) => v.featured).concat(publicList.filter((v) => !v.featured)).slice(0, 6);
    }
  }, [vehicles, highlightTab]);

  const popularMarques = marques.filter((m) => m.popular).slice(0, 8);
  const availableMakes = Array.from(new Set(vehicles.map((v) => v.make))).sort();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[620px] lg:min-h-[680px] flex items-center overflow-hidden border-b border-outline-variant/40">
        <div className="absolute inset-0">
          <AurexImage
            src={AUREX_ASSETS.heroAston}
            alt="Aurex Motors Beverly Hills Flagship Grand Tourer"
            eager
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/85 to-surface-container-lowest/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface-container-lowest/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-surface-container-high/80 backdrop-blur-md border border-primary/40 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.22em] text-primary font-medium whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Beverly Hills • Geneva Allocation Desk</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-on-surface leading-[1.08] tracking-tight">
              Find Your <span className="text-primary italic font-normal">Perfect</span> Drive.
            </h1>

            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-xl">
              Explore {vehicles.filter((v) => v.syndicatePublic).length} curated factory allocations and
              180-point certified collector chassis, verified for provenance and tailored for
              immediate private handover.
            </p>

            {/* 3 Metric Badges */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3 pt-1">
              {[
                { label: 'Inspection', value: '180-Pt Spec' },
                { label: 'Volume', value: '$420M+ Placed' },
                { label: 'Satisfaction', value: '99.8% Index' },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="px-2.5 py-2 sm:px-3.5 rounded-lg bg-surface-container/80 backdrop-blur-md border border-outline-variant/50"
                >
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.16em] text-outline">
                    {metric.label}
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-primary mt-0.5 whitespace-nowrap">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('inventory')}
                className="px-6 py-3.5 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.16em] hover:bg-primary-fixed transition-colors inline-flex items-center gap-2"
              >
                <span>Explore Master Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('contact')}
                className="px-6 py-3.5 rounded-lg bg-surface-container/85 backdrop-blur-md border border-outline-variant/60 text-on-surface text-xs font-semibold uppercase tracking-[0.16em] hover:border-primary hover:text-primary transition-colors"
              >
                Book Private Salon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Glassmorphic Fleet Registry Search Console */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <form
          onSubmit={handleConsoleSearch}
          className="bg-surface-container/95 backdrop-blur-xl border border-outline-variant/60 rounded-xl p-5 sm:p-6 shadow-2xl space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/40 pb-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Registry Condition Filter">
              {(['All', 'Brand New', 'Certified Pre-Owned'] as const).map((cond) => (
                <button
                  key={cond}
                  type="button"
                  role="tab"
                  aria-selected={searchCond === cond}
                  onClick={() => setSearchCond(cond)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                    searchCond === cond
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/40'
                  }`}
                >
                  {cond === 'All' ? 'All Registry' : cond === 'Brand New' ? 'Brand New' : 'Certified Pre-Owned'}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              <span data-testid="home-search-match-count">
                {liveMatchCount} {liveMatchCount === 1 ? 'Chassis' : 'Chassis'} Matching
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label htmlFor="home-make" className="block text-[10px] uppercase tracking-[0.16em] text-outline mb-1.5">
                Partner Marque
              </label>
              <select
                id="home-make"
                value={searchMake}
                onChange={(e) => setSearchMake(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="All">All Marques</option>
                {availableMakes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="home-model" className="block text-[10px] uppercase tracking-[0.16em] text-outline mb-1.5">
                Model or Stock Code
              </label>
              <input
                id="home-model"
                type="text"
                value={searchModel}
                onChange={(e) => setSearchModel(e.target.value)}
                placeholder="e.g. GT3 RS, Vanquish"
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="home-silhouette" className="block text-[10px] uppercase tracking-[0.16em] text-outline mb-1.5">
                Silhouette
              </label>
              <select
                id="home-silhouette"
                value={searchSilhouette}
                onChange={(e) => setSearchSilhouette(e.target.value as 'All' | VehicleSilhouette)}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
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

            <div>
              <label htmlFor="home-max-price" className="block text-[10px] uppercase tracking-[0.16em] text-outline mb-1.5">
                Price Ceiling
              </label>
              <select
                id="home-max-price"
                value={searchMaxPrice}
                onChange={(e) => setSearchMaxPrice(Number(e.target.value))}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
              >
                <option value={1200000}>No Ceiling ($1.2M+)</option>
                <option value={250000}>Up to $250,000</option>
                <option value={350000}>Up to $350,000</option>
                <option value={450000}>Up to $450,000</option>
                <option value={600000}>Up to $600,000</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em] hover:bg-primary-fixed transition-colors inline-flex items-center justify-center gap-2 h-[38px]"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Fleet ({liveMatchCount})</span>
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Curated Showroom Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
              Beverly Hills Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-on-surface mt-1">
              Curated Showroom Highlights
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              ['All', 'Brand New', 'Certified Pre-Owned', 'Track & Hypercar', 'Grand Touring'] as HighlightTab[]
            ).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setHighlightTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  highlightTab === tab
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container border-outline-variant/50 text-on-surface-variant hover:border-primary/40 hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlightVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('inventory')}
            className="px-7 py-3 rounded-lg bg-surface-container border border-primary/50 text-primary text-xs font-semibold uppercase tracking-[0.16em] hover:bg-primary hover:text-on-primary transition-colors inline-flex items-center gap-2"
          >
            <span>View Full Master Inventory ({vehicles.filter((v) => v.syndicatePublic).length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Popular Partner Marque Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
              Authorized &amp; Curated Houses
            </span>
            <h2 className="font-serif text-3xl font-semibold text-on-surface mt-1">
              Popular Partner Marques
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('brands')}
            className="text-xs uppercase tracking-[0.16em] text-primary hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Explore All 15 Marques</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularMarques.map((marque) => (
            <button
              key={marque.id}
              type="button"
              onClick={() => navigate('inventory', { filters: { makes: [marque.name] } })}
              className="group relative rounded-xl overflow-hidden bg-surface-container border border-outline-variant/40 hover:border-primary/60 transition-all text-left aspect-[4/3]"
            >
              <AurexImage
                src={marque.heroImage}
                alt={marque.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="font-serif text-lg font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {marque.name}
                </div>
                <div className="text-[11px] font-mono text-outline mt-0.5 flex items-center justify-between">
                  <span>{marque.origin.split(',')[0]}</span>
                  <span className="text-primary">
                    {marque.availableCount > 0 ? `${marque.availableCount} In Vault` : 'Bespoke Order'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4 Trust Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-8 sm:p-10">
          <div className="max-w-2xl mb-8">
            <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
              The Aurex Standard
            </span>
            <h2 className="font-serif text-3xl font-semibold text-on-surface mt-1">
              Provenance Engineered Into Every Acquisition
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: '180-Point Certified Inspection',
                desc: 'Cleanroom paint-depth mapping, DME telemetry extraction, and borescope verification.',
              },
              {
                icon: DollarSign,
                title: 'Transparent Market Pricing',
                desc: 'Direct acquisition ledgers with zero hidden dealer add-ons and live valuation benchmarks.',
              },
              {
                icon: Award,
                title: 'Trusted Atelier Pedigree',
                desc: 'Since 2011, trusted by private collectors for rare PTS allocations and concours stock.',
              },
              {
                icon: Truck,
                title: 'White-Glove VIP Transport',
                desc: 'Climate-controlled enclosed carriers delivering door-to-door anywhere in North America.',
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-5 rounded-xl bg-surface-container border border-outline-variant/40 space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-on-surface">{pillar.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="mb-8">
          <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
            Collector Testimonials
          </span>
          <h2 className="font-serif text-3xl font-semibold text-on-surface mt-1">
            Words From Our Private Registry
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEED_TESTIMONIALS.map((item) => (
            <blockquote
              key={item.client}
              className="p-6 rounded-xl bg-surface-container border border-outline-variant/40 flex flex-col justify-between gap-5"
            >
              <p className="text-sm text-on-surface leading-relaxed italic font-serif">
                “{item.quote}”
              </p>
              <footer className="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-on-surface">{item.client}</div>
                  <div className="text-outline">{item.location}</div>
                </div>
                <span className="text-[11px] font-mono text-primary">{item.vehicle}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Private Salon CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="relative rounded-2xl overflow-hidden border border-primary/40 bg-surface-container-low">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>742 Prestige Blvd • Private Vault Experience</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-on-surface">
                Reserve Your Private Beverly Hills Salon Appointment
              </h2>
              <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed">
                Experience enclosed underground arrival, bespoke leather &amp; paint sample tailoring,
                and private canyon or Thermal Club dynamic evaluations with our senior marque specialists.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('contact')}
                  className="px-6 py-3 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em] hover:bg-primary-fixed transition-colors"
                >
                  Schedule Salon Viewing
                </button>
                <button
                  type="button"
                  onClick={() => navigate('auth')}
                  className="px-6 py-3 rounded-lg bg-surface-container border border-outline-variant/60 text-on-surface text-xs font-semibold uppercase tracking-[0.14em] hover:border-primary hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Enter Client Portal</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 lg:h-full min-h-[280px]">
              <AurexImage
                src={AUREX_ASSETS.salonVault}
                alt="Aurex Beverly Hills Private Viewing Vault"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
