import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Compass, Crown, Sparkles, Zap } from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import { AUREX_ASSETS } from '../data/seedData';
import type { AllocationStatus, VehiclePowertrain, VehicleSilhouette } from '../types/aurex';
import { formatCurrency } from '../utils/finance';
import { AurexImage } from '../components/AurexImage';
import { VehicleCard } from '../components/VehicleCard';

export const NewCarsPage: React.FC = () => {
  const { vehicles, navigate } = useAurex();
  const [selectedMake, setSelectedMake] = useState<string>('All');
  const [silhouette, setSilhouette] = useState<'All' | VehicleSilhouette>('All');
  const [powertrain, setPowertrain] = useState<'All' | VehiclePowertrain>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | AllocationStatus>('All');

  const newVehicles = useMemo(
    () => vehicles.filter((v) => v.syndicatePublic && v.condition === 'Brand New'),
    [vehicles]
  );

  const makes = useMemo(
    () => ['All', ...Array.from(new Set(newVehicles.map((v) => v.make))).sort()],
    [newVehicles]
  );

  const spotlightVehicles = newVehicles.slice(0, 2);

  const filteredNew = useMemo(() => {
    return newVehicles.filter((v) => {
      if (selectedMake !== 'All' && v.make !== selectedMake) return false;
      if (silhouette !== 'All' && v.silhouette !== silhouette) return false;
      if (powertrain !== 'All' && v.powertrain !== powertrain) return false;
      if (statusFilter !== 'All' && v.allocationStatus !== statusFilter) return false;
      return true;
    });
  }, [newVehicles, selectedMake, silhouette, powertrain, statusFilter]);

  return (
    <div className="space-y-16 pb-10">
      {/* Hero */}
      <section className="relative min-h-[420px] flex items-center border-b border-outline-variant/40 overflow-hidden">
        <div className="absolute inset-0">
          <AurexImage
            src={AUREX_ASSETS.heroAston}
            alt="Factory Allocations Showcase"
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/85 to-surface-container-lowest/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8">
          <div className="max-w-2xl space-y-4">
            <span className="text-[11px] uppercase tracking-[0.26em] text-primary font-semibold">
              Brand New &amp; Factory Allocations
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-on-surface leading-tight">
              THE FUTURE OF <span className="text-primary italic font-normal">DRIVING.</span>
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Delivery-mileage showroom examples and bespoke factory build slots curated directly
              from Maranello, Gaydon, Stuttgart, Munich, and Ingolstadt.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Crown, label: 'Direct Factory Slots', val: `${newVehicles.length} Immediate` },
              { icon: Sparkles, label: 'Atelier Tailoring', val: 'Q / Tailor Made' },
              { icon: Zap, label: 'Delivery Mileage', val: 'Under 50 Miles' },
              { icon: Compass, label: 'Full Factory Warranty', val: '3 to 7 Years' },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="p-4 rounded-xl bg-surface-container/85 backdrop-blur-md border border-outline-variant/50 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center text-primary shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-outline">{m.label}</div>
                    <div className="text-xs font-semibold text-on-surface mt-0.5">{m.val}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Direct Factory Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
            Flagship Commissions
          </span>
          <h2 className="font-serif text-3xl font-semibold text-on-surface mt-1">
            Direct Factory Spotlight
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {spotlightVehicles.map((v) => (
            <div
              key={v.id}
              className="group rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/50 hover:border-primary/60 transition-all grid grid-cols-1 sm:grid-cols-12"
            >
              <div className="sm:col-span-6 aspect-[16/10] sm:aspect-auto bg-surface-container-lowest overflow-hidden">
                <AurexImage
                  src={v.image}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="sm:col-span-6 p-6 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-1 rounded bg-primary text-on-primary text-[10px] font-semibold uppercase tracking-[0.14em]">
                    {v.allocationStatus}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-on-surface">{v.title}</h3>
                  <p className="text-xs text-on-surface-variant line-clamp-3">{v.curatorNotes}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-outline-variant/30">
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-2xl font-semibold text-primary tabular-nums">
                      {formatCurrency(v.price)}
                    </span>
                    <span className="font-mono text-xs text-outline">{v.mileage} mi</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('vehicle-detail', { vehicleId: v.id })}
                    className="w-full py-2.5 rounded-lg bg-surface-container-high border border-primary/40 text-primary text-xs font-semibold uppercase tracking-[0.14em] hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    Inspect Allocation Dossier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Marque Filter Bar + Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {makes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMake(m)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  selectedMake === m
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant hover:border-primary/40'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              aria-label="Filter new cars by silhouette"
              value={silhouette}
              onChange={(e) => setSilhouette(e.target.value as 'All' | VehicleSilhouette)}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-1.5 text-xs text-on-surface"
            >
              <option value="All">All Silhouettes</option>
              <option value="Grand Tourer">Grand Tourer</option>
              <option value="Roadster">Roadster</option>
              <option value="Coupe">Coupe</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Estate">Estate</option>
            </select>

            <select
              aria-label="Filter new cars by powertrain"
              value={powertrain}
              onChange={(e) => setPowertrain(e.target.value as 'All' | VehiclePowertrain)}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-1.5 text-xs text-on-surface"
            >
              <option value="All">All Powertrains</option>
              <option value="Internal Combustion">Internal Combustion</option>
              <option value="Plug-In Hybrid">Plug-In Hybrid</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            <select
              aria-label="Filter new cars by allocation status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | AllocationStatus)}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-1.5 text-xs text-on-surface"
            >
              <option value="All">All Statuses</option>
              <option value="Immediate Delivery">Immediate Delivery</option>
              <option value="Showroom Floor">Showroom Floor</option>
              <option value="Private Vault">Private Vault</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNew.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* Bespoke Commissioning Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-surface-container-low border border-primary/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
              Bespoke Atelier Commissioning
            </span>
            <h2 className="font-serif text-3xl font-semibold text-on-surface">
              Tailor Your Next Build With Our Factory Liaisons
            </h2>
            <p className="text-sm text-on-surface-variant">
              Specify Paint-to-Sample hues, carbon-fiber weaves, and custom contrast stitching inside
              our Beverly Hills Material Studio with Elena Rostova.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Porsche Sonderwunsch
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Ferrari Tailor Made
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Q by Aston Martin
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('contact')}
            className="px-6 py-3.5 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em] hover:bg-primary-fixed transition-colors inline-flex items-center gap-2 shrink-0"
          >
            <span>Request Allocation Slot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
