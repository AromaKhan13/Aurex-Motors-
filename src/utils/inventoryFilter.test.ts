import test from 'node:test';
import assert from 'node:assert/strict';
import { SEED_VEHICLES } from '../data/seedData';
import {
  DEFAULT_INVENTORY_FILTERS,
  filterVehicles,
  getActiveFilterChips,
  sortVehicles,
} from './inventoryFilter';

test('filterVehicles returns all public vehicles with default filters', () => {
  const res = filterVehicles(SEED_VEHICLES, DEFAULT_INVENTORY_FILTERS);
  assert.equal(res.length, SEED_VEHICLES.length);
});

test('filterVehicles narrows by make, condition, and search query', () => {
  const porscheNew = filterVehicles(SEED_VEHICLES, {
    ...DEFAULT_INVENTORY_FILTERS,
    makes: ['Porsche'],
    condition: 'Brand New',
  });
  assert.ok(porscheNew.length >= 1);
  assert.ok(porscheNew.every((v) => v.make === 'Porsche' && v.condition === 'Brand New'));

  const gt3Search = filterVehicles(SEED_VEHICLES, {
    ...DEFAULT_INVENTORY_FILTERS,
    searchQuery: 'Weissach',
  });
  assert.equal(gt3Search.length, 1);
  assert.equal(gt3Search[0].id, 'veh-gt3rs-weissach');
});

test('filterVehicles respects maxMileage and price ceiling', () => {
  const lowMile = filterVehicles(SEED_VEHICLES, {
    ...DEFAULT_INVENTORY_FILTERS,
    maxMileage: 500,
    maxPrice: 400000,
  });
  assert.ok(lowMile.length >= 1);
  assert.ok(lowMile.every((v) => v.mileage <= 500 && v.price <= 400000));
});

test('sortVehicles orders by price descending and mileage ascending', () => {
  const byPriceDesc = sortVehicles(SEED_VEHICLES, 'price-desc');
  assert.ok(byPriceDesc[0].price >= byPriceDesc[1].price);

  const byMileageAsc = sortVehicles(SEED_VEHICLES, 'mileage-asc');
  assert.ok(byMileageAsc[0].mileage <= byMileageAsc[1].mileage);
});

test('getActiveFilterChips reflects active criteria accurately', () => {
  const chips = getActiveFilterChips({
    ...DEFAULT_INVENTORY_FILTERS,
    condition: 'Certified Pre-Owned',
    makes: ['Ferrari', 'Porsche'],
    maxMileage: 5000,
  });
  assert.equal(chips.length, 4);
  assert.ok(chips.some((c) => c.label === 'Ferrari'));
  assert.ok(chips.some((c) => c.label === 'Max 5,000 mi'));
});
