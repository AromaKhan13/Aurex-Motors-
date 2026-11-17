import React, { useEffect, useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import type { FinanceMode } from '../types/aurex';
import { calculateFinanceEstimate, formatCurrency } from '../utils/finance';
import { AurexImage } from './AurexImage';

const TERM_OPTIONS = [24, 36, 48, 60, 72];
const DOWN_PERCENT_PRESETS = [10, 20, 30, 50];

export const FinanceCalculatorModal: React.FC = () => {
  const {
    financeModalVehicle,
    closeFinanceModal,
    submitInquiry,
    clientProfile,
  } = useAurex();

  const [mode, setMode] = useState<FinanceMode>('loan');
  const [vehiclePrice, setVehiclePrice] = useState<number>(398500);
  const [downPayment, setDownPayment] = useState<number>(79700);
  const [termMonths, setTermMonths] = useState<number>(60);
  const [aprPercent, setAprPercent] = useState<number>(5.9);
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  useEffect(() => {
    if (financeModalVehicle) {
      setVehiclePrice(financeModalVehicle.price);
      setDownPayment(Math.round(financeModalVehicle.price * 0.2));
      setTermMonths(60);
      setAprPercent(5.9);
      setMode('loan');
      setConsultSubmitted(false);
    }
  }, [financeModalVehicle]);

  if (!financeModalVehicle) {
    return null;
  }

  const estimate = calculateFinanceEstimate({
    mode,
    vehiclePrice,
    downPayment,
    termMonths,
    aprPercent,
  });

  const handleReset = () => {
    setVehiclePrice(financeModalVehicle.price);
    setDownPayment(Math.round(financeModalVehicle.price * 0.2));
    setTermMonths(60);
    setAprPercent(5.9);
    setConsultSubmitted(false);
  };

  const handleRequestConsultation = () => {
    submitInquiry({
      clientName: clientProfile.name,
      clientEmail: clientProfile.email,
      clientPhone: clientProfile.phone,
      vehicleId: financeModalVehicle.id,
      vehicleTitle: financeModalVehicle.title,
      inquiryType: 'Finance Consultation',
      preferredContact: clientProfile.preferredContact,
      notes: `${mode === 'loan' ? 'Bespoke Loan' : 'Premier Lease'} structuring: ${formatCurrency(
        vehiclePrice
      )} agreed price, ${formatCurrency(downPayment)} (${estimate.downPaymentPercent}%) down, ${termMonths}m @ ${aprPercent}% APR — Est. ${formatCurrency(
        estimate.monthlyPayment
      )}/mo.`,
    });
    setConsultSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Vehicle Loan and Lease Finance Calculator"
    >
      <div className="w-full max-w-4xl bg-surface-container border border-outline-variant/60 rounded-xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/40 bg-surface-container-low flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center text-primary">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-semibold text-on-surface">
                Aurex Bespoke Finance Atelier
              </h2>
              <p className="text-xs text-on-surface-variant">
                {financeModalVehicle.title} • Stock #{financeModalVehicle.stockCode}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeFinanceModal}
            aria-label="Close finance calculator"
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Controls */}
          <div className="lg:col-span-7 p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-outline-variant/40">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-lg bg-surface-container-lowest border border-outline-variant/40">
              <button
                type="button"
                onClick={() => setMode('loan')}
                className={`py-2.5 text-xs font-semibold uppercase tracking-[0.14em] rounded-md transition-colors ${
                  mode === 'loan'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Bespoke Loan
              </button>
              <button
                type="button"
                onClick={() => setMode('lease')}
                className={`py-2.5 text-xs font-semibold uppercase tracking-[0.14em] rounded-md transition-colors ${
                  mode === 'lease'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Premier Lease
              </button>
            </div>

            {/* Agreed Price */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="calc-vehicle-price" className="text-xs uppercase tracking-[0.14em] text-on-surface-variant font-medium">
                  Agreed Vehicle Price
                </label>
                <span className="text-xs font-mono text-outline">
                  MSRP {formatCurrency(financeModalVehicle.msrp ?? financeModalVehicle.price)}
                </span>
              </div>
              <input
                id="calc-vehicle-price"
                type="number"
                min={25000}
                step={500}
                value={vehiclePrice}
                onChange={(e) => {
                  const nextPrice = Math.max(0, Number(e.target.value) || 0);
                  setVehiclePrice(nextPrice);
                  if (downPayment > nextPrice) {
                    setDownPayment(nextPrice);
                  }
                }}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-4 py-2.5 font-mono text-base text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            {/* Down Payment */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="calc-down-payment" className="text-xs uppercase tracking-[0.14em] text-on-surface-variant font-medium">
                  Down Payment / Cap Reduction
                </label>
                <span className="text-xs font-mono text-primary tabular-nums">
                  {formatCurrency(downPayment)} ({estimate.downPaymentPercent}%)
                </span>
              </div>
              <input
                id="calc-down-payment"
                type="range"
                min={0}
                max={Math.max(1000, vehiclePrice)}
                step={1000}
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full aurex-slider"
              />
              <div className="grid grid-cols-4 gap-2">
                {DOWN_PERCENT_PRESETS.map((pct) => {
                  const active = Math.abs(estimate.downPaymentPercent - pct) <= 1;
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDownPayment(Math.round((vehiclePrice * pct) / 100))}
                      className={`py-1.5 rounded text-xs font-mono border transition-colors ${
                        active
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant hover:border-primary/40'
                      }`}
                    >
                      {pct}%
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Term Duration */}
            <div className="space-y-2">
              <span className="block text-xs uppercase tracking-[0.14em] text-on-surface-variant font-medium">
                Term Duration (Months)
              </span>
              <div className="grid grid-cols-5 gap-2">
                {TERM_OPTIONS.map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setTermMonths(months)}
                    className={`py-2 rounded-lg text-xs font-mono border transition-colors ${
                      termMonths === months
                        ? 'bg-primary text-on-primary border-primary font-semibold'
                        : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant hover:border-primary/40'
                    }`}
                  >
                    {months}m
                  </button>
                ))}
              </div>
            </div>

            {/* APR */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-1.5">
                <label htmlFor="calc-apr" className="block text-xs uppercase tracking-[0.14em] text-on-surface-variant font-medium">
                  Estimated APR (%)
                </label>
                <input
                  id="calc-apr"
                  type="number"
                  min={0}
                  max={25}
                  step={0.1}
                  value={aprPercent}
                  onChange={(e) => setAprPercent(Math.max(0, Math.min(25, Number(e.target.value) || 0)))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-4 py-2.5 font-mono text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="mt-6 px-4 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/50 text-xs text-on-surface-variant hover:text-primary inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Right Live Ledger */}
          <div className="lg:col-span-5 p-6 bg-surface-container-low flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container border border-outline-variant/40">
                <AurexImage
                  src={financeModalVehicle.image}
                  alt={financeModalVehicle.title}
                  className="w-16 h-12 rounded object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-primary">{financeModalVehicle.stockCode}</div>
                  <div className="text-xs font-medium text-on-surface truncate">
                    {financeModalVehicle.title}
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-surface-container-lowest border border-primary/30 text-center">
                <span className="text-[11px] uppercase tracking-[0.2em] text-outline block mb-1">
                  Estimated Monthly {mode === 'loan' ? 'Payment' : 'Lease'}
                </span>
                <div
                  data-testid="finance-monthly-payment"
                  className="font-serif text-4xl font-semibold text-primary tabular-nums"
                >
                  {formatCurrency(estimate.monthlyPayment)}
                  <span className="text-base text-on-surface-variant font-sans font-normal">/mo</span>
                </div>
                <span className="text-xs text-on-surface-variant mt-1.5 block font-mono">
                  {termMonths} Months • {aprPercent.toFixed(1)}% APR
                </span>
              </div>

              <dl className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-outline-variant/30">
                  <dt className="text-on-surface-variant">
                    {mode === 'loan' ? 'Principal Financed' : 'Capitalized Depreciation'}
                  </dt>
                  <dd className="font-mono text-on-surface tabular-nums">
                    {formatCurrency(estimate.financedAmount)}
                  </dd>
                </div>
                {mode === 'lease' && (
                  <div className="flex justify-between py-1.5 border-b border-outline-variant/30">
                    <dt className="text-on-surface-variant">Guaranteed Residual Value</dt>
                    <dd className="font-mono text-on-surface tabular-nums">
                      {formatCurrency(estimate.residualValue)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-outline-variant/30">
                  <dt className="text-on-surface-variant">
                    {mode === 'loan' ? 'Est. Total Interest' : 'Est. Rent Charge'}
                  </dt>
                  <dd className="font-mono text-on-surface tabular-nums">
                    {formatCurrency(estimate.totalInterestOrRent)}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-on-surface font-medium">Total Term Outlay</dt>
                  <dd className="font-mono text-primary font-semibold tabular-nums">
                    {formatCurrency(estimate.totalOutlay)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="space-y-2.5">
              {consultSubmitted ? (
                <div className="p-3 rounded-lg bg-primary/15 border border-primary/50 text-xs text-primary flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Finance dossier sent to Marcus Sterling. Viewable in your Client Portal.</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestConsultation}
                  className="w-full py-3 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em] hover:bg-primary-fixed transition-colors"
                >
                  Request Bespoke Finance Consultation
                </button>
              )}

              <a
                href="https://wa.me/13105550199"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-lg bg-surface-container border border-outline-variant/60 text-xs font-medium text-on-surface hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5 text-primary" />
                <span>Message Desk on WhatsApp</span>
              </a>

              <p className="text-[10px] text-outline leading-relaxed flex items-start gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary/70 shrink-0 mt-0.5" />
                <span>
                  Illustrative figures only; excludes local registration &amp; luxury taxes. Subject to
                  tier-1 underwriting approval.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
