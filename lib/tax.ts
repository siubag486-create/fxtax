import type { TaxInput, TaxResult } from "@/types/tax";

export const BASIC_DEDUCTION_KRW = 2_500_000;
export const TRANSFER_INCOME_TAX_RATE = 0.2;
export const LOCAL_INCOME_TAX_RATE = 0.1;
export const TOTAL_TAX_RATE = TRANSFER_INCOME_TAX_RATE + TRANSFER_INCOME_TAX_RATE * LOCAL_INCOME_TAX_RATE;

export function calculateTransferTax(input: TaxInput): TaxResult {
  const annualNetGainKrw = Number.isFinite(input.annualNetGainKrw) ? input.annualNetGainKrw : 0;
  const taxableBaseKrw = Math.max(annualNetGainKrw - BASIC_DEDUCTION_KRW, 0);
  const transferIncomeTaxKrw = taxableBaseKrw * TRANSFER_INCOME_TAX_RATE;
  const localIncomeTaxKrw = transferIncomeTaxKrw * LOCAL_INCOME_TAX_RATE;
  const estimatedTaxKrw = transferIncomeTaxKrw + localIncomeTaxKrw;

  return {
    annualNetGainKrw,
    basicDeductionKrw: BASIC_DEDUCTION_KRW,
    taxableBaseKrw,
    transferIncomeTaxKrw,
    localIncomeTaxKrw,
    totalTaxRate: TOTAL_TAX_RATE,
    estimatedTaxKrw
  };
}
