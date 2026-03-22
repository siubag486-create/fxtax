export type CalculatorInput = {
  buyPriceUsd: number;
  sellPriceUsd: number;
  quantity: number;
  buyFxRate: number;
  sellFxRate: number;
};

export type PriceInputCurrency = "USD" | "KRW";

export type CalculatorResult = {
  buyUSD: number;
  sellUSD: number;
  stockProfitUSD: number;
  buyKRW: number;
  sellKRW: number;
  totalProfitKRW: number;
  roi: number;
  stockEffectKRW: number;
  fxEffectKRW: number;
  reconciliationGapKRW: number;
};
