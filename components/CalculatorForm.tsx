"use client";

import type { ChangeEvent } from "react";
import { TrendingUp } from "lucide-react";

import type { CalculatorInput, PriceInputCurrency } from "@/types/calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CalculatorFormProps = {
  value: CalculatorInput;
  priceCurrency: PriceInputCurrency;
  onPriceCurrencyChange: (next: PriceInputCurrency) => void;
  onChange: (next: CalculatorInput) => void;
  onCalculate: () => void;
};

const priceFields = {
  USD: [
    { key: "buyPriceUsd", label: "매수 평단가 (USD)", hint: "예: 100", step: "0.01" },
    { key: "sellPriceUsd", label: "매도 가격 (USD)", hint: "예: 115", step: "0.01" }
  ],
  KRW: [
    { key: "buyPriceUsd", label: "매수 평단가 (KRW)", hint: "예: 132000", step: "1" },
    { key: "sellPriceUsd", label: "매도 가격 (KRW)", hint: "예: 157550", step: "1" }
  ]
} satisfies Record<
  PriceInputCurrency,
  Array<{ key: "buyPriceUsd" | "sellPriceUsd"; label: string; hint: string; step: string }>
>;

const commonFields: Array<{ key: keyof CalculatorInput; label: string; hint: string; step: string }> = [
  { key: "quantity", label: "보유 수량 (주)", hint: "예: 10", step: "1" },
  { key: "buyFxRate", label: "매수 평균 환율 (KRW/USD)", hint: "예: 1320", step: "0.01" },
  { key: "sellFxRate", label: "매도 평균 환율 (KRW/USD)", hint: "예: 1370", step: "0.01" }
];

export function CalculatorForm({
  value,
  priceCurrency,
  onPriceCurrencyChange,
  onChange,
  onCalculate
}: CalculatorFormProps) {
  const handleNumberInput =
    (field: keyof CalculatorInput) => (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.value === "") {
        onChange({ ...value, [field]: Number.NaN });
        return;
      }

      const parsed = Number(event.target.value);
      const nextValue = Number.isNaN(parsed) ? Number.NaN : parsed;
      onChange({ ...value, [field]: nextValue });
    };

  return (
    <Card className="overflow-hidden border-border/50 bg-card/90 animate-fade-up">
      {/* Top accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      <CardHeader className="pb-4 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/60">
              Input
            </CardDescription>
            <CardTitle className="display-font text-3xl font-semibold md:text-4xl">
              환율 반영 수익률 분석
            </CardTitle>
          </div>

          {/* Segmented currency toggle */}
          <div className="mt-1 flex shrink-0 items-center gap-0 rounded-lg border border-border/60 bg-muted/30 p-1">
            <Label className="sr-only">가격 입력 통화</Label>
            {(["USD", "KRW"] as PriceInputCurrency[]).map((currency) => (
              <button
                key={currency}
                type="button"
                onClick={() => onPriceCurrencyChange(currency)}
                className={`rounded-md px-4 py-1.5 text-sm font-semibold tracking-wider transition-all duration-200 ${
                  priceCurrency === currency
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {currency}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-7 px-6 pb-6">
        {/* Price fields section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/50">
              가격 정보
            </span>
            <span className="h-px flex-1 bg-border/40" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {priceFields[priceCurrency].map((field) => (
              <div className="space-y-1.5" key={field.key}>
                <Label htmlFor={field.key} className="text-xs font-medium text-muted-foreground">
                  {field.label}
                </Label>
                <Input
                  id={field.key}
                  name={field.key}
                  inputMode="decimal"
                  type="number"
                  min="0"
                  step={field.step}
                  value={Number.isFinite(value[field.key]) ? value[field.key] : ""}
                  onChange={handleNumberInput(field.key)}
                  placeholder={field.hint}
                  className="border-border/50 bg-muted/20 placeholder:text-muted-foreground/30 focus-visible:border-primary/60 focus-visible:ring-primary/20"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Common fields section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/50">
              거래 조건
            </span>
            <span className="h-px flex-1 bg-border/40" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {commonFields.map((field) => (
              <div className="space-y-1.5" key={field.key}>
                <Label htmlFor={field.key} className="text-xs font-medium text-muted-foreground">
                  {field.label}
                </Label>
                <Input
                  id={field.key}
                  name={field.key}
                  inputMode="decimal"
                  type="number"
                  min="0"
                  step={field.step}
                  value={Number.isFinite(value[field.key]) ? value[field.key] : ""}
                  onChange={handleNumberInput(field.key)}
                  placeholder={field.hint}
                  className="border-border/50 bg-muted/20 placeholder:text-muted-foreground/30 focus-visible:border-primary/60 focus-visible:ring-primary/20"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom action row */}
        <div className="flex items-end justify-between gap-4 border-t border-border/40 pt-5">
          <div className="space-y-1 text-xs leading-relaxed text-muted-foreground/60">
            <p>
              계산하기를 누르면 결과가 갱신됩니다.{" "}
              분할매수/분할매도는 평균 환율로 입력하세요.
              {priceCurrency === "KRW" ? " KRW 가격은 환율로 자동 환산됩니다." : ""}
            </p>
            <p>
              이 결과는 평균 환율 기반 예측값이며, 세무 신고용 최종 수치는 거래내역 기준 계산과 다를 수 있습니다.
            </p>
          </div>
          <Button onClick={onCalculate} className="shrink-0 gap-2 px-6">
            <TrendingUp className="h-4 w-4" />
            계산하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
