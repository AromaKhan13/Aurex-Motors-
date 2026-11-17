import React from 'react';
import { ArrowLeftRight, Trash2, X } from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import { formatCurrency } from '../utils/finance';
import { AurexImage } from './AurexImage';

export const VehicleCompareModal: React.FC = () => {
  const {
    compareModalOpen,
    setCompareModalOpen,
    comparisonIds,
    vehicles,
    toggleCompare,
    clearCompare,
    navigate,
  } = useAurex();

  if (!compareModalOpen) return null;

  const comparedVehicles = vehicles.filter((v) => comparisonIds.includes(v.id));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Vehicle Comparison Studio"
    >
      <div className="w-full max-w-5xl bg-surface-container border border-outline-variant/60 rounded-xl shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-outline-variant/40 bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ArrowLeftRight className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-lg font-semibold text-on-surface">
              Chassis Telemetry Comparison ({comparedVehicles.length}/3)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {comparedVehicles.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="px-3 py-1.5 rounded text-xs text-on-surface-variant hover:text-error border border-outline-variant/50 inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setCompareModalOpen(false)}
              aria-label="Close comparison"
              className="p-2 rounded text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-x-auto">
          {comparedVehicles.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-on-surface-variant">
                No chassis selected for comparison. Use the compare toggle on any showroom vehicle card.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCompareModalOpen(false);
                  navigate('inventory');
                }}
                className="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em]"
              >
                Browse Inventory
              </button>
            </div>
          ) : (
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/40">
                  <th className="py-3 pr-4 text-xs uppercase tracking-[0.14em] text-outline w-44">
                    Specification
                  </th>
                  {comparedVehicles.map((v) => (
                    <th key={v.id} className="py-3 px-3 align-top">
                      <div className="space-y-2">
                        <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-surface-container-lowest">
                          <AurexImage src={v.image} alt={v.title} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => toggleCompare(v.id)}
                            aria-label={`Remove ${v.title} from comparison`}
                            className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-on-surface hover:text-error"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCompareModalOpen(false);
                            navigate('vehicle-detail', { vehicleId: v.id });
                          }}
                          className="font-serif text-base font-semibold text-on-surface hover:text-primary text-left block"
                        >
                          {v.title}
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-xs">
                {[
                  ['Asking Price', (v: typeof comparedVehicles[number]) => formatCurrency(v.price)],
                  ['Condition', (v: typeof comparedVehicles[number]) => v.condition],
                  ['Mileage', (v: typeof comparedVehicles[number]) => `${v.mileage.toLocaleString()} mi`],
                  ['Engine', (v: typeof comparedVehicles[number]) => v.specs.engine],
                  ['Horsepower', (v: typeof comparedVehicles[number]) => v.specs.horsepower],
                  ['Torque', (v: typeof comparedVehicles[number]) => v.specs.torque],
                  ['0–60 mph', (v: typeof comparedVehicles[number]) => v.specs.zeroToSixty],
                  ['Top Speed', (v: typeof comparedVehicles[number]) => v.specs.topSpeed],
                  ['Drivetrain', (v: typeof comparedVehicles[number]) => v.specs.drivetrain],
                  ['Exterior', (v: typeof comparedVehicles[number]) => v.exteriorColor],
                ].map(([label, getter]) => (
                  <tr key={label as string}>
                    <td className="py-3 pr-4 font-medium text-on-surface-variant">{label as string}</td>
                    {comparedVehicles.map((v) => (
                      <td key={v.id} className="py-3 px-3 font-mono text-on-surface tabular-nums">
                        {(getter as (veh: typeof v) => string)(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
