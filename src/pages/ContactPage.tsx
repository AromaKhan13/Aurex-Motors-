import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  MapPin,
  Phone,
  Shield,
  Truck,
} from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import { AUREX_ASSETS, SEED_FAQS } from '../data/seedData';
import type { Inquiry } from '../types/aurex';
import { AurexImage } from '../components/AurexImage';

export const ContactPage: React.FC = () => {
  const { vehicles, submitInquiry, clientProfile, navigate } = useAurex();

  const [name, setName] = useState(clientProfile.name);
  const [email, setEmail] = useState(clientProfile.email);
  const [phone, setPhone] = useState(clientProfile.phone);
  const [vehicleTitle, setVehicleTitle] = useState(vehicles[0]?.title ?? '2024 Porsche 911 GT3 RS Weissach');
  const [inquiryType, setInquiryType] = useState<Inquiry['inquiryType']>('Acquisition Request');
  const [preferredContact, setPreferredContact] = useState<Inquiry['preferredContact']>('Phone');
  const [preferredDate, setPreferredDate] = useState('2026-10-30');
  const [preferredWindow, setPreferredWindow] = useState('Afternoon Salon (13:30 – 16:30)');
  const [ndaRequired, setNdaRequired] = useState(true);
  const [enclosedTransport, setEnclosedTransport] = useState(false);
  const [notes, setNotes] = useState('');
  const [submittedDossier, setSubmittedDossier] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number>(0);

  const trendingVehicles = vehicles.slice(0, 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedVeh = vehicles.find((v) => v.title === vehicleTitle);
    const created = submitInquiry({
      clientName: name.trim(),
      clientEmail: email.trim(),
      clientPhone: phone.trim(),
      vehicleId: matchedVeh?.id,
      vehicleTitle,
      inquiryType,
      preferredContact,
      preferredDate,
      preferredWindow,
      ndaRequired,
      enclosedTransport,
      notes: notes.trim() || `Priority acquisition consultation for ${vehicleTitle}.`,
    });
    setSubmittedDossier(created.id);
    setNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 space-y-16">
      {/* Hero */}
      <section className="space-y-4">
        <span className="text-[11px] uppercase tracking-[0.26em] text-primary font-semibold">
          Private Client Concierge
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-on-surface">
          EXPERIENCE THE AUREX <span className="text-primary italic font-normal">DIFFERENCE.</span>
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl">
          Connect directly with our Beverly Hills salon directors to arrange a subterranean vault
          inspection, Thermal Club chassis demonstration, or discreet NDA acquisition.
        </p>
      </section>

      {/* 4 Contact Channels */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: MapPin,
            title: 'Beverly Hills Salon',
            line1: '742 Prestige Boulevard',
            line2: 'Beverly Hills, CA 90210',
          },
          {
            icon: Phone,
            title: 'Private Concierge Line',
            line1: '+1 (310) 555-0199',
            line2: 'Direct Vault Extension',
          },
          {
            icon: Mail,
            title: 'Acquisition Desk',
            line1: 'concierge@aurexmotors.com',
            line2: 'Response Within 2 Hours',
          },
          {
            icon: Clock,
            title: 'Salon Hours',
            line1: 'Mon – Sat: 9:30 AM – 7:00 PM',
            line2: 'Sun: Private Appointment',
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="p-5 rounded-xl bg-surface-container border border-outline-variant/40 space-y-2">
              <Icon className="w-5 h-5 text-primary" />
              <div className="font-serif text-lg font-semibold text-on-surface">{card.title}</div>
              <div className="text-xs text-on-surface">{card.line1}</div>
              <div className="text-[11px] text-outline">{card.line2}</div>
            </div>
          );
        })}
      </section>

      {/* 2-Column Priority Acquisition Form & Atelier Map Card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-surface-container border border-outline-variant/50 space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
              Priority Acquisition Request
            </h2>
            <p className="text-xs text-on-surface-variant">
              Quick-select a trending chassis or specify any model from our registry.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {trendingVehicles.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVehicleTitle(v.title)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] border transition-colors ${
                    vehicleTitle === v.title
                      ? 'bg-primary text-on-primary border-primary font-semibold'
                      : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant hover:border-primary/40'
                  }`}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>

          {submittedDossier ? (
            <div className="p-6 rounded-xl bg-primary/15 border border-primary/50 space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Priority Dossier Confirmed ({submittedDossier})</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Your inquiry for <strong className="text-on-surface">{vehicleTitle}</strong> has
                been assigned to Marcus Sterling. You can monitor real-time concierge updates in
                your Client Portal.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => navigate('customer-portal')}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider"
                >
                  Open Client Portal
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittedDossier(null)}
                  className="px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/60 text-xs text-on-surface"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                    Direct Telephone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="contact-type" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                    Consultation Type
                  </label>
                  <select
                    id="contact-type"
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value as Inquiry['inquiryType'])}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Acquisition Request">Acquisition Request</option>
                    <option value="Private Salon Viewing">Private Salon Viewing</option>
                    <option value="Bespoke Commissioning">Bespoke Commissioning</option>
                    <option value="Finance Consultation">Finance Consultation</option>
                    <option value="Consignment Valuation">Consignment Valuation</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-vehicle" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                  Vehicle of Interest
                </label>
                <input
                  id="contact-vehicle"
                  type="text"
                  required
                  value={vehicleTitle}
                  onChange={(e) => setVehicleTitle(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-date" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                    Preferred Appointment Date
                  </label>
                  <input
                    id="contact-date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="contact-window" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                    Preferred Salon Window
                  </label>
                  <select
                    id="contact-window"
                    value={preferredWindow}
                    onChange={(e) => setPreferredWindow(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option>Morning Salon (10:00 – 12:30)</option>
                    <option>Afternoon Salon (13:30 – 16:30)</option>
                    <option>Private Twilight (17:30 – 20:00)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-[11px] uppercase tracking-[0.14em] text-outline">
                  Preferred Contact Method
                </span>
                <div className="flex flex-wrap gap-4 text-xs text-on-surface">
                  {(['Phone', 'Email', 'WhatsApp'] as const).map((method) => (
                    <label key={method} className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preferredContact"
                        checked={preferredContact === method}
                        onChange={() => setPreferredContact(method)}
                        className="accent-[#f2ca7d]"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-5 pt-1 text-xs text-on-surface-variant">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ndaRequired}
                    onChange={(e) => setNdaRequired(e.target.checked)}
                    className="accent-[#f2ca7d]"
                  />
                  <span className="inline-flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-primary" /> Require Mutual NDA Protocol
                  </span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enclosedTransport}
                    onChange={(e) => setEnclosedTransport(e.target.checked)}
                    className="accent-[#f2ca7d]"
                  />
                  <span className="inline-flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-primary" /> Request Enclosed Transport Quote
                  </span>
                </label>
              </div>

              <div>
                <label htmlFor="contact-notes" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                  Additional Concierge Instructions
                </label>
                <textarea
                  id="contact-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specify trade-in chassis, trust titling, or espresso/hospitality preferences..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.16em] hover:bg-primary-fixed transition-colors"
              >
                Submit Priority Acquisition Request
              </button>
            </form>
          )}
        </div>

        {/* Right: Beverly Hills Atelier Map & Gate Access Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/50">
            <div className="aspect-[16/10] bg-surface-container-lowest overflow-hidden">
              <AurexImage
                src={AUREX_ASSETS.beverlyExterior}
                alt="742 Prestige Boulevard Beverly Hills Flagship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold">
                  Subterranean Arrival Protocol
                </span>
                <h3 className="font-serif text-xl font-semibold text-on-surface mt-1">
                  Beverly Hills Flagship Atelier
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  742 Prestige Boulevard, Beverly Hills, CA 90210 • Private Underground Valet Gate
                  accessible via North Canon Alley.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-xs font-mono text-primary">
                GATE CODE ISSUED UPON APPOINTMENT CONFIRMATION
              </div>
            </div>
          </div>

          {/* 3 Salon Suite Cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: 'Bespoke Suite', img: AUREX_ASSETS.bespokeSuite1 },
              { title: 'Private Vault', img: AUREX_ASSETS.bespokeSuite2 },
              { title: 'Delivery Bay', img: AUREX_ASSETS.bespokeSuite3 },
            ].map((suite) => (
              <div key={suite.title} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-outline-variant/40">
                <AurexImage src={suite.img} alt={suite.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-on-surface">
                  {suite.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Item FAQ Accordion */}
      <section className="space-y-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
            Client Protocol
          </span>
          <h2 className="font-serif text-3xl font-semibold text-on-surface mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SEED_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={faq.question} className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left"
                >
                  <span className="font-serif text-base font-semibold text-on-surface">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-outline shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/30 pt-3">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
