import React, { useEffect, useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Save, Sparkles } from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import { SEED_VEHICLES } from '../data/seedData';
import type {
  AllocationStatus,
  ExteriorShade,
  Vehicle,
  VehicleCondition,
  VehiclePowertrain,
  VehicleSilhouette,
} from '../types/aurex';
import { AurexImage } from './AurexImage';

interface AdminVehicleStudioProps {
  onComplete: () => void;
}

export const AdminVehicleStudio: React.FC<AdminVehicleStudioProps> = ({ onComplete }) => {
  const { vehicles, editingVehicleId, setEditingVehicleId, upsertVehicle } = useAurex();
  const existing = editingVehicleId ? vehicles.find((v) => v.id === editingVehicleId) : null;

  const [make, setMake] = useState(existing?.make ?? 'Porsche');
  const [model, setModel] = useState(existing?.model ?? '');
  const [trim, setTrim] = useState(existing?.trim ?? '');
  const [year, setYear] = useState(existing?.year ?? 2025);
  const [vin, setVin] = useState(existing?.vin ?? 'WP0AF2A99SS279001');
  const [stockCode, setStockCode] = useState(
    existing?.stockCode ?? `ARX-${Math.floor(2510 + Math.random() * 400)}`
  );
  const [condition, setCondition] = useState<VehicleCondition>(existing?.condition ?? 'Brand New');
  const [silhouette, setSilhouette] = useState<VehicleSilhouette>(existing?.silhouette ?? 'Coupe');
  const [powertrain, setPowertrain] = useState<VehiclePowertrain>(
    existing?.powertrain ?? 'Internal Combustion'
  );
  const [price, setPrice] = useState(existing?.price ?? 345000);
  const [msrp, setMsrp] = useState(existing?.msrp ?? 345000);
  const [mileage, setMileage] = useState(existing?.mileage ?? 18);
  const [allocationStatus, setAllocationStatus] = useState<AllocationStatus>(
    existing?.allocationStatus ?? 'Showroom Floor'
  );
  const [exteriorColor, setExteriorColor] = useState(existing?.exteriorColor ?? 'Chalk Metallic');
  const [exteriorShade, setExteriorShade] = useState<ExteriorShade>(
    existing?.exteriorShade ?? 'Chalk Gray'
  );
  const [interiorColor, setInteriorColor] = useState(
    existing?.interiorColor ?? 'Black Leather & Race-Tex'
  );
  const [engine, setEngine] = useState(existing?.specs.engine ?? '4.0L Twin-Turbocharged V8');
  const [horsepower, setHorsepower] = useState(existing?.specs.horsepower ?? '640 hp @ 7,200 rpm');
  const [torque, setTorque] = useState(existing?.specs.torque ?? '590 lb-ft @ 3,000 rpm');
  const [zeroToSixty, setZeroToSixty] = useState(existing?.specs.zeroToSixty ?? '2.9 sec');
  const [topSpeed, setTopSpeed] = useState(existing?.specs.topSpeed ?? '204 mph');
  const [transmission, setTransmission] = useState(
    existing?.specs.transmission ?? '8-Speed Dual-Clutch'
  );
  const [drivetrain, setDrivetrain] = useState(existing?.specs.drivetrain ?? 'Rear-Wheel Drive');
  const [curatorNotes, setCuratorNotes] = useState(
    existing?.curatorNotes ??
      'Atelier-curated example presented with full Paint Protection Film, clean DME telemetry, and factory build dossier.'
  );
  const [badgesInput, setBadgesInput] = useState(
    existing?.badges.join(', ') ?? 'New Arrival, Carbon Pack, 180-Pt Certified'
  );
  const [imageUrl, setImageUrl] = useState(existing?.image ?? SEED_VEHICLES[1].image);
  const [syndicatePublic, setSyndicatePublic] = useState(existing?.syndicatePublic ?? true);
  const [featured, setFeatured] = useState(existing?.featured ?? true);
  const [mobileSection, setMobileSection] = useState<number>(1);

  useEffect(() => {
    if (existing) {
      setMake(existing.make);
      setModel(existing.model);
      setTrim(existing.trim);
      setYear(existing.year);
      setVin(existing.vin);
      setStockCode(existing.stockCode);
      setCondition(existing.condition);
      setSilhouette(existing.silhouette);
      setPowertrain(existing.powertrain);
      setPrice(existing.price);
      setMsrp(existing.msrp ?? existing.price);
      setMileage(existing.mileage);
      setAllocationStatus(existing.allocationStatus);
      setExteriorColor(existing.exteriorColor);
      setExteriorShade(existing.exteriorShade);
      setInteriorColor(existing.interiorColor);
      setEngine(existing.specs.engine);
      setHorsepower(existing.specs.horsepower);
      setTorque(existing.specs.torque);
      setZeroToSixty(existing.specs.zeroToSixty);
      setTopSpeed(existing.specs.topSpeed);
      setTransmission(existing.specs.transmission);
      setDrivetrain(existing.specs.drivetrain);
      setCuratorNotes(existing.curatorNotes);
      setBadgesInput(existing.badges.join(', '));
      setImageUrl(existing.image);
      setSyndicatePublic(existing.syndicatePublic);
      setFeatured(existing.featured);
    }
  }, [existing]);

  const handlePublish = (publishToShowroom: boolean) => {
    const cleanModel = model.trim() || '911 S/T';
    const cleanTrim = trim.trim() || 'Atelier Edition';
    const title = `${year} ${make} ${cleanModel}${cleanTrim ? ` ${cleanTrim}` : ''}`;

    const vehicle: Vehicle = {
      id: existing?.id ?? `veh-${Date.now()}`,
      stockCode: stockCode.trim() || `ARX-${Math.floor(2500 + Math.random() * 500)}`,
      vin: vin.trim(),
      year: Number(year) || 2025,
      make,
      model: cleanModel,
      trim: cleanTrim,
      title,
      condition,
      silhouette,
      powertrain,
      exteriorColor,
      exteriorShade,
      interiorColor,
      mileage: Number(mileage) || 0,
      price: Number(price) || 250000,
      msrp: Number(msrp) || Number(price) || 250000,
      monthlyLeaseEstimate: Math.round((Number(price) || 250000) * 0.0119),
      allocationStatus,
      location: 'Beverly Hills Main Salon',
      badges: badgesInput
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean)
        .slice(0, 4),
      featured,
      cpoTier: condition === 'Certified Pre-Owned' ? 'Aurex Certified' : undefined,
      ownersCount: 1,
      cleanCarfax: true,
      inspectionScore: '180 / 180 Pass',
      image: imageUrl.trim() || SEED_VEHICLES[0].image,
      gallery: existing?.gallery ?? [{ label: 'Primary Studio 3/4', url: imageUrl.trim() || SEED_VEHICLES[0].image }],
      curatorNotes: curatorNotes.trim(),
      highlights: existing?.highlights ?? [
        'Verified 180-point cleanroom provenance certification',
        'Complete factory window sticker and leather-bound dossier',
        'Nationwide enclosed climate transport ready',
      ],
      factoryOptions: existing?.factoryOptions ?? [
        'Carbon Ceramic Braking Package',
        'Front Axle Lift System',
        'Forged Lightweight Atelier Wheels',
        'Full Paint Protection Film',
      ],
      specs: {
        engine,
        horsepower,
        torque,
        zeroToSixty,
        topSpeed,
        transmission,
        drivetrain,
        weight: existing?.specs.weight ?? '3,340 lbs',
        fuelEconomy: existing?.specs.fuelEconomy ?? '15 City / 21 Hwy mpg',
        warranty: existing?.specs.warranty ?? 'Aurex Certified 24-Month / Factory Coverage',
      },
      syndicatePublic: publishToShowroom ? true : syndicatePublic,
      viewsCount: existing?.viewsCount ?? 1,
    };

    upsertVehicle(vehicle);
    setEditingVehicleId(null);
    onComplete();
  };

  const sections = [
    {
      num: 1,
      title: '01 • Identity & Provenance',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="studio-make" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Marque
            </label>
            <select
              id="studio-make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
            >
              {['Porsche', 'Ferrari', 'Aston Martin', 'Mercedes-AMG', 'McLaren', 'Bentley', 'Audi', 'BMW', 'Land Rover'].map(
                (m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label htmlFor="studio-model" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Model Name
            </label>
            <input
              id="studio-model"
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. 911 S/T or Purosangue"
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
            />
          </div>
          <div>
            <label htmlFor="studio-trim" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Trim / Edition
            </label>
            <input
              id="studio-trim"
              type="text"
              value={trim}
              onChange={(e) => setTrim(e.target.value)}
              placeholder="e.g. Heritage Package"
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
            />
          </div>
          <div>
            <label htmlFor="studio-year" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Model Year
            </label>
            <input
              id="studio-year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface font-mono"
            />
          </div>
          <div>
            <label htmlFor="studio-stock" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Stock Code
            </label>
            <input
              id="studio-stock"
              type="text"
              value={stockCode}
              onChange={(e) => setStockCode(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface font-mono"
            />
          </div>
          <div>
            <label htmlFor="studio-vin" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Chassis VIN
            </label>
            <input
              id="studio-vin"
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface font-mono"
            />
          </div>
        </div>
      ),
    },
    {
      num: 2,
      title: '02 • Financial Ledger & Allocation Terms',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="studio-cond" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Condition
            </label>
            <select
              id="studio-cond"
              value={condition}
              onChange={(e) => setCondition(e.target.value as VehicleCondition)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
            >
              <option value="Brand New">Brand New</option>
              <option value="Certified Pre-Owned">Certified Pre-Owned</option>
            </select>
          </div>
          <div>
            <label htmlFor="studio-price" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Asking Price ($)
            </label>
            <input
              id="studio-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface font-mono"
            />
          </div>
          <div>
            <label htmlFor="studio-mileage" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Odometer (mi)
            </label>
            <input
              id="studio-mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface font-mono"
            />
          </div>
          <div>
            <label htmlFor="studio-alloc" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Allocation Status
            </label>
            <select
              id="studio-alloc"
              value={allocationStatus}
              onChange={(e) => setAllocationStatus(e.target.value as AllocationStatus)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
            >
              <option value="Showroom Floor">Showroom Floor</option>
              <option value="Immediate Delivery">Immediate Delivery</option>
              <option value="Private Vault">Private Vault</option>
              <option value="Factory Allocation">Factory Allocation</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      num: 3,
      title: '03 • Mechanical Specifications',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="studio-sil" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Silhouette
            </label>
            <select
              id="studio-sil"
              value={silhouette}
              onChange={(e) => setSilhouette(e.target.value as VehicleSilhouette)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
            >
              {['Coupe', 'Roadster', 'Grand Tourer', 'Hypercar', 'SUV', 'Sedan', 'Estate'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="studio-pt" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Powertrain
            </label>
            <select
              id="studio-pt"
              value={powertrain}
              onChange={(e) => setPowertrain(e.target.value as VehiclePowertrain)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
            >
              {['Internal Combustion', 'Plug-In Hybrid', 'Hybrid', 'Electric'].map((pt) => (
                <option key={pt} value={pt}>{pt}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="studio-hp" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Horsepower
            </label>
            <input
              id="studio-hp"
              type="text"
              value={horsepower}
              onChange={(e) => setHorsepower(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface font-mono"
            />
          </div>
          <div>
            <label htmlFor="studio-060" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              0–60 mph
            </label>
            <input
              id="studio-060"
              type="text"
              value={zeroToSixty}
              onChange={(e) => setZeroToSixty(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="studio-engine" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Engine Architecture
            </label>
            <input
              id="studio-engine"
              type="text"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
            />
          </div>
          <div>
            <label htmlFor="studio-ext" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Exterior Paint Name
            </label>
            <input
              id="studio-ext"
              type="text"
              value={exteriorColor}
              onChange={(e) => setExteriorColor(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
            />
          </div>
          <div>
            <label htmlFor="studio-shade" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Filter Shade Group
            </label>
            <select
              id="studio-shade"
              value={exteriorShade}
              onChange={(e) => setExteriorShade(e.target.value as ExteriorShade)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
            >
              {[
                'Obsidian Black',
                'Chalk Gray',
                'Champagne Silver',
                'Rosso Corsa',
                'British Racing Green',
                'Sapphire Blue',
                'Pearl White',
                'Magmabeam Orange',
              ].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      ),
    },
    {
      num: 4,
      title: '04 • Curatorial Description & Bespoke Tag Cloud',
      content: (
        <div className="space-y-4">
          <div>
            <label htmlFor="studio-notes" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Atelier Curatorial Notes
            </label>
            <textarea
              id="studio-notes"
              rows={3}
              value={curatorNotes}
              onChange={(e) => setCuratorNotes(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-xs text-on-surface"
            />
          </div>
          <div>
            <label htmlFor="studio-badges" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1">
              Showroom Badges (Comma-Separated)
            </label>
            <input
              id="studio-badges"
              type="text"
              value={badgesInput}
              onChange={(e) => setBadgesInput(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2 text-xs text-on-surface"
            />
          </div>
        </div>
      ),
    },
    {
      num: 5,
      title: '05 • Multi-Angle Media Vault',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-4 aspect-[16/10] rounded-lg overflow-hidden bg-surface-container-lowest border border-outline-variant/50">
            <AurexImage src={imageUrl} alt="Studio Preview" className="w-full h-full object-cover" />
          </div>
          <div className="md:col-span-8 space-y-2">
            <label htmlFor="studio-image" className="block text-[11px] uppercase tracking-[0.14em] text-outline">
              Primary Studio Photograph URL
            </label>
            <input
              id="studio-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs font-mono text-on-surface"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {SEED_VEHICLES.slice(0, 4).map((sv) => (
                <button
                  key={sv.id}
                  type="button"
                  onClick={() => setImageUrl(sv.image)}
                  className="px-2.5 py-1 rounded bg-surface-container-low border border-outline-variant/40 text-[10px] text-on-surface-variant hover:border-primary"
                >
                  Use {sv.make} Asset
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 6,
      title: '06 • Inspection, Provenance & Dyno Telemetry Curve',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-5 space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
              <span className="text-on-surface-variant">180-Point Cleanroom Status</span>
              <span className="font-mono text-primary font-semibold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </span>
            </div>
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
              <span className="text-on-surface-variant">Micrometer Paint Meter Avg</span>
              <span className="font-mono text-on-surface">118 µm (Factory)</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
              <span className="text-on-surface-variant">DME Over-Rev Ignitions</span>
              <span className="font-mono text-primary">0 Ranges 1–6</span>
            </div>
          </div>
          <div className="md:col-span-7 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40">
            <div className="flex items-center justify-between text-[11px] font-mono text-outline mb-2">
              <span>DYNO TELEMETRY CURVE (HP / LB-FT)</span>
              <span className="text-primary">8,500 RPM REDLINE</span>
            </div>
            <svg viewBox="0 0 360 90" className="w-full h-24" aria-label="Chassis Dyno Telemetry Curve">
              <line x1="0" y1="75" x2="360" y2="75" stroke="#4d4639" strokeWidth="1" />
              <path
                d="M 10 72 Q 110 62 190 42 T 345 14"
                fill="none"
                stroke="#f2ca7d"
                strokeWidth="2.5"
              />
              <path
                d="M 10 65 Q 115 32 225 28 T 345 34"
                fill="none"
                stroke="#bfcfff"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            </svg>
          </div>
        </div>
      ),
    },
    {
      num: 7,
      title: '07 • Syndication & Showroom Publishing',
      content: (
        <div className="flex flex-wrap gap-6 text-xs text-on-surface">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={syndicatePublic}
              onChange={(e) => setSyndicatePublic(e.target.checked)}
              className="accent-[#f2ca7d]"
            />
            <span>Publish to Public Showroom &amp; Master Inventory</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="accent-[#f2ca7d]"
            />
            <span>Feature in Home Showroom Highlights</span>
          </label>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Vehicle Management Studio
          </span>
          <h1 className="font-serif text-3xl font-semibold text-on-surface mt-1">
            {existing ? `Edit Chassis: ${existing.title}` : 'Add New Chassis Allocation'}
          </h1>
        </div>

        {existing && (
          <button
            type="button"
            onClick={() => setEditingVehicleId(null)}
            className="px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/50 text-xs text-on-surface-variant hover:text-primary"
          >
            Switch to New Vehicle Form
          </button>
        )}
      </div>

      {/* Responsive 7-section layout (expanded on desktop, collapsible accordion on mobile) */}
      <div className="space-y-4">
        {sections.map((sec) => {
          const openMobile = mobileSection === sec.num;
          return (
            <div
              key={sec.num}
              className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setMobileSection(openMobile ? 0 : sec.num)}
                className="w-full px-5 py-4 flex items-center justify-between text-left border-b border-outline-variant/30 md:cursor-default"
              >
                <span className="font-serif text-base font-semibold text-primary">{sec.title}</span>
                <span className="md:hidden text-outline">
                  {openMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>
              <div className={`p-5 ${openMobile ? 'block' : 'hidden md:block'}`}>{sec.content}</div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Publish Bar */}
      <div className="sticky bottom-16 lg:bottom-4 z-30 p-4 rounded-xl bg-surface-container-high/95 backdrop-blur-xl border border-primary/40 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-on-surface-variant">
          Stock <strong className="font-mono text-primary">{stockCode}</strong> •{' '}
          {year} {make} {model || 'New Model'}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handlePublish(false)}
            className="px-4 py-2.5 rounded-lg bg-surface-container border border-outline-variant/60 text-xs font-medium text-on-surface hover:border-primary inline-flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handlePublish(true)}
            className="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em] hover:bg-primary-fixed inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish to Showroom</span>
          </button>
        </div>
      </div>
    </div>
  );
};
