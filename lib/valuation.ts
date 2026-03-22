import type { ValuationInput, ValuationResult } from "@/types/valuation";

export const DEFAULT_VALUATION_INPUT: ValuationInput = {
  currentPrice: Number.NaN,
  averageBuyPrice: Number.NaN,
  quantity: Number.NaN,
  expectedChangePct: 0
};

export function calculateValuation(input: ValuationInput): ValuationResult {
  const currentPrice = Number.isFinite(input.currentPrice) && input.currentPrice > 0 ? input.currentPrice : 0;
  const averageBuyPrice = Number.isFinite(input.averageBuyPrice) && input.averageBuyPrice > 0 ? input.averageBuyPrice : 0;
  const quantity = Number.isFinite(input.quantity) && input.quantity > 0 ? input.quantity : 0;
  const rawExpectedChangePct = Number.isFinite(input.expectedChangePct) ? input.expectedChangePct : 0;
  const expectedChangePct = Math.max(-100, Math.min(rawExpectedChangePct, 500));

  const principal = averageBuyPrice * quantity;
  const currentValue = currentPrice * quantity;
  const currentProfit = (currentPrice - averageBuyPrice) * quantity;
  const currentReturnPct = averageBuyPrice === 0 ? 0 : ((currentPrice - averageBuyPrice) / averageBuyPrice) * 100;

  const futurePrice = currentPrice * (1 + expectedChangePct / 100);
  const futureValue = futurePrice * quantity;
  const futureProfit = (futurePrice - averageBuyPrice) * quantity;
  const profitChange = futureProfit - currentProfit;

  return {
    principal,
    currentValue,
    currentProfit,
    currentReturnPct,
    futurePrice,
    futureValue,
    futureProfit,
    profitChange,
    expectedChangePct
  };
}
