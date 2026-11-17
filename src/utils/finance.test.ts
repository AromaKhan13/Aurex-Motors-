import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFinanceEstimate,
  evaluatePasswordStrength,
  formatCurrency,
} from './finance';

test('formatCurrency formats USD without decimals by default', () => {
  assert.equal(formatCurrency(398500), '$398,500');
  assert.equal(formatCurrency(0), '$0');
});

test('calculateFinanceEstimate computes standard loan amortization accurately', () => {
  const result = calculateFinanceEstimate({
    mode: 'loan',
    vehiclePrice: 400000,
    downPayment: 80000,
    termMonths: 60,
    aprPercent: 5.9,
  });

  assert.equal(result.financedAmount, 320000);
  assert.equal(result.downPaymentPercent, 20);
  assert.ok(result.monthlyPayment >= 6160 && result.monthlyPayment <= 6180);
  assert.equal(result.totalOutlay, 80000 + result.monthlyPayment * 60);
});

test('calculateFinanceEstimate handles 0% APR loan cleanly', () => {
  const result = calculateFinanceEstimate({
    mode: 'loan',
    vehiclePrice: 240000,
    downPayment: 60000,
    termMonths: 60,
    aprPercent: 0,
  });

  assert.equal(result.monthlyPayment, 3000);
  assert.equal(result.totalInterestOrRent, 0);
  assert.equal(result.totalOutlay, 240000);
});

test('calculateFinanceEstimate computes lease residual and lower monthly payment than loan', () => {
  const loan = calculateFinanceEstimate({
    mode: 'loan',
    vehiclePrice: 398500,
    downPayment: 79700,
    termMonths: 36,
    aprPercent: 5.9,
  });

  const lease = calculateFinanceEstimate({
    mode: 'lease',
    vehiclePrice: 398500,
    downPayment: 79700,
    termMonths: 36,
    aprPercent: 5.9,
  });

  assert.ok(lease.residualValue > 200000);
  assert.ok(lease.monthlyPayment < loan.monthlyPayment);
});

test('evaluatePasswordStrength scores empty, weak, fair, strong, and vault grade', () => {
  assert.equal(evaluatePasswordStrength('').score, 0);
  assert.equal(evaluatePasswordStrength('abc').score, 1);
  assert.equal(evaluatePasswordStrength('Abcdefgh').score, 2);
  assert.equal(evaluatePasswordStrength('Abcdefg1').score, 3);
  assert.equal(evaluatePasswordStrength('AurexVault#2026').score, 4);
});
