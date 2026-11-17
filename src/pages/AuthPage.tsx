import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import { AUREX_ASSETS } from '../data/seedData';
import { evaluatePasswordStrength } from '../utils/finance';
import { AurexImage } from '../components/AurexImage';

const INTEREST_OPTIONS = [
  'Exotic & Supercar',
  'Grand Tourers',
  'Rare Collector Editions',
  'Electric Luxury',
];

export const AuthPage: React.FC = () => {
  const { signIn, navigate } = useAurex();
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('j.vance@vancemanagement.com');
  const [loginPassword, setLoginPassword] = useState('AurexVault#2026');

  // Register state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [interests, setInterests] = useState<string[]>(['Exotic & Supercar', 'Grand Tourers']);
  const [formError, setFormError] = useState('');

  const strength = evaluatePasswordStrength(regPassword);

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setFormError('Please enter your registered email and vault passphrase.');
      return;
    }
    setFormError('');
    const isAdmin = loginEmail.toLowerCase().includes('admin') || loginEmail.toLowerCase().includes('sterling');
    signIn({
      role: isAdmin ? 'admin' : 'client',
      userName: isAdmin ? 'Marcus Sterling' : 'Jonathan Vance',
      email: loginEmail.trim(),
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !regEmail.trim() || regPassword.length < 6) {
      setFormError('Please complete your name, email, and a passphrase of at least 6 characters.');
      return;
    }
    setFormError('');
    signIn({
      role: 'client',
      userName: fullName.trim(),
      email: regEmail.trim(),
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-surface">
      {/* Left Prestige Showcase */}
      <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-outline-variant/40">
        <div className="absolute inset-0">
          <AurexImage
            src={AUREX_ASSETS.authBackdrop}
            alt="Aurex Private Vault Showcase"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-surface-container-lowest/55" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Showroom</span>
          </button>

          <div className="w-11 h-11 rounded-full overflow-hidden border border-primary/50 bg-[#0c0c0e] p-0.5 flex items-center justify-center shrink-0">
            <AurexImage src={AUREX_ASSETS.logo} alt="Aurex Motors" className="w-full h-full object-contain rounded-full" />
          </div>
        </div>

        <div className="relative z-10 space-y-6 my-auto py-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/15 border border-primary/40 text-[11px] uppercase tracking-[0.2em] text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Registry Access</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-on-surface leading-tight">
            Your Private Automotive <span className="text-primary italic font-normal">Sanctuary.</span>
          </h1>

          <ul className="space-y-3 text-sm text-on-surface-variant">
            {[
              'Early off-market vault releases before public syndication',
              'Live concierge inquiry tracking & DME telemetry dossiers',
              'Private Beverly Hills & Thermal Club salon reservations',
              'Tailored loan & premier lease portfolio structuring',
            ].map((privilege) => (
              <li key={privilege} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{privilege}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 text-xs text-outline font-mono">
          <Lock className="w-4 h-4 text-primary" />
          <span>256-BIT ENCRYPTED VAULT SESSION • NDA PROTECTED</span>
        </div>
      </div>

      {/* Right Auth Form Column */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-7">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
              Aurex Motors Portal
            </span>
            <h2 className="font-serif text-3xl font-semibold text-on-surface">
              {tab === 'signin' ? 'Sign In to Client Portal' : 'Create Client Account'}
            </h2>
          </div>

          {/* Segmented Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-surface-container border border-outline-variant/40" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'signin'}
              onClick={() => {
                setTab('signin');
                setFormError('');
              }}
              className={`py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                tab === 'signin'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'register'}
              onClick={() => {
                setTab('register');
                setFormError('');
              }}
              className={`py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                tab === 'register'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Create Account
            </button>
          </div>

          {formError && (
            <div className="p-3 rounded-lg bg-error-container/40 border border-error/50 text-xs text-error">
              {formError}
            </div>
          )}

          {tab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="auth-login-email" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                  Client Email
                </label>
                <input
                  id="auth-login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/60 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="auth-login-password" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                  Vault Passphrase
                </label>
                <div className="relative">
                  <input
                    id="auth-login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/60 rounded-lg pl-4 pr-11 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.16em] hover:bg-primary-fixed transition-colors"
              >
                Enter Client Portal
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="auth-reg-name" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                  Full Legal Name
                </label>
                <input
                  id="auth-reg-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jonathan Vance"
                  className="w-full bg-surface-container border border-outline-variant/60 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="auth-reg-email" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                    Email
                  </label>
                  <input
                    id="auth-reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-surface-container border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="auth-reg-phone" className="block text-[11px] uppercase tracking-[0.14em] text-outline mb-1.5">
                    Mobile Phone
                  </label>
                  <input
                    id="auth-reg-phone"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (310) 555-0100"
                    className="w-full bg-surface-container border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="auth-reg-password" className="text-[11px] uppercase tracking-[0.14em] text-outline">
                    Create Passphrase
                  </label>
                  <span data-testid="password-strength-label" className="text-[11px] font-mono text-primary">
                    {strength.label}
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="auth-reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full bg-surface-container border border-outline-variant/60 rounded-lg pl-4 pr-11 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Live 4-segment Password Strength Indicator */}
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      className={`h-1.5 rounded-full transition-colors ${
                        strength.score >= seg
                          ? strength.score >= 3
                            ? 'bg-primary'
                            : 'bg-secondary-container'
                          : 'bg-surface-container-highest'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Fleet Interest Toggles */}
              <div className="space-y-2">
                <span className="block text-[11px] uppercase tracking-[0.14em] text-outline">
                  Primary Fleet Interests
                </span>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((opt) => {
                    const active = interests.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleInterest(opt)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                          active
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-surface-container border-outline-variant/50 text-on-surface-variant'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.16em] hover:bg-primary-fixed transition-colors"
              >
                Register Private Vault Account
              </button>
            </form>
          )}

          {/* Quick Demo Access */}
          <div className="pt-5 border-t border-outline-variant/40 space-y-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-outline text-center">
              Instant Demo Portal Access
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  signIn({
                    role: 'client',
                    userName: 'Jonathan Vance',
                    email: 'j.vance@vancemanagement.com',
                  })
                }
                className="px-4 py-2.5 rounded-lg bg-surface-container border border-primary/40 text-xs font-medium text-primary hover:bg-primary/15 transition-colors inline-flex items-center justify-center gap-2"
              >
                <User className="w-3.5 h-3.5" />
                <span>Demo: Client Portal</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  signIn({
                    role: 'admin',
                    userName: 'Marcus Sterling',
                    email: 'm.sterling@aurexmotors.com',
                  })
                }
                className="px-4 py-2.5 rounded-lg bg-surface-container border border-outline-variant/60 text-xs font-medium text-on-surface hover:border-primary hover:text-primary transition-colors inline-flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>Demo: Executive Admin</span>
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-outline pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary/70" />
              <span>Beverly Hills &amp; Geneva Verified Registry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
