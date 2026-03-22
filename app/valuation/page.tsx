"use client";

import Link from "next/link";
import { ArrowLeft, Calculator, TrendingUp } from "lucide-react";
import { useMemo, useState, type ChangeEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatKrw, formatPercent, formatUsd, getProfitTone } from "@/lib/format";
import { calculateValuation, DEFAULT_VALUATION_INPUT } from "@/lib/valuation";
import type { ValuationInput } from "@/types/valuation";

type PriceInputCurrency = "USD" | "KRW";
const MAX_POSITIVE_CHANGE = 500;
const MAX_NEGATIVE_CHANGE = 100;

const priceFieldMeta = {
  USD: {
    currentLabel: "현재 주식 가격 (USD)",
    averageLabel: "평균 매입 가격 (USD)",
    currentPlaceholder: "예: 115",
    averagePlaceholder: "예: 100",
    step: "0.01"
  },
  KRW: {
    currentLabel: "현재 주식 가격 (KRW)",
    averageLabel: "평균 매입 가격 (KRW)",
    currentPlaceholder: "예: 161000",
    averagePlaceholder: "예: 140000",
    step: "1"
  }
} as const;

function formatMoney(value: number, currency: PriceInputCurrency): string {
  return currency === "USD" ? formatUsd(value) : formatKrw(value);
}

