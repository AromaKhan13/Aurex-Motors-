import React, { useMemo, useState } from 'react';
import { Award, CheckCircle2, FileCheck2, Gauge, Microscope, ShieldCheck } from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import { AUREX_ASSETS } from '../data/seedData';
import { AurexImage } from '../components/AurexImage';
import { VehicleCard } from '../components/VehicleCard';

export const UsedCarsPage: React.FC = () => {
  const { vehicles, navigate } = useAurex();
  const [tier, setTier] = useState<'All' | 'Aurex Certified' | 'Heritage Purist'>('All');
  const [makeFilter, setMakeFilter] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(700000);
  const [maxMileage, setMaxMileage] = useState<number>(10000);

  const cpoVehicles = useMemo(
    () => vehicles.filter((v) => v.syndicatePublic && v.condition === 'Certified Pre-Owned'),
    [vehicles]
  );

  const makes = useMemo(
    () => ['All', ...Array.from(new Set(cpoVehicles.map((v) => v.make))).sort()],
    [cpoVehicles]
  );

  const filteredCpo = useMemo(() => {
    return cpoVehicles.filter((v) => {
      if (tier !== 'All' && v.cpoTier !== tier) return false;
      if (makeFilter !== 'All' && v.make !== makeFilter) return false;
      if (v.price > maxPrice) return false;
      if (v.mileage > maxMileage) return false;
      return true;
    });
  }, [cpoVehicles, tier, makeFilter, maxPrice, maxMileage]);

  return (
    <div className="space-y-16 pb-10">
      {/* Hero */}
      <section className="relative min-h-[400px] flex items-center border-b border-outline-variant/40 overflow-hidden">
        <div className="absolute inset-0">
          <AurexImage
            src={AUREX_ASSETS.salonCleanroom}
            alt="Aurex Certified Cleanroom Audit"
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/90 to-surface-container-lowest/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.26em] text-primary font-semibold">
              Certified Pre-Owned &amp; Collector Vault
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-on-surface leading-tight">
              Pre-Owned. <span className="text-primary italic font-normal">Perfected.</span>
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-xl leading-relaxed">
              Every pre-owned chassis in our vault passes a forensic 180-point cleanroom audit,
              ultrasonic paint-depth verification, and full DME telemetry analysis prior to
              certification.
            </p>
          </div>

          <div className="lg:col-span-5 bg-surface-container/90 backdrop-blur-md border border-primary/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <span className="text-xs uppercase tracking-[0.18em] text-primary font-semibold">
                Vault Provenance Metrics
              </span>
              <span className="font-mono text-xs text-primary">{cpoVehicles.length} Available</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { icon: Microscope, title: '180-Point Audited', sub: 'Zero Exceptions' },
                { icon: ShieldCheck, title: 'Paint-Meter Mapped', sub: 'Original Factory Micron' },
                { icon: FileCheck2, title: 'Clean History', sub: '1-Owner Preferred' },
                { icon: Award, title: '24-Mo Assurance', sub: 'Powertrain Coverage' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.title} className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/40">
                    <Icon className="w-4 h-4 text-primary mb-1.5" />
                    <div className="font-semibold text-on-surface">{stat.title}</div>
                    <div className="text-[11px] text-outline">{stat.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Console & CPO Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(['All', 'Aurex Certified', 'Heritage Purist'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                  tier === t
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant hover:border-primary/40'
                }`}
              >
                {t === 'All' ? 'All Pre-Owned' : t}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Filter CPO by marque"
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
            >
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'All Marques' : m}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter CPO by max mileage"
              value={maxMileage}
              onChange={(e) => setMaxMileage(Number(e.target.value))}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
            >
              <option value={10000}>Mileage: Any (≤ 10k)</option>
              <option value={1500}>Collector Delivery (≤ 1,500 mi)</option>
              <option value={3500}>Low Mileage (≤ 3,500 mi)</option>
            </select>

            <select
              aria-label="Filter CPO by max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
            >
              <option value={700000}>Price: All</option>
              <option value={300000}>Up to $300,000</option>
              <option value={400000}>Up to $400,000</option>
              <option value={550000}>Up to $550,000</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCpo.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* 4-Step Certification */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
            Julian Thorne Cleanroom Protocol
          </span>
          <h2 className="font-serif text-3xl font-semibold text-on-surface mt-1">
            The Aurex 4-Step Certification
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              step: '01',
              title: 'Forensic Provenance & DME Audit',
              desc: 'Original window sticker, factory build sheet, Carfax, and ECU over-rev telemetry extraction.',
            },
            {
              step: '02',
              title: 'Micrometer Paint & Carbon Scan',
              desc: 'Multi-point ultrasonic depth inspection confirming factory paint thickness and carbon weave integrity.',
            },
            {
              step: '03',
              title: 'Mechanical & Rotor Calibration',
              desc: 'Carbon-ceramic rotor weight verification, fluid spectroscopy, and dynamic suspension road testing.',
            },
            {
              step: '04',
              title: 'Concours Detailing & Ceramic Seal',
              desc: 'Multi-stage paint correction and self-healing PPF / ceramic preservation inside our cleanroom.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-xl bg-surface-container border border-outline-variant/40 space-y-3"
            >
              <span className="font-mono text-2xl font-semibold text-primary">{item.step}</span>
              <h3 className="font-serif text-lg font-semibold text-on-surface">{item.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Consignment Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-surface-container-low border border-outline-variant/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-[0.16em]">
              <Gauge className="w-4 h-4" />
              <span>Private Acquisitions &amp; Consignment</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
              Consign or Sell Your Collector Chassis With Aurex
            </h2>
            <p className="text-sm text-on-surface-variant">
              Receive same-day outright valuation or boutique placement within our global private
              client registry.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Same-Day Wire Acquisition
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Enclosed Pickup Nationwide
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('contact')}
            className="px-6 py-3 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em] hover:bg-primary-fixed transition-colors shrink-0"
          >
            Request Valuation
          </button>
        </div>
      </section>
    </div>
  );
};
