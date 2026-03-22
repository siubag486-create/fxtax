export type ValuationInput = {
  currentPrice: number;
  averageBuyPrice: number;
  quantity: number;
  expectedChangePct: number;
};

export type ValuationResult = {
  principal: number;
  currentValue: number;
  currentProfit: number;
  currentReturnPct: number;
  futurePrice: number;
  futureValue: number;
  futureProfit: number;
  profitChange: number;
  expectedChangePct: number;
};