function formatSignedMoney(value: number, currency: PriceInputCurrency): string {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}${formatMoney(Math.abs(value), currency)}`;
}

export default function ValuationPage() {
  const prefersReducedMotion = useReducedMotion();
  const motionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const [input, setInput] = useState<ValuationInput>(DEFAULT_VALUATION_INPUT);
  const [priceCurrency, setPriceCurrency] = useState<PriceInputCurrency>("USD");
  const [expectedSign, setExpectedSign] = useState<1 | -1>(1);
  const [result, setResult] = useState(() => calculateValuation(DEFAULT_VALUATION_INPUT));

  const normalizedInput = useMemo<ValuationInput>(() => {
    return {
      currentPrice: Number.isFinite(input.currentPrice) ? input.currentPrice : 0,
      averageBuyPrice: Number.isFinite(input.averageBuyPrice) ? input.averageBuyPrice : 0,
      quantity: Number.isFinite(input.quantity) ? input.quantity : 0,
      expectedChangePct: Number.isFinite(input.expectedChangePct) ? input.expectedChangePct : 0
    };
  }, [input]);

  const handleNumberInput =
    (field: "currentPrice" | "averageBuyPrice" | "quantity") => (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.value === "") {
        setInput((prev) => ({ ...prev, [field]: Number.NaN }));
        return;
      }
      const parsed = Number(event.target.value);
      setInput((prev) => ({ ...prev, [field]: Number.isNaN(parsed) ? Number.NaN : parsed }));
    };

  const handleExpectedSign = (sign: 1 | -1) => {
    setExpectedSign(sign);
    setInput((prev) => {
      const magnitude = Number.isFinite(prev.expectedChangePct) ? Math.abs(prev.expectedChangePct) : 0;
      const bounded = sign > 0 ? Math.min(magnitude, MAX_POSITIVE_CHANGE) : Math.min(magnitude, MAX_NEGATIVE_CHANGE);
      return { ...prev, expectedChangePct: bounded * sign };
    });
  };

  const handleExpectedMagnitudeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.trim();
    if (raw === "" || raw === "+" || raw === "-") {
      setInput((prev) => ({ ...prev, expectedChangePct: Number.NaN }));
      return;
    }

    const sign: 1 | -1 = raw.startsWith("-") ? -1 : raw.startsWith("+") ? 1 : expectedSign;
    const numericRaw = raw.replace(/[^\d.]/g, "");
    const parsed = Number(numericRaw);
    if (Number.isNaN(parsed)) {
      setInput((prev) => ({ ...prev, expectedChangePct: Number.NaN }));
      return;
    }

    const bounded = sign > 0 ? Math.min(Math.abs(parsed), MAX_POSITIVE_CHANGE) : Math.min(Math.abs(parsed), MAX_NEGATIVE_CHANGE);
    setExpectedSign(sign);
    setInput((prev) => ({ ...prev, expectedChangePct: bounded * sign }));
  };

  const handleSlider = (event: ChangeEvent<HTMLInputElement>) => {
    const parsed = Number(event.target.value);
    if (Number.isNaN(parsed)) return;
    const bounded = Math.max(-MAX_NEGATIVE_CHANGE, Math.min(parsed, MAX_POSITIVE_CHANGE));
    const sign: 1 | -1 = bounded < 0 ? -1 : 1;
    setExpectedSign(sign);
    setInput((prev) => ({ ...prev, expectedChangePct: bounded }));
  };

  const handleCalculate = () => {
    setResult(calculateValuation(normalizedInput));
  };

  const futureReturnPct = result.principal === 0 ? 0 : (result.futureProfit / result.principal) * 100;
  const futureProfitTone = getProfitTone(result.futureProfit);
  const currentProfitTone = getProfitTone(result.currentProfit);
  const currentReturnTone = getProfitTone(result.currentReturnPct);
  const profitChangeTone = getProfitTone(result.profitChange);
  const futureReturnTone = getProfitTone(futureReturnPct);
  const futureValueTone =
    result.futureValue > result.principal ? "text-success" : result.futureValue < result.principal ? "text-danger" : "text-foreground";
  const priceMeta = priceFieldMeta[priceCurrency];
  const expectedDisplay = Number.isFinite(input.expectedChangePct)
    ? `${expectedSign > 0 ? "+" : "-"}${Math.abs(input.expectedChangePct)}`
    : "";

  const resultRows = [
    {
      label: "원금 (평균매입가 × 보유수량)",
      value: formatMoney(result.principal, priceCurrency),
      tone: "text-foreground"
    },
    {
      label: "현재 평가금액 (현재가 × 보유수량)",
      value: formatMoney(result.currentValue, priceCurrency),
      tone: "text-foreground"
    },
    {
      label: "현재 손익",
      value: formatSignedMoney(result.currentProfit, priceCurrency),
      tone: currentProfitTone
    },
    {
      label: "현재 수익률",
      value: formatPercent(result.currentReturnPct),
      tone: currentReturnTone
    },
    {
      label: "미래 예상 가격",
      value: formatMoney(result.futurePrice, priceCurrency),
      tone: "text-foreground"
    },
    {
      label: "미래 예상 손익",
      value: formatSignedMoney(result.futureProfit, priceCurrency),
      tone: futureProfitTone
    },
    {
      label: "추가 손익 변화량 (미래 예상 손익 - 현재 손익)",
      value: formatSignedMoney(result.profitChange, priceCurrency),
      tone: profitChangeTone
    },
    {
      label: "미래 예상 수익률",
      value: formatPercent(futureReturnPct),
      tone: futureReturnTone,
      highlight: true
    }
  ];

  return (
    <main className="min-h-screen pb-24">
      <section className="mx-auto w-full max-w-7xl px-4 pt-10 md:px-8 md:pt-14">
        <motion.header
          className="mb-10 space-y-5 border-b border-border/50 pb-10"
          initial={prefersReducedMotion ? false : "hidden"}
          animate={prefersReducedMotion ? undefined : "show"}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.09,
                delayChildren: 0.06
              }
            }
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 18 },
              show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: motionEase } }
            }}
          >
            <Button asChild variant="outline" className="gap-2 border-border/50 hover:border-border">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                메인으로 돌아가기
              </Link>
            </Button>
          </motion.div>
          <motion.p
            className="display-font text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground/60"
            variants={{
              hidden: { opacity: 0, y: 18 },
              show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: motionEase } }
            }}
          >
            SIMULATOR
          </motion.p>
          <motion.h1
            className="display-font text-3xl font-semibold leading-tight md:text-6xl"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: motionEase } }
            }}
          >
            해외주식 평가금액 시뮬레이터
          </motion.h1>
          <motion.p
            className="text-sm leading-relaxed text-muted-foreground md:text-base"
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.58, ease: motionEase } }
            }}
          >
            현재가 기준으로 현재 평가금액과 수익률을 계산하고, 예상 변동폭 적용 후 미래 평가금액도 시뮬레이션합니다.
          </motion.p>
        </motion.header>

        <div className="mt-10 grid gap-7">
          {/* Input Card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: motionEase }}
          >
            <Card className="overflow-hidden border-border/50 bg-card/90">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
              <CardHeader className="pb-4 pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/60">
                      Input
                    </CardDescription>
                    <CardTitle className="text-xl font-semibold">현재 상태 + 예상 변동폭 입력</CardTitle>
                  </div>

                  {/* Currency toggle - segmented control */}
                  <div className="mt-1 flex shrink-0 items-center rounded-lg border border-border/60 bg-muted/30 p-1">
                    <Label className="sr-only">가격 입력 통화</Label>
                    {(["USD", "KRW"] as PriceInputCurrency[]).map((currency) => (
                      <button
                        key={currency}
                        type="button"
                        onClick={() => setPriceCurrency(currency)}
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

              <CardContent className="space-y-6 px-6 pb-6">
                {/* Price + quantity inputs */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/50">
                      가격 정보
                    </span>
                    <span className="h-px flex-1 bg-border/40" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="currentPrice" className="text-xs font-medium text-muted-foreground">
                        {priceMeta.currentLabel}
                      </Label>
                      <Input
                        id="currentPrice"
                        name="currentPrice"
                        type="number"
                        inputMode="decimal"
                        step={priceMeta.step}
                        value={Number.isFinite(input.currentPrice) ? input.currentPrice : ""}
                        onChange={handleNumberInput("currentPrice")}
                        placeholder={priceMeta.currentPlaceholder}
                        className="border-border/50 bg-muted/20 placeholder:text-muted-foreground/30 focus-visible:border-primary/60 focus-visible:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="averageBuyPrice" className="text-xs font-medium text-muted-foreground">
                        {priceMeta.averageLabel}
                      </Label>
                      <Input
                        id="averageBuyPrice"
                        name="averageBuyPrice"
                        type="number"
                        inputMode="decimal"
                        step={priceMeta.step}
                        value={Number.isFinite(input.averageBuyPrice) ? input.averageBuyPrice : ""}
                        onChange={handleNumberInput("averageBuyPrice")}
                        placeholder={priceMeta.averagePlaceholder}
                        className="border-border/50 bg-muted/20 placeholder:text-muted-foreground/30 focus-visible:border-primary/60 focus-visible:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="quantity" className="text-xs font-medium text-muted-foreground">
                        보유 수량
                      </Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        value={Number.isFinite(input.quantity) ? input.quantity : ""}
                        onChange={handleNumberInput("quantity")}
                        placeholder="예: 20"
                        className="border-border/50 bg-muted/20 placeholder:text-muted-foreground/30 focus-visible:border-primary/60 focus-visible:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Expected change input */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/50">
                      예상 변동폭
                    </span>
                    <span className="h-px flex-1 bg-border/40" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="expectedChangePct" className="text-xs font-medium text-muted-foreground">
                        예상 변동폭 (%)
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="flex rounded-md border border-border/50 bg-muted/30 p-0.5">
                          <button
                            type="button"
                            onClick={() => handleExpectedSign(1)}
                            className={`rounded px-3 py-1.5 text-sm font-bold transition-all duration-150 ${
                              expectedSign > 0
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExpectedSign(-1)}
                            className={`rounded px-3 py-1.5 text-sm font-bold transition-all duration-150 ${
                              expectedSign < 0
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            -
                          </button>
                        </div>
                        <Input
                          id="expectedChangePct"
                          name="expectedChangePct"
                          type="text"
                          inputMode="decimal"
                          value={expectedDisplay}
                          onChange={handleExpectedMagnitudeInput}
                          placeholder="+20"
                          className="border-border/50 bg-muted/20 placeholder:text-muted-foreground/30 focus-visible:border-primary/60 focus-visible:ring-primary/20"
                        />
                      </div>
                    </div>

                    {/* Slider section */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">예상 변동폭 슬라이더</Label>
                        <span className="text-xs font-semibold text-primary">
                          {formatPercent(Number.isFinite(input.expectedChangePct) ? input.expectedChangePct : 0)}
                        </span>
                      </div>
                      <div className="rounded-lg border border-border/40 bg-muted/10 px-4 py-3">
                        <Input
                          type="range"
                          min="-100"
                          max="500"
                          step="0.5"
                          value={Number.isFinite(input.expectedChangePct) ? input.expectedChangePct : 0}
                          onChange={handleSlider}
                          className="h-1.5 w-full cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border/40 pt-4">
                  <p className="text-xs leading-relaxed text-muted-foreground/60">
                    입력값을 확인한 뒤 계산하기를 누르면 결과가 갱신됩니다.
                  </p>
                  <Button onClick={handleCalculate} className="shrink-0 gap-2 px-6">
                    <TrendingUp className="h-4 w-4" />
                    계산하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Primary KPI Card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.06, ease: motionEase }}
          >
            <Card className="relative overflow-hidden border-border/50">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
              <CardHeader className="pb-3 pt-6">
                <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/60">
                  Primary KPI
                </CardDescription>
                <CardTitle className="text-lg font-medium text-muted-foreground">미래 예상 평가금액</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-6 pb-6">
                <p className={`display-font text-5xl font-black md:text-6xl ${futureValueTone}`}>
                  {formatMoney(result.futureValue, priceCurrency)}
                </p>
                <p className="text-sm text-muted-foreground">
                  현재가 대비 {formatPercent(result.expectedChangePct)} 적용 후 평가금액입니다.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results breakdown */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.12, ease: motionEase }}
          >
            <Card className="overflow-hidden border-border/50 bg-card/80">
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <CardHeader className="pb-4 pt-5">
                <CardTitle className="flex items-center gap-2.5 text-lg">
                  <Calculator className="h-5 w-5 text-primary" />
                  계산 결과
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="overflow-hidden rounded-lg border border-border/50">
                  {resultRows.map((row, i) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${
                        i % 2 === 0 ? "bg-muted/15" : "bg-transparent"
                      } ${i < resultRows.length - 1 ? "border-b border-border/30" : ""} ${
                        row.highlight ? "border-t-2 border-t-primary/20" : ""
                      }`}
                    >
                      <span className={`flex-1 ${row.highlight ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {row.label}
                      </span>
                      <strong className={`shrink-0 font-mono ${row.tone} ${row.highlight ? "text-base" : ""}`}>
                        {row.value}
                      </strong>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
