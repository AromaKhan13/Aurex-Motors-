import type { InventoryFilters, SortOption, Vehicle } from '../types/aurex';

export const DEFAULT_INVENTORY_FILTERS: InventoryFilters = {
  condition: 'All',
  searchQuery: '',
  makes: [],
  silhouette: 'All',
  minPrice: 0,
  maxPrice: 1200000,
  year: 'All',
  maxMileage: 'All',
  powertrains: [],
  exteriorShades: [],
};

export function filterVehicles(vehicles: Vehicle[], filters: InventoryFilters): Vehicle[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return vehicles.filter((vehicle) => {
    if (!vehicle.syndicatePublic) {
      return false;
    }

    if (filters.condition !== 'All' && vehicle.condition !== filters.condition) {
      return false;
    }

    if (filters.makes.length > 0 && !filters.makes.includes(vehicle.make)) {
      return false;
    }

    if (filters.silhouette !== 'All' && vehicle.silhouette !== filters.silhouette) {
      return false;
    }

    if (vehicle.price < filters.minPrice || vehicle.price > filters.maxPrice) {
      return false;
    }

    if (filters.year !== 'All' && vehicle.year !== filters.year) {
      return false;
    }

    if (filters.maxMileage !== 'All' && vehicle.mileage > filters.maxMileage) {
      return false;
    }

    if (filters.powertrains.length > 0 && !filters.powertrains.includes(vehicle.powertrain)) {
      return false;
    }

    if (filters.exteriorShades.length > 0 && !filters.exteriorShades.includes(vehicle.exteriorShade)) {
      return false;
    }

    if (query) {
      const haystack = [
        vehicle.title,
        vehicle.make,
        vehicle.model,
        vehicle.trim,
        vehicle.stockCode,
        vehicle.exteriorColor,
        String(vehicle.year),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

export function sortVehicles(vehicles: Vehicle[], sortBy: SortOption): Vehicle[] {
  const copy = [...vehicles];
  switch (sortBy) {
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'year-desc':
      return copy.sort((a, b) => b.year - a.year || b.price - a.price);
    case 'mileage-asc':
      return copy.sort((a, b) => a.mileage - b.mileage);
    case 'featured':
    default:
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year);
  }
}

export interface ActiveFilterChip {
  key: string;
  label: string;
  value?: string;
}

export function getActiveFilterChips(filters: InventoryFilters): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (filters.condition !== 'All') {
    chips.push({ key: 'condition', label: `Condition: ${filters.condition}` });
  }
  if (filters.searchQuery.trim()) {
    chips.push({ key: 'searchQuery', label: `Search: "${filters.searchQuery.trim()}"` });
  }
  filters.makes.forEach((make) => {
    chips.push({ key: 'make', label: make, value: make });
  });
  if (filters.silhouette !== 'All') {
    chips.push({ key: 'silhouette', label: `Silhouette: ${filters.silhouette}` });
  }
  if (filters.minPrice > 0 || filters.maxPrice < DEFAULT_INVENTORY_FILTERS.maxPrice) {
    chips.push({
      key: 'price',
      label: `$${Math.round(filters.minPrice / 1000)}k – $${Math.round(filters.maxPrice / 1000)}k`,
    });
  }
  if (filters.year !== 'All') {
    chips.push({ key: 'year', label: `Year: ${filters.year}` });
  }
  if (filters.maxMileage !== 'All') {
    chips.push({
      key: 'maxMileage',
      label: `Max ${filters.maxMileage.toLocaleString()} mi`,
    });
  }
  filters.powertrains.forEach((pt) => {
    chips.push({ key: 'powertrain', label: pt, value: pt });
  });
  filters.exteriorShades.forEach((shade) => {
    chips.push({ key: 'exteriorShade', label: shade, value: shade });
  });

  return chips;
}
