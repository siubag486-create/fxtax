"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { BreakdownSection } from "@/components/BreakdownSection";
import { CalculatorForm } from "@/components/CalculatorForm";
import { ResultCards } from "@/components/ResultCards";
import { Button } from "@/components/ui/button";
import { calculateReturn, DEFAULT_INPUT } from "@/lib/calc";
import type { CalculatorInput, PriceInputCurrency } from "@/types/calculator";

export default function FxReturnPage() {
  const prefersReducedMotion = useReducedMotion();
  const motionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT);
  const [priceCurrency, setPriceCurrency] = useState<PriceInputCurrency>("USD");
  const [result, setResult] = useState(() => calculateReturn(DEFAULT_INPUT));

  const normalizedInput = useMemo<CalculatorInput>(() => {
    if (priceCurrency === "USD") {
      return input;
    }

    const buyFxRate = Number.isFinite(input.buyFxRate) && input.buyFxRate !== 0 ? input.buyFxRate : 0;
    const sellFxRate = Number.isFinite(input.sellFxRate) && input.sellFxRate !== 0 ? input.sellFxRate : 0;

    return {
      ...input,
      buyPriceUsd: buyFxRate === 0 ? 0 : input.buyPriceUsd / buyFxRate,
      sellPriceUsd: sellFxRate === 0 ? 0 : input.sellPriceUsd / sellFxRate
    };
  }, [input, priceCurrency]);

  const handleCalculate = () => {
    setResult(calculateReturn(normalizedInput));
  };

  return (
    <main className="min-h-screen pb-24">
      <section className="mx-auto w-full max-w-7xl px-4 pt-10 md:px-8 md:pt-14">
        <motion.header
          className="mb-12 space-y-5 border-b border-border pb-10"
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
            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                메인으로 돌아가기
              </Link>
            </Button>
          </motion.div>
          <motion.p
            className="display-font text-xs uppercase tracking-[0.28em] text-muted-foreground"
            variants={{
              hidden: { opacity: 0, y: 18 },
              show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: motionEase } }
            }}
          >
            FXRETURN
          </motion.p>
          <motion.h1
            className="display-font text-4xl font-semibold leading-[0.92] md:text-7xl"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: motionEase } }
            }}
          >
            Dollar Profit
            <br />
            To Won Return
          </motion.h1>
          <motion.p
            className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base"
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.58, ease: motionEase } }
            }}
          >
            주가 손익과 환율 영향도를 분리해 원화 기준 최종 수익을 계산합니다.
          </motion.p>
        </motion.header>

        <div className="mt-10 grid gap-7">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: motionEase }}
          >
            <CalculatorForm
              value={input}
              priceCurrency={priceCurrency}
              onPriceCurrencyChange={setPriceCurrency}
              onChange={setInput}
              onCalculate={handleCalculate}
            />
          </motion.div>
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.06, ease: motionEase }}
          >
            <ResultCards result={result} />
          </motion.div>
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.12, ease: motionEase }}
          >
            <BreakdownSection result={result} />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
