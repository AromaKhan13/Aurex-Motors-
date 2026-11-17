import React from 'react';
import { ArrowRight, Award, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import { AUREX_ASSETS, SEED_LEADERSHIP } from '../data/seedData';
import { AurexImage } from '../components/AurexImage';

export const AboutPage: React.FC = () => {
  const { navigate } = useAurex();

  return (
    <div className="space-y-16 pb-12">
      {/* Split Hero */}
      <section className="border-b border-outline-variant/40 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.26em] text-primary font-semibold">
              Beverly Hills • Est. 2011
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-on-surface leading-tight">
              A Legacy Of <span className="text-primary italic font-normal">Exceptional</span> Driving.
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Founded by Alexander Vance in 2011, Aurex Motors was conceived not as a traditional
              dealership, but as a private automotive atelier — bridging factory bespoke
              commissioning with museum-grade provenance auditing.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                ['Est. 2011', 'Beverly Hills Roots'],
                ['$420M+', 'Curated Volume'],
                ['99.8%', 'Client Satisfaction'],
              ].map(([val, lbl]) => (
                <div key={val} className="p-4 rounded-xl bg-surface-container border border-outline-variant/40">
                  <div className="font-serif text-2xl font-semibold text-primary tabular-nums">{val}</div>
                  <div className="text-[11px] text-outline mt-0.5">{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 aspect-[16/10] rounded-2xl overflow-hidden border border-outline-variant/50">
            <AurexImage
              src={AUREX_ASSETS.aboutHero}
              alt="Aurex Motors Beverly Hills Atelier Showroom"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Atelier Story & Signature */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden border border-outline-variant/50">
          <AurexImage
            src={AUREX_ASSETS.aboutStory}
            alt="Alexander Vance inspecting chassis in Beverly Hills Salon"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
            Our Philosophy
          </span>
          <h2 className="font-serif text-3xl font-semibold text-on-surface">
            Every Chassis Curated As Rolling Architecture
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Collectors do not acquire rare motorcars on impulse alone — they invest in engineering
            pedigree, undocumented originality, and an ownership journey free of friction. Our
            technicians verify micrometer paint depths and ECU telemetry before a single vehicle
            enters our subterranean vault.
          </p>
          <blockquote className="p-5 rounded-xl bg-surface-container border-l-4 border-primary italic font-serif text-base text-on-surface">
            “True luxury is effortless certainty — knowing the provenance of every bolt, and the
            discretion of every conversation.”
            <footer className="not-italic font-sans text-xs text-primary mt-2 font-semibold">
              — Alexander Vance, Founder &amp; Managing Partner
            </footer>
          </blockquote>
        </div>
      </section>

      {/* 3 Guiding Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: 'Uncompromising Provenance',
              desc: 'Only single-owner, clean-meter, verified-DME automobiles earn the Aurex Heritage seal.',
            },
            {
              icon: Sparkles,
              title: 'Tailored Commissioning',
              desc: 'Dedicated atelier liaisons coordinating Paint-to-Sample, Tailor Made, and Q by Aston specifications.',
            },
            {
              icon: Compass,
              title: 'Discreet Stewardship',
              desc: 'Subterranean arrival bays, NDA-protected transactions, and nationwide enclosed logistics.',
            },
          ].map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="p-6 rounded-xl bg-surface-container border border-outline-variant/40 space-y-3">
                <Icon className="w-6 h-6 text-primary" />
                <h3 className="font-serif text-xl font-semibold text-on-surface">{p.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Aurex Chronology */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
            Milestones
          </span>
          <h2 className="font-serif text-3xl font-semibold text-on-surface mt-1">
            The Aurex Chronology
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            ['2011', 'Beverly Hills Founding', 'Opened our inaugural six-car private gallery on Prestige Boulevard.'],
            ['2015', '180-Point Cleanroom Lab', 'Commissioned dedicated ultrasonic paint & ECU telemetry diagnostics bay.'],
            ['2019', 'Geneva & Maranello Desk', 'Launched direct European bespoke allocation & Tailor Made concierge services.'],
            ['2024', 'Thermal Track Pavilion', 'Opened private dynamic evaluation suite for Weissach & GT collector clients.'],
          ].map(([yr, title, desc]) => (
            <div key={yr} className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
              <div className="font-mono text-2xl font-semibold text-primary">{yr}</div>
              <div className="font-serif text-lg font-semibold text-on-surface">{title}</div>
              <p className="text-xs text-on-surface-variant leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beverly Hills Salon Bento Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
            742 Prestige Boulevard
          </span>
          <h2 className="font-serif text-3xl font-semibold text-on-surface mt-1">
            The Beverly Hills Salon Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Subterranean Viewing Vault', img: AUREX_ASSETS.salonVault },
            { title: 'Private Handover Bay', img: AUREX_ASSETS.salonHandover },
            { title: 'Material & Trim Studio', img: AUREX_ASSETS.salonTailoring },
            { title: 'Forensic Cleanroom Lab', img: AUREX_ASSETS.salonCleanroom },
          ].map((tile) => (
            <div key={tile.title} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-outline-variant/40 group">
              <AurexImage
                src={tile.img}
                alt={tile.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-xs font-serif font-semibold text-on-surface">
                {tile.title}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Executive Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
            Curatorial Team
          </span>
          <h2 className="font-serif text-3xl font-semibold text-on-surface mt-1">
            Executive Leadership &amp; Curators
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEED_LEADERSHIP.map((member) => (
            <div
              key={member.name}
              className="rounded-xl overflow-hidden bg-surface-container border border-outline-variant/40 flex flex-col"
            >
              <div className="aspect-[4/4] bg-surface-container-lowest overflow-hidden">
                <AurexImage
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-1.5 flex-1">
                <h3 className="font-serif text-lg font-semibold text-on-surface">{member.name}</h3>
                <p className="text-[11px] uppercase tracking-wider text-primary font-medium">
                  {member.role}
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed pt-1">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-surface-container-low border border-primary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold uppercase tracking-[0.16em]">
              <Award className="w-4 h-4" />
              <span>Private Salon Hospitality</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
              Meet Our Curators In Beverly Hills
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('contact')}
            className="px-6 py-3 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em] hover:bg-primary-fixed transition-colors inline-flex items-center gap-2 shrink-0"
          >
            <span>Book Private Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
