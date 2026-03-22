export type TaxInput = {
  annualNetGainKrw: number;
};

export type TaxResult = {
  annualNetGainKrw: number;
  basicDeductionKrw: number;
  taxableBaseKrw: number;
  transferIncomeTaxKrw: number;
  localIncomeTaxKrw: number;
  totalTaxRate: number;
  estimatedTaxKrw: number;
};
