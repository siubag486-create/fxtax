"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    href: "/fx-return",
    title: "환율 반영 수익률 분석",
    description: "주가 수익과 환율 영향을 분해합니다.",
    cta: "수익 계산 시작",
    art: "profit"
  },
  {
    href: "/tax",
    title: "양도소득세 계산",
    description: "연간 누적 손익 기준 예상 세액",
    cta: "세금 계산 시작",
    art: "tax"
  },
  {
    href: "/valuation",
    title: "평가금액 시뮬레이터",
    description: "현재가/예상 변동률 기반 시나리오",
    cta: "시뮬레이터 시작",
    art: "scenario"
  }
] as const;

function WireArt({ type }: { type: "profit" | "tax" | "scenario" }) {
  const baseImageClass = "object-contain object-center scale-[1.2] -translate-y-[8px]";

  if (type === "profit") {
    return (
        <div className="relative h-[240px] w-[360px] max-w-full bg-black">
        <Image
          src="/rate.png"
          alt="환율 반영 수익률 분석 와이어프레임"
          fill
          quality={100}
          sizes="360px"
          className={baseImageClass}
          priority
        />
      </div>
    );
  }

  if (type === "tax") {
    return (
      <div className="relative h-[240px] w-[360px] max-w-full bg-black">
        <Image
          src="/tax.jpg"
          alt="양도소득세 계산 와이어프레임"
          fill
          quality={100}
          sizes="360px"
          className={baseImageClass}
        />
      </div>
    );
  }

  return (
    <div className="relative h-[240px] w-[360px] max-w-full bg-black">
      <Image
        src="/chart.jpeg"
        alt="평가금액 시뮬레이터 차트"
        fill
        quality={100}
        sizes="360px"
        className={baseImageClass}
      />
    </div>
  );
}

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const motionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const heroHeaderRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion || !heroHeaderRef.current) return;

    const ctx = gsap.context(() => {
      const targets = heroHeaderRef.current?.querySelectorAll("[data-hero-reveal]");
      if (!targets?.length) return;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: -28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.08
        }
      );
    }, heroHeaderRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <main className="min-h-screen">
      <section className="relative isolate mx-auto flex w-full max-w-7xl flex-col overflow-hidden bg-black px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <motion.div
            className="absolute left-[-10%] top-[-18%] h-[360px] w-[360px] rounded-full bg-[#ff3b3b]/25 blur-[120px] md:h-[480px] md:w-[480px]"
            initial={prefersReducedMotion ? false : { opacity: 0.32, x: 0, y: 0, scale: 1 }}
            animate={
              prefersReducedMotion
                ? undefined
                : { opacity: [0.22, 0.34, 0.24], x: [0, 26, -10, 0], y: [0, 20, 8, 0], scale: [1, 1.08, 1.02, 1] }
            }
            transition={prefersReducedMotion ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-14%] top-[8%] h-[300px] w-[300px] rounded-full bg-[#ff5b2b]/20 blur-[110px] md:h-[420px] md:w-[420px]"
            initial={prefersReducedMotion ? false : { opacity: 0.24, x: 0, y: 0, scale: 1 }}
            animate={
              prefersReducedMotion
                ? undefined
                : { opacity: [0.18, 0.28, 0.2], x: [0, -34, -8, 0], y: [0, 14, 30, 0], scale: [1, 1.06, 1] }
            }
            transition={prefersReducedMotion ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          <motion.div
            className="absolute bottom-[-24%] left-[22%] h-[260px] w-[260px] rounded-full bg-[#ffffff]/10 blur-[100px] md:h-[340px] md:w-[340px]"
            initial={prefersReducedMotion ? false : { opacity: 0.16, x: 0, y: 0, scale: 1 }}
            animate={
              prefersReducedMotion
                ? undefined
                : { opacity: [0.1, 0.2, 0.12], x: [0, 16, -14, 0], y: [0, -12, -26, 0], scale: [1, 1.04, 1] }
            }
            transition={prefersReducedMotion ? undefined : { duration: 20, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
        </div>
        <header ref={heroHeaderRef} className="relative z-10 space-y-8 pb-12 md:space-y-10 md:pb-16">
          <div className="flex items-center justify-between" data-hero-reveal>
            <p className="display-font text-[11px] uppercase tracking-[0.28em] text-muted-foreground">GLOBAL STOCK TOOLKIT</p>
            <p className="display-font text-[11px] uppercase tracking-[0.28em] text-muted-foreground">PSWK DEV</p>
          </div>
          <div
            className="inline-flex w-fit items-center rounded-full border border-white/15 bg-black px-3 py-1.5 text-[11px] text-muted-foreground"
            data-hero-reveal
          >
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
            고속 계산 워크플로우
          </div>
          <h1
            className="display-font max-w-5xl text-4xl font-semibold leading-[0.9] md:text-7xl"
            data-hero-reveal
          >
            해외 주식 계산,
            <br />
            한 번에 끝.
          </h1>
          <p
            className="-mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground md:-mt-3 md:text-base"
            data-hero-reveal
          >
            필요한 계산을 바로 선택해서 시작하세요. 실현 수익, 세금, 평가 시뮬레이션까지
            한 화면에서 빠르게 이동할 수 있습니다.
          </p>
        </header>

        <div className="relative z-10 mt-10 md:mt-12 md:grid md:grid-cols-3 md:divide-x md:divide-white/20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.href}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.24 }}
              transition={{
                duration: 0.64,
                delay: prefersReducedMotion ? 0 : index * 0.08,
                ease: motionEase
              }}
            >
              <Card className="group h-full rounded-none border-0 bg-transparent shadow-none">
                <CardHeader className="space-y-4">
                  <motion.div
                    className="relative flex h-72 items-center justify-center"
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.06 + index * 0.08, ease: motionEase }}
                  >
                    <WireArt type={feature.art} />
                  </motion.div>
                  <CardTitle className="text-3xl font-medium leading-tight tracking-[-0.02em]">{feature.title}</CardTitle>
                  <CardDescription className="leading-relaxed text-muted-foreground">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end pb-7">
                  <Button asChild className="h-11 w-16 rounded-lg border border-white bg-white p-0 text-black hover:bg-white/90">
                    <Link href={feature.href}>
                      <span className="sr-only">{feature.cta}</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

    </main>
  );
}

