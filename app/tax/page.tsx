"use client";

import Link from "next/link";
import { ArrowLeft, Calculator, TrendingUp } from "lucide-react";
import { useMemo, useState, type ChangeEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatKrw, getProfitTone } from "@/lib/format";
import { calculateTransferTax } from "@/lib/tax";

export default function TaxPage() {
  const prefersReducedMotion = useReducedMotion();
  const motionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const [annualNetGainKrw, setAnnualNetGainKrw] = useState<number>(Number.NaN);

  const normalizedInput = useMemo(() => {
    if (!Number.isFinite(annualNetGainKrw)) return 0;
    return annualNetGainKrw;
  }, [annualNetGainKrw]);

  const [result, setResult] = useState(() => calculateTransferTax({ annualNetGainKrw: 0 }));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setAnnualNetGainKrw(Number.NaN);
      return;
    }

    const value = Number(event.target.value);
    setAnnualNetGainKrw(Number.isNaN(value) ? Number.NaN : value);
  };

  const handleCalculate = () => {
    setResult(calculateTransferTax({ annualNetGainKrw: normalizedInput }));
  };

  const taxTone = result.estimatedTaxKrw > 0 ? "text-danger" : getProfitTone(0);

  const steps = [
    {
      num: 1,
      label: "연간 순이익",
      value: formatKrw(result.annualNetGainKrw)
    },
    {
      num: 2,
      label: "기본공제",
      value: formatKrw(result.basicDeductionKrw)
    },
    {
      num: 3,
      label: "과세표준 = max(연간 순이익 - 2,500,000)",
      value: formatKrw(result.taxableBaseKrw)
    },
    {
      num: 4,
      label: "세율 = 22% (양도소득세 20% + 지방소득세: 양도소득세의 10%)",
      value: "22%"
    },
    {
      num: 5,
      label: "양도소득세 = 과세표준 × 20%",
      value: formatKrw(result.transferIncomeTaxKrw)
    },
    {
      num: 6,
      label: "지방소득세 = 양도소득세 × 10%",
      value: formatKrw(result.localIncomeTaxKrw)
    },
    {
      num: 7,
      label: "납부세액(예상) = 양도소득세 + 지방소득세",
      value: formatKrw(result.estimatedTaxKrw)
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
            TAX
          </motion.p>
          <motion.h1
            className="display-font text-3xl font-semibold leading-tight md:text-6xl"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: motionEase } }
            }}
          >
            해외주식 양도소득세 계산
          </motion.h1>
          <motion.p
            className="text-sm leading-relaxed text-muted-foreground md:text-base"
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.58, ease: motionEase } }
            }}
          >
            입력값은 이번연도 해외주식 연간 실현 양도차익(원화) 1개만 사용합니다.
            <br />
            연간 순이익 = 양도차익 합계 - 양도차손 합계
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
                <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/60">
                  Input
                </CardDescription>
                <CardTitle className="text-xl font-semibold">연간 실현 해외주식 양도차익 (원화)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 px-6 pb-6">
                <div className="space-y-1.5">
                  <Label htmlFor="annualNetGainKrw" className="text-xs font-medium text-muted-foreground">
                    연간 순이익 (KRW)
                  </Label>
                  <Input
                    id="annualNetGainKrw"
                    name="annualNetGainKrw"
                    type="number"
                    inputMode="decimal"
                    value={Number.isFinite(annualNetGainKrw) ? annualNetGainKrw : ""}
                    onChange={handleChange}
                    placeholder="예: 12000000"
                    className="border-border/50 bg-muted/20 placeholder:text-muted-foreground/30 focus-visible:border-primary/60 focus-visible:ring-primary/20"
                  />
                </div>

                {/* Current input display */}
                <div className="rounded-lg border border-border/40 bg-muted/10 px-5 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/50">
                    Current Input
                  </p>
                  <p className="display-font mt-2 text-3xl font-black md:text-4xl">
                    {formatKrw(normalizedInput)}
                  </p>
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

          {/* Result Card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.06, ease: motionEase }}
          >
            <Card className="relative overflow-hidden border-border/50">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-danger/5 via-transparent to-transparent" />
              <div className="h-[2px] bg-gradient-to-r from-transparent via-danger/40 to-transparent" />
              <CardHeader className="pb-3 pt-6">
                <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/60">
                  Result
                </CardDescription>
                <CardTitle className="text-lg font-medium text-muted-foreground">
                  예상 납부세액 (지방소득세 포함)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <p className={`display-font text-5xl font-black md:text-6xl ${taxTone}`}>
                  {formatKrw(result.estimatedTaxKrw)}
                </p>
                <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                  <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  <p className="text-sm leading-relaxed text-foreground/80">
                    본 계산 결과는 예상치이며 최종 납부세액은 세법 규정 및 계산 방식에 따라 달라질 수 있습니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Calculation steps */}
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
                  계산 과정 100% 공개
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-0 overflow-hidden rounded-lg border border-border/50">
                  {steps.map((step, i) => (
                    <div
                      key={step.num}
                      className={`flex items-center gap-4 px-4 py-3 text-sm ${
                        i % 2 === 0 ? "bg-muted/15" : "bg-transparent"
                      } ${i < steps.length - 1 ? "border-b border-border/30" : ""} ${
                        i === steps.length - 1 ? "font-semibold" : ""
                      }`}
                    >
                      {/* Step number badge */}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                        {step.num}
                      </span>
                      <span className={`flex-1 ${i === steps.length - 1 ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                      <strong className={`shrink-0 font-mono ${i === steps.length - 1 ? "text-foreground" : ""}`}>
                        {step.value}
                      </strong>
                    </div>
                  ))}
                </div>

                {result.annualNetGainKrw <= 0 ? (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-border/40 bg-muted/10 px-4 py-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">입력값이 0 이하이므로 납부세액은 0원입니다.</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>

          {/* Exclusions card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.18, ease: motionEase }}
          >
            <Card className="border-border/30 bg-muted/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  이 페이지에서 제외되는 항목
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-6 pb-5 text-sm text-muted-foreground/70">
                <p>
                  수수료/필요경비/이월공제/국내주식 손익통산/기타 파생 과세/배당소득/금융투자소득공제 항목은 이 페이지에서 계산하지 않습니다.
                </p>
                <p>결과는 사용자가 입력한 연간 실현 해외주식 양도차익(원화) 값에만 의존합니다.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
