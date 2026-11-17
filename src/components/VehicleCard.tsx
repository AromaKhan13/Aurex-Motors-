import React from 'react';
import { ArrowLeftRight, Bookmark, Calendar, Calculator, Gauge, MapPin, ShieldCheck } from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import type { Vehicle } from '../types/aurex';
import { formatCurrency } from '../utils/finance';
import { AurexImage } from './AurexImage';

interface VehicleCardProps {
  vehicle: Vehicle;
  layout?: 'grid' | 'list';
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, layout = 'grid' }) => {
  const {
    navigate,
    favorites,
    toggleFavorite,
    comparisonIds,
    toggleCompare,
    openFinanceModal,
  } = useAurex();

  const isFav = favorites.includes(vehicle.id);
  const isComparing = comparisonIds.includes(vehicle.id);

  if (layout === 'list') {
    return (
      <article className="group bg-surface-container border border-outline-variant/40 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row">
        <div className="relative md:w-80 lg:w-96 shrink-0 aspect-[16/10] md:aspect-auto bg-surface-container-lowest overflow-hidden">
          <button
            type="button"
            onClick={() => navigate('vehicle-detail', { vehicleId: vehicle.id })}
            className="w-full h-full block text-left"
            aria-label={`Inspect ${vehicle.title}`}
          >
            <AurexImage
              src={vehicle.image}
              alt={vehicle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </button>
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span
              className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] rounded ${
                vehicle.condition === 'Brand New'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest/90 text-primary border border-primary/40'
              }`}
            >
              {vehicle.condition}
            </span>
            {vehicle.badges[0] && (
              <span className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] rounded bg-surface-container-lowest/85 text-on-surface border border-outline-variant/50">
                {vehicle.badges[0]}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-outline uppercase tracking-wider mb-1">
                <span>{vehicle.stockCode}</span>
                <span>•</span>
                <span>{vehicle.make}</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('vehicle-detail', { vehicleId: vehicle.id })}
                className="text-left font-serif text-xl font-semibold text-on-surface group-hover:text-primary transition-colors"
              >
                {vehicle.title}
              </button>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary/80" />
                {vehicle.location}
              </p>
            </div>

            <div className="sm:text-right">
              <div className="text-2xl font-serif font-semibold text-primary tabular-nums">
                {formatCurrency(vehicle.price)}
              </div>
              <button
                type="button"
                onClick={() => openFinanceModal(vehicle)}
                className="text-xs text-on-surface-variant hover:text-primary underline underline-offset-4 mt-0.5 inline-flex items-center gap-1"
              >
                <Calculator className="w-3 h-3" />
                Est. {formatCurrency(vehicle.monthlyLeaseEstimate)}/mo
              </button>
            </div>
          </div>

          <p className="text-sm text-on-surface-variant line-clamp-2">{vehicle.curatorNotes}</p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-outline-variant/30">
            <div className="flex flex-wrap items-center gap-5 text-xs text-on-surface-variant font-mono tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-primary/80" />
                {vehicle.mileage.toLocaleString()} mi
              </span>
              <span>{vehicle.specs.horsepower.split('@')[0].trim()}</span>
              <span>{vehicle.powertrain}</span>
              <span className="inline-flex items-center gap-1 text-primary/90">
                <ShieldCheck className="w-3.5 h-3.5" />
                {vehicle.allocationStatus}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleCompare(vehicle.id)}
                aria-label={`Compare ${vehicle.title}`}
                aria-pressed={isComparing}
                className={`p-2 rounded border transition-colors ${
                  isComparing
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'border-outline-variant/60 text-on-surface-variant hover:border-primary/50 hover:text-primary'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(vehicle.id)}
                aria-label={`${isFav ? 'Remove' : 'Save'} ${vehicle.title} to favorites`}
                aria-pressed={isFav}
                className={`p-2 rounded border transition-colors ${
                  isFav
                    ? 'bg-primary text-on-primary border-primary'
                    : 'border-outline-variant/60 text-on-surface-variant hover:border-primary/50 hover:text-primary'
                }`}
              >
                <Bookmark className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
              </button>
              <button
                type="button"
                onClick={() => navigate('vehicle-detail', { vehicleId: vehicle.id })}
                className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold uppercase tracking-[0.14em] rounded hover:bg-primary-fixed transition-colors"
              >
                Inspect Chassis
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-surface-container border border-outline-variant/40 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col">
      <div className="relative aspect-[16/10] bg-surface-container-lowest overflow-hidden">
        <button
          type="button"
          onClick={() => navigate('vehicle-detail', { vehicleId: vehicle.id })}
          className="w-full h-full block text-left"
          aria-label={`View details for ${vehicle.title}`}
        >
          <AurexImage
            src={vehicle.image}
            alt={vehicle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </button>

        <div className="absolute inset-x-0 top-0 p-3 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap gap-1.5">
            <span
              className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] rounded backdrop-blur-md ${
                vehicle.condition === 'Brand New'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest/90 text-primary border border-primary/40'
              }`}
            >
              {vehicle.condition === 'Brand New' ? 'New Allocation' : 'Certified'}
            </span>
            {vehicle.badges[0] && (
              <span className="px-2 py-1 text-[10px] font-medium uppercase tracking-[0.1em] rounded bg-surface-container-lowest/85 text-on-surface border border-outline-variant/50 backdrop-blur-md">
                {vehicle.badges[0]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={() => toggleCompare(vehicle.id)}
              aria-label={`Compare ${vehicle.title}`}
              aria-pressed={isComparing}
              title="Add to Comparison"
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${
                isComparing
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-lowest/80 text-on-surface border-outline-variant/50 hover:border-primary hover:text-primary'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(vehicle.id)}
              aria-label={`${isFav ? 'Remove' : 'Save'} ${vehicle.title} to favorites`}
              aria-pressed={isFav}
              title={isFav ? 'Saved to Favorites' : 'Save to Favorites'}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${
                isFav
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-lowest/80 text-on-surface border-outline-variant/50 hover:border-primary hover:text-primary'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-2.5 left-3">
          <span className="px-2 py-0.5 rounded bg-surface-container-lowest/85 border border-outline-variant/40 text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
            {vehicle.stockCode}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-outline font-medium mb-1">
            <span>{vehicle.make}</span>
            <span>{vehicle.year}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('vehicle-detail', { vehicleId: vehicle.id })}
            className="text-left font-serif text-lg font-semibold text-on-surface group-hover:text-primary transition-colors leading-snug"
          >
            {vehicle.title}
          </button>
          <p className="text-xs text-on-surface-variant mt-1 truncate">{vehicle.exteriorColor}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded bg-surface-container-low border border-outline-variant/30 text-[11px] font-mono tabular-nums">
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-outline">Mileage</span>
            <span className="text-on-surface font-medium">{vehicle.mileage.toLocaleString()} mi</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-outline">Output</span>
            <span className="text-on-surface font-medium">
              {vehicle.specs.horsepower.split('hp')[0].trim()} hp
            </span>
          </div>
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-outline">0–60</span>
            <span className="text-on-surface font-medium">{vehicle.specs.zeroToSixty}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between gap-2">
          <div>
            <div className="text-xl font-serif font-semibold text-primary tabular-nums">
              {formatCurrency(vehicle.price)}
            </div>
            <button
              type="button"
              onClick={() => openFinanceModal(vehicle)}
              className="text-[11px] text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <Calculator className="w-3 h-3" />
              Est. {formatCurrency(vehicle.monthlyLeaseEstimate)}/mo
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate('vehicle-detail', { vehicleId: vehicle.id })}
              className="px-3.5 py-2 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface text-xs font-semibold uppercase tracking-[0.12em] border border-outline-variant/50 hover:border-primary transition-colors"
            >
              View
            </button>
            <button
              type="button"
              onClick={() => navigate('contact', { vehicleId: vehicle.id })}
              aria-label={`Schedule viewing for ${vehicle.title}`}
              title="Book Private Salon Viewing"
              className="p-2 rounded bg-primary/15 text-primary border border-primary/40 hover:bg-primary hover:text-on-primary transition-colors"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
