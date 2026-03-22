import type { CalculatorInput, CalculatorResult } from "@/types/calculator";

export const DEFAULT_INPUT: CalculatorInput = {
  buyPriceUsd: Number.NaN,
  sellPriceUsd: Number.NaN,
  quantity: Number.NaN,
  buyFxRate: Number.NaN,
  sellFxRate: Number.NaN
};

export function calculateReturn(input: CalculatorInput): CalculatorResult {
  const buyPriceUsd = Number.isFinite(input.buyPriceUsd) ? input.buyPriceUsd : 0;
  const sellPriceUsd = Number.isFinite(input.sellPriceUsd) ? input.sellPriceUsd : 0;
  const quantity = Number.isFinite(input.quantity) ? input.quantity : 0;
  const buyFxRate = Number.isFinite(input.buyFxRate) ? input.buyFxRate : 0;
  const sellFxRate = Number.isFinite(input.sellFxRate) ? input.sellFxRate : 0;

  const buyUSD = buyPriceUsd * quantity;
  const sellUSD = sellPriceUsd * quantity;
  const stockProfitUSD = sellUSD - buyUSD;

  const buyKRW = buyUSD * buyFxRate;
  const sellKRW = sellUSD * sellFxRate;
  const totalProfitKRW = sellKRW - buyKRW;

  const roi = buyKRW === 0 ? 0 : (totalProfitKRW / buyKRW) * 100;

  const stockEffectKRW =
    (sellPriceUsd - buyPriceUsd) * quantity * sellFxRate;
  const fxEffectKRW = (sellFxRate - buyFxRate) * (buyPriceUsd * quantity);
  const reconciliationGapKRW = totalProfitKRW - (stockEffectKRW + fxEffectKRW);

  return {
    buyUSD,
    sellUSD,
    stockProfitUSD,
    buyKRW,
    sellKRW,
    totalProfitKRW,
    roi,
    stockEffectKRW,
    fxEffectKRW,
    reconciliationGapKRW
  };
}
