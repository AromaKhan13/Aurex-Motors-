import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import { AUREX_ASSETS } from '../data/seedData';
import { AurexImage } from './AurexImage';

export const Footer: React.FC = () => {
  const { navigate, pushToast } = useAurex();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    pushToast('Private Dispatch Subscribed', `${newsletterEmail} added to allocation alerts.`, 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/40 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-primary/40 bg-[#0c0c0e] p-0.5 flex items-center justify-center shrink-0">
                <AurexImage
                  src={AUREX_ASSETS.logo}
                  alt="Aurex Motors"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <div className="font-serif text-lg font-semibold tracking-wide text-on-surface">
                  AUREX MOTORS
                </div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-primary">
                  Drive Your Dream. Own the Experience.
                </div>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm">
              Curators of rare supercars, factory bespoke commissions, and 180-point certified
              collector automobiles in the heart of Beverly Hills.
            </p>
            <div className="space-y-1.5 text-xs text-on-surface-variant">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                742 Prestige Boulevard, Beverly Hills, CA 90210
              </p>
              <p className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-primary" />
                +1 (310) 555-0199 • Private Salon Line
              </p>
            </div>
          </div>

          {/* Showroom */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-primary">
              Showroom
            </h3>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li>
                <button type="button" onClick={() => navigate('inventory')} className="hover:text-primary transition-colors">
                  Master Inventory
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('new-cars')} className="hover:text-primary transition-colors">
                  New Allocations
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('used-cars')} className="hover:text-primary transition-colors">
                  Certified Pre-Owned
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('brands')} className="hover:text-primary transition-colors">
                  Partner Marques
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-primary">
              Atelier
            </h3>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li>
                <button type="button" onClick={() => navigate('about')} className="hover:text-primary transition-colors">
                  Our Heritage
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('contact')} className="hover:text-primary transition-colors">
                  Private Concierge
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('auth')} className="hover:text-primary transition-colors">
                  Client Portal
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('admin-portal')} className="hover:text-primary transition-colors">
                  Executive Console
                </button>
              </li>
            </ul>
          </div>

          {/* Private Dispatch */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-primary">
              Private Allocation Dispatch
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Receive off-market vault releases and Pebble Beach preview invitations prior to public syndication.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/40 text-xs text-primary flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You are registered for private vault dispatches.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <label htmlFor="footer-dispatch-email" className="sr-only">
                  Email address for private dispatch
                </label>
                <input
                  id="footer-dispatch-email"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="client@privatevault.com"
                  className="flex-1 bg-surface-container border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to Private Dispatch"
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider hover:bg-primary-fixed transition-colors inline-flex items-center gap-1"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-outline">
              <ShieldCheck className="w-3.5 h-3.5 text-primary/80" />
              <span>180-Point Certified • Nationwide Enclosed Transport</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-outline">
          <p>© {new Date().getFullYear()} Aurex Motors LLC • Beverly Hills &amp; Geneva. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button type="button" onClick={() => navigate('about')} className="hover:text-on-surface">
              Provenance Standard
            </button>
            <button type="button" onClick={() => navigate('contact')} className="hover:text-on-surface">
              NDA &amp; Privacy Protocol
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
