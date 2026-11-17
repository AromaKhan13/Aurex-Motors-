import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Crown, Search, Sparkles } from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import type { MarqueCategory } from '../types/aurex';
import { AurexImage } from '../components/AurexImage';

const CATEGORIES: MarqueCategory[] = [
  'All',
  'Hypercar',
  'Grand Touring',
  'Executive Sport',
  'All-Terrain',
];

export const BrandsPage: React.FC = () => {
  const { marques, navigate, submitInquiry, clientProfile } = useAurex();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<MarqueCategory>('All');
  const [inquiryMarque, setInquiryMarque] = useState('Ferrari');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return marques.filter((m) => {
      if (category !== 'All' && m.category !== category) return false;
      if (q && !`${m.name} ${m.origin} ${m.tagline}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [marques, category, search]);

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry({
      clientName: clientProfile.name,
      clientEmail: clientProfile.email,
      clientPhone: clientProfile.phone,
      vehicleTitle: `${inquiryMarque} Bespoke Allocation`,
      inquiryType: 'Bespoke Commissioning',
      preferredContact: clientProfile.preferredContact,
      notes: inquiryNotes.trim() || `Priority allocation inquiry for ${inquiryMarque}.`,
    });
    setSubmitted(true);
    setInquiryNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 space-y-14">
      {/* Hero */}
      <section className="p-8 sm:p-12 rounded-2xl bg-surface-container-low border border-outline-variant/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <span className="text-[11px] uppercase tracking-[0.24em] text-primary font-semibold">
            Authorized &amp; Curated Stables
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-on-surface">
            The World’s Finest Marques.
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Direct relationships with Europe’s and Japan’s most revered automotive ateliers, enabling
            priority allocation access and Paint-to-Sample bespoke commissions.
          </p>
        </div>

        <div className="lg:col-span-4 grid grid-cols-1 gap-3">
          {[
            ['15 Partner Houses', 'Stuttgart • Maranello • Gaydon • Crewe'],
            ['4 Bespoke Archetypes', 'Hypercar • GT • Executive • Terrain'],
            ['Priority Allocations', 'Private Vault & Tailor Made Liaison'],
          ].map(([title, sub]) => (
            <div key={title} className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/40">
              <div className="text-sm font-semibold text-primary">{title}</div>
              <div className="text-xs text-outline mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search & Category Filter */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container border border-outline-variant/40">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  category === cat
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant hover:border-primary/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search marque or origin..."
              aria-label="Search marques"
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg pl-9 pr-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* 15-Marque Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() =>
                m.availableCount > 0
                  ? navigate('inventory', { filters: { makes: [m.name] } })
                  : setInquiryMarque(m.name)
              }
              className="group text-left rounded-xl overflow-hidden bg-surface-container border border-outline-variant/40 hover:border-primary/60 transition-all flex flex-col"
            >
              <div className="relative aspect-[16/9] bg-surface-container-lowest overflow-hidden">
                <AurexImage
                  src={m.heroImage}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-surface-container-lowest/85 border border-outline-variant/50 text-[10px] uppercase tracking-[0.14em] text-primary">
                  {m.category}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-surface-container-lowest/85 border border-outline-variant/50 text-[10px] font-mono text-on-surface">
                  Est. {m.founded}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-on-surface group-hover:text-primary transition-colors">
                    {m.name}
                  </h2>
                  <p className="text-[11px] font-mono text-outline mt-0.5">{m.origin}</p>
                  <p className="text-xs text-on-surface-variant mt-2.5 leading-relaxed">
                    {m.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                  <span className="font-mono text-primary">
                    {m.availableCount > 0
                      ? `${m.availableCount} In Showroom`
                      : 'Private Commission Only'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-on-surface-variant group-hover:text-primary font-medium">
                    <span>{m.availableCount > 0 ? 'Filter Fleet' : 'Inquire'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Private Marque Concierge Inquiry */}
      <section className="p-8 rounded-2xl bg-surface-container-low border border-primary/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            <Crown className="w-4 h-4" />
            <span>Private Marque Liaison</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold text-on-surface">
            Source an Off-Market Allocation
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Seeking a Lamborghini Revuelto build slot, Rolls-Royce Spectre bespoke commission, or
            limited-run hypercar? Submit your target marque to Elena Rostova’s commissioning desk.
          </p>
        </div>

        <form onSubmit={handleCommissionSubmit} className="lg:col-span-6 space-y-3">
          {submitted ? (
            <div className="p-4 rounded-xl bg-primary/15 border border-primary/50 text-xs text-primary flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Bespoke commissioning dossier opened for {inquiryMarque}. Viewable in your Client Portal.
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="brand-inq-make" className="block text-[10px] uppercase tracking-[0.14em] text-outline mb-1">
                    Target Marque
                  </label>
                  <select
                    id="brand-inq-make"
                    value={inquiryMarque}
                    onChange={(e) => setInquiryMarque(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs text-on-surface"
                  >
                    {marques.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="brand-inq-notes" className="block text-[10px] uppercase tracking-[0.14em] text-outline mb-1">
                    Specification / Build Notes
                  </label>
                  <input
                    id="brand-inq-notes"
                    type="text"
                    value={inquiryNotes}
                    onChange={(e) => setInquiryNotes(e.target.value)}
                    placeholder="e.g. PTS Paint, Carbon Pack, Coupe..."
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs text-on-surface"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em] hover:bg-primary-fixed transition-colors inline-flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Submit Marque Commission Request</span>
              </button>
            </>
          )}
        </form>
      </section>
    </div>
  );
};
