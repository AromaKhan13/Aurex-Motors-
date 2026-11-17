import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  Award,
  Bookmark,
  Calculator,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Gauge,
  MapPin,
  MessageCircle,
  Printer,
  Share2,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import { SEED_LEADERSHIP } from '../data/seedData';
import { formatCurrency } from '../utils/finance';
import { AurexImage } from '../components/AurexImage';
import { VehicleCard } from '../components/VehicleCard';

export const VehicleDetailPage: React.FC = () => {
  const {
    selectedVehicle,
    vehicles,
    navigate,
    favorites,
    toggleFavorite,
    comparisonIds,
    toggleCompare,
    openFinanceModal,
    submitInquiry,
    bookTestDrive,
    clientProfile,
    pushToast,
  } = useAurex();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string>('powertrain');
  const [resName, setResName] = useState(clientProfile.name);
  const [resEmail, setResEmail] = useState(clientProfile.email);
  const [resPhone, setResPhone] = useState(clientProfile.phone);
  const [resDate, setResDate] = useState('2026-10-28');
  const [resWindow, setResWindow] = useState('Morning Salon (10:00 – 12:30)');
  const [resNotes, setResNotes] = useState('');
  const [submittedDossierId, setSubmittedDossierId] = useState<string | null>(null);

  const gallery =
    selectedVehicle.gallery.length > 0
      ? selectedVehicle.gallery
      : [{ label: 'Primary View', url: selectedVehicle.image }];
  const safeIdx = Math.min(activePhotoIdx, gallery.length - 1);
  const activePhoto = gallery[safeIdx];

  const isFav = favorites.includes(selectedVehicle.id);
  const isComparing = comparisonIds.includes(selectedVehicle.id);

  const relatedVehicles = vehicles
    .filter((v) => v.syndicatePublic && v.id !== selectedVehicle.id)
    .sort((a, b) => Number(b.make === selectedVehicle.make) - Number(a.make === selectedVehicle.make))
    .slice(0, 3);

  const specialist = SEED_LEADERSHIP[2]; // Marcus Sterling

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = submitInquiry({
      clientName: resName.trim() || clientProfile.name,
      clientEmail: resEmail.trim() || clientProfile.email,
      clientPhone: resPhone.trim() || clientProfile.phone,
      vehicleId: selectedVehicle.id,
      vehicleTitle: selectedVehicle.title,
      inquiryType: 'Private Salon Viewing',
      preferredContact: 'Phone',
      preferredDate: resDate,
      preferredWindow: resWindow,
      notes: resNotes.trim() || `Private salon viewing requested for ${selectedVehicle.title}.`,
    });
    bookTestDrive({
      vehicle: selectedVehicle,
      clientName: resName.trim() || clientProfile.name,
      date: resDate,
      timeWindow: resWindow,
    });
    setSubmittedDossierId(created.id);
  };

  const handleQuickTestDrive = () => {
    bookTestDrive({
      vehicle: selectedVehicle,
      clientName: clientProfile.name,
      date: resDate,
      timeWindow: resWindow,
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    pushToast('Dossier Link Copied', `${selectedVehicle.stockCode} ready to share.`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 space-y-12">
      {/* Breadcrumbs & Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <button
            type="button"
            onClick={() => navigate('inventory')}
            className="inline-flex items-center gap-1.5 text-primary hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Inventory</span>
          </button>
          <span className="text-outline">/</span>
          <button
            type="button"
            onClick={() => navigate('inventory', { filters: { makes: [selectedVehicle.make] } })}
            className="hover:text-primary"
          >
            {selectedVehicle.make}
          </button>
          <span className="text-outline">/</span>
          <span className="text-on-surface">{selectedVehicle.model}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/50 text-xs text-on-surface-variant hover:text-primary inline-flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(selectedVehicle.id)}
            aria-pressed={isFav}
            className={`px-3 py-1.5 rounded-lg border text-xs inline-flex items-center gap-1.5 transition-colors ${
              isFav
                ? 'bg-primary text-on-primary border-primary font-semibold'
                : 'bg-surface-container border-outline-variant/50 text-on-surface-variant hover:text-primary'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isFav ? 'currentColor' : 'none'} />
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(selectedVehicle.id)}
            aria-pressed={isComparing}
            className={`px-3 py-1.5 rounded-lg border text-xs inline-flex items-center gap-1.5 transition-colors ${
              isComparing
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-surface-container border-outline-variant/50 text-on-surface-variant hover:text-primary'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>{isComparing ? 'Comparing' : 'Compare'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/50 text-xs text-on-surface-variant hover:text-primary inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Title & Identifiers */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-primary text-on-primary text-[10px] font-semibold uppercase tracking-[0.14em]">
            {selectedVehicle.condition}
          </span>
          <span className="px-2.5 py-1 rounded bg-surface-container border border-outline-variant/50 text-[10px] font-mono text-primary uppercase tracking-wider">
            {selectedVehicle.allocationStatus}
          </span>
          {selectedVehicle.badges.map((b) => (
            <span
              key={b}
              className="px-2.5 py-1 rounded bg-surface-container-low border border-outline-variant/40 text-[10px] uppercase tracking-wider text-on-surface-variant"
            >
              {b}
            </span>
          ))}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-on-surface">
          {selectedVehicle.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-on-surface-variant font-mono">
          <span>STOCK: <strong className="text-on-surface">{selectedVehicle.stockCode}</strong></span>
          <span>VIN: <strong className="text-on-surface">{selectedVehicle.vin}</strong></span>
          <span>MILEAGE: <strong className="text-primary">{selectedVehicle.mileage.toLocaleString()} MI</strong></span>
          <span className="inline-flex items-center gap-1 font-sans">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {selectedVehicle.location}
          </span>
        </div>
      </div>

      {/* 2-Column Detail Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Gallery & Technical Blueprint */}
        <div className="lg:col-span-8 space-y-8">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/50">
              <AurexImage
                src={activePhoto.url}
                alt={`${selectedVehicle.title} — ${activePhoto.label}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded bg-surface-container-lowest/85 backdrop-blur-md border border-outline-variant/50 text-[11px] font-mono text-primary">
                  4K Studio Capture
                </span>
                {selectedVehicle.specs.downforce && (
                  <span className="px-3 py-1 rounded bg-surface-container-lowest/85 backdrop-blur-md border border-primary/40 text-[11px] font-mono text-on-surface">
                    Downforce: {selectedVehicle.specs.downforce}
                  </span>
                )}
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-surface-container-lowest/85 backdrop-blur-md border border-outline-variant/50 text-xs text-on-surface">
                {activePhoto.label} ({safeIdx + 1} / {gallery.length})
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {gallery.map((photo, idx) => (
                  <button
                    key={`${photo.label}-${idx}`}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    aria-label={`View ${photo.label}`}
                    className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${
                      safeIdx === idx
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-outline-variant/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <AurexImage
                      src={photo.url}
                      alt={photo.label}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5-Card Certified Track Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Horsepower', val: selectedVehicle.specs.horsepower.split('@')[0].trim() },
              { label: '0–60 mph', val: selectedVehicle.specs.zeroToSixty },
              { label: 'Top Speed', val: selectedVehicle.specs.topSpeed },
              { label: 'Transmission', val: selectedVehicle.specs.transmission.split(' ')[0] + ' ' + (selectedVehicle.specs.transmission.split(' ')[1] || '') },
              { label: 'Curb Weight', val: selectedVehicle.specs.weight },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/40"
              >
                <span className="block text-[10px] uppercase tracking-[0.14em] text-outline">
                  {item.label}
                </span>
                <span className="block font-mono text-sm font-semibold text-primary mt-1 tabular-nums">
                  {item.val}
                </span>
              </div>
            ))}
          </div>

          {/* Atelier Curatorial Notes */}
          <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Atelier Curatorial Notes</span>
            </div>
            <p className="text-sm sm:text-base text-on-surface leading-relaxed">
              {selectedVehicle.curatorNotes}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {selectedVehicle.highlights.map((hl) => (
                <div
                  key={hl}
                  className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface-variant flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Collapsible Technical Blueprint Accordions */}
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold text-on-surface">
              Technical Blueprint &amp; Provenance
            </h2>

            {[
              {
                id: 'powertrain',
                title: 'Powertrain & Telemetry Calibration',
                rows: [
                  ['Engine Architecture', selectedVehicle.specs.engine],
                  ['Peak Output', selectedVehicle.specs.horsepower],
                  ['Peak Torque', selectedVehicle.specs.torque],
                  ['Transmission', selectedVehicle.specs.transmission],
                ],
              },
              {
                id: 'chassis',
                title: 'Chassis, Drivetrain & Braking',
                rows: [
                  ['Drivetrain', selectedVehicle.specs.drivetrain],
                  ['0–60 mph Acceleration', selectedVehicle.specs.zeroToSixty],
                  ['Maximum Track Velocity', selectedVehicle.specs.topSpeed],
                  ['Braking System', selectedVehicle.specs.braking ?? 'High-Performance Carbon Ceramic / Steel'],
                ],
              },
              {
                id: 'aesthetics',
                title: 'Commissioning & Trim Colors',
                rows: [
                  ['Exterior Finish', selectedVehicle.exteriorColor],
                  ['Interior Tailoring', selectedVehicle.interiorColor],
                  ['Curb Weight', selectedVehicle.specs.weight],
                  ['Efficiency / Range', selectedVehicle.specs.fuelEconomy],
                ],
              },
              {
                id: 'provenance',
                title: 'Warranty & Cleanroom Certification',
                rows: [
                  ['Warranty Coverage', selectedVehicle.specs.warranty],
                  ['Inspection Grade', selectedVehicle.inspectionScore ?? 'Factory Delivery Standard'],
                  ['History', selectedVehicle.cleanCarfax !== false ? 'Verified Clean History' : 'In Audit'],
                  ['Current Vault', selectedVehicle.location],
                ],
              },
            ].map((section) => {
              const isOpen = openAccordion === section.id;
              return (
                <div
                  key={section.id}
                  className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenAccordion(isOpen ? '' : section.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-surface-container-high/50 transition-colors"
                  >
                    <span className="font-serif text-base font-semibold text-on-surface">
                      {section.title}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-primary" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-outline" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 border-t border-outline-variant/30 divide-y divide-outline-variant/20">
                      {section.rows.map(([k, val]) => (
                        <div key={k} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                          <span className="text-on-surface-variant">{k}</span>
                          <span className="font-mono text-on-surface text-right">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Factory Equipment & Options Grid */}
          <div className="p-6 sm:p-8 rounded-2xl bg-surface-container border border-outline-variant/40 space-y-5">
            <h2 className="font-serif text-2xl font-semibold text-on-surface">
              Factory Equipment &amp; Tailored Options
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedVehicle.factoryOptions.map((opt) => (
                <div
                  key={opt}
                  className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface flex items-center gap-2.5"
                >
                  <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 180-Point Certification Seal */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-primary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-on-surface">
                  Aurex 180-Point Provenance &amp; Mechanical Seal
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Audited by Chief Technician Julian Thorne • Paint-depth, borescope &amp; DME logs on file.
                </p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-mono text-xs font-semibold shrink-0">
              VERIFIED PASS
            </span>
          </div>
        </div>

        {/* Right Sticky Acquisition Panel */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container border border-primary/40 shadow-2xl space-y-5">
            <div className="pb-4 border-b border-outline-variant/40">
              <span className="text-[11px] uppercase tracking-[0.18em] text-outline block">
                Acquisition Ledger
              </span>
              <div className="font-serif text-4xl font-semibold text-primary mt-1 tabular-nums">
                {formatCurrency(selectedVehicle.price)}
              </div>
              {selectedVehicle.msrp && selectedVehicle.msrp !== selectedVehicle.price && (
                <div className="text-xs font-mono text-outline mt-1">
                  Original MSRP: {formatCurrency(selectedVehicle.msrp)}
                </div>
              )}
              <button
                type="button"
                onClick={() => openFinanceModal(selectedVehicle)}
                className="mt-3 w-full py-2.5 px-3 rounded-lg bg-surface-container-low border border-primary/40 text-xs text-primary hover:bg-primary/15 transition-colors flex items-center justify-between"
              >
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Calculator className="w-3.5 h-3.5" />
                  Est. {formatCurrency(selectedVehicle.monthlyLeaseEstimate)}/mo
                </span>
                <span className="uppercase tracking-wider text-[10px] font-semibold underline">
                  Open Calculator
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleQuickTestDrive}
                className="py-2.5 px-3 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.1em] hover:bg-primary-fixed transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Drive</span>
              </button>
              <a
                href="https://wa.me/13105550199"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-lg bg-surface-container-high border border-outline-variant/60 text-xs font-medium text-on-surface hover:border-primary hover:text-primary transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-primary" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Private Salon Reservation Form */}
            <form onSubmit={handleReserveSubmit} className="space-y-3 pt-2 border-t border-outline-variant/40">
              <div className="text-xs uppercase tracking-[0.16em] text-primary font-semibold">
                Private Salon Reservation
              </div>

              {submittedDossierId ? (
                <div className="p-4 rounded-xl bg-primary/15 border border-primary/50 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Reservation Registered ({submittedDossierId})</span>
                  </div>
                  <p className="text-on-surface-variant">
                    Marcus Sterling has prepared {selectedVehicle.title} for {resDate}. View status in
                    your Private Client Portal.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('customer-portal')}
                    className="text-primary underline font-medium"
                  >
                    Open Client Portal →
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="detail-res-name" className="sr-only">Full Name</label>
                    <input
                      id="detail-res-name"
                      type="text"
                      required
                      value={resName}
                      onChange={(e) => setResName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="detail-res-email" className="sr-only">Email</label>
                      <input
                        id="detail-res-email"
                        type="email"
                        required
                        value={resEmail}
                        onChange={(e) => setResEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
                      />
                    </div>
                    <div>
                      <label htmlFor="detail-res-phone" className="sr-only">Phone</label>
                      <input
                        id="detail-res-phone"
                        type="tel"
                        required
                        value={resPhone}
                        onChange={(e) => setResPhone(e.target.value)}
                        placeholder="Phone"
                        className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="detail-res-date" className="sr-only">Preferred Date</label>
                      <input
                        id="detail-res-date"
                        type="date"
                        value={resDate}
                        onChange={(e) => setResDate(e.target.value)}
                        className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
                      />
                    </div>
                    <div>
                      <label htmlFor="detail-res-window" className="sr-only">Preferred Window</label>
                      <select
                        id="detail-res-window"
                        value={resWindow}
                        onChange={(e) => setResWindow(e.target.value)}
                        className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-2 py-2 text-xs text-on-surface"
                      >
                        <option>Morning Salon (10:00 – 12:30)</option>
                        <option>Afternoon Salon (13:30 – 16:30)</option>
                        <option>Private Twilight (17:30 – 20:00)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="detail-res-notes" className="sr-only">Concierge Notes</label>
                    <textarea
                      id="detail-res-notes"
                      rows={2}
                      value={resNotes}
                      onChange={(e) => setResNotes(e.target.value)}
                      placeholder="Trade-in valuation, enclosed transport, or NDA request..."
                      className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em] hover:bg-primary-fixed transition-colors"
                  >
                    Confirm Private Salon Viewing
                  </button>
                </>
              )}
            </form>

            {/* Senior Marque Specialist */}
            <div className="pt-4 border-t border-outline-variant/40 flex items-center gap-3">
              <AurexImage
                src={specialist.image}
                alt={specialist.name}
                className="w-11 h-11 rounded-full object-cover border border-primary/50 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-on-surface">{specialist.name}</div>
                <div className="text-[11px] text-outline truncate">{specialist.role}</div>
              </div>
              <Award className="w-4 h-4 text-primary ml-auto shrink-0" />
            </div>
          </div>
        </aside>
      </div>

      {/* Related Acquisitions */}
      <section className="pt-8 border-t border-outline-variant/40 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
              Curated Alternatives
            </span>
            <h2 className="font-serif text-3xl font-semibold text-on-surface mt-1">
              Related Vault Acquisitions
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('inventory')}
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Explore Full Registry</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedVehicles.map((rv) => (
            <VehicleCard key={rv.id} vehicle={rv} />
          ))}
        </div>
      </section>
    </div>
  );
};
