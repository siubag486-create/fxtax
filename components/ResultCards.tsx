import type { CalculatorResult } from "@/types/calculator";
import { formatKrw, formatPercent, formatUsd, getProfitTone } from "@/lib/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ResultCardsProps = {
  result: CalculatorResult;
};

export function ResultCards({ result }: ResultCardsProps) {
  const totalTone = getProfitTone(result.totalProfitKRW);
  const roiTone = getProfitTone(result.roi);
  const stockTone = getProfitTone(result.stockEffectKRW);
  const fxTone = getProfitTone(result.fxEffectKRW);
  const stockSharePct = result.totalProfitKRW === 0 ? 0 : (result.stockEffectKRW / result.totalProfitKRW) * 100;
  const fxSharePct = result.totalProfitKRW === 0 ? 0 : (result.fxEffectKRW / result.totalProfitKRW) * 100;

  return (
    <section className="grid gap-5 md:grid-cols-2">
      {/* Main total profit - full width */}
      <Card className="relative overflow-hidden border-border/50 md:col-span-2">
        {/* Subtle gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        {/* Top accent */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

        <CardHeader className="pb-3">
          <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/60">
            Result
          </CardDescription>
          <CardTitle className="text-lg font-medium text-muted-foreground">총 수익 (원화 / 달러)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <p className={`display-font text-5xl font-black md:text-6xl ${totalTone}`}>
            {result.totalProfitKRW >= 0 ? "+" : ""}
            {formatKrw(result.totalProfitKRW)}
          </p>
          <p className="text-lg text-muted-foreground md:text-xl">
            {result.stockProfitUSD >= 0 ? "+" : ""}
            {formatUsd(result.stockProfitUSD)}
          </p>
        </CardContent>
      </Card>

      {/* Stock effect */}
      <Card className="order-1 overflow-hidden border-border/50 md:order-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
            주가 수익 기여 (원화)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-3xl font-bold ${stockTone}`}>
            {result.stockEffectKRW >= 0 ? "+" : ""}
            {formatKrw(result.stockEffectKRW)}
            <span className="ml-2 text-base font-medium opacity-60">({stockSharePct.toFixed(2)}%)</span>
          </p>
          {/* Contribution bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-medium text-muted-foreground/80">기여도</span>
              <span className="text-xs font-bold text-foreground">{stockSharePct.toFixed(2)}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted/40">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  result.stockEffectKRW >= 0 ? "bg-success" : "bg-danger"
                }`}
                style={{ width: `${Math.min(Math.abs(stockSharePct), 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI - spans 2 rows */}
      <Card className="relative order-3 overflow-hidden border-border/50 bg-secondary/20 md:order-none md:row-span-2 md:h-full">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent" />
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
            총 수익률
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-full flex-col items-start justify-center pb-10">
          <p className={`display-font text-5xl font-black md:text-6xl ${roiTone}`}>
            {formatPercent(result.roi)}
          </p>
        </CardContent>
      </Card>

      {/* FX effect */}
      <Card className="order-2 overflow-hidden border-border/50 md:order-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
            환차익 / 환차손 (원화)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-3xl font-bold ${fxTone}`}>
            {result.fxEffectKRW >= 0 ? "+" : ""}
            {formatKrw(result.fxEffectKRW)}
            <span className="ml-2 text-base font-medium opacity-60">({fxSharePct.toFixed(2)}%)</span>
          </p>
          {/* Contribution bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-muted-foreground/80">
              <span>기여도</span>
              <span>{fxSharePct.toFixed(2)}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted/40">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  result.fxEffectKRW >= 0 ? "bg-success" : "bg-danger"
                }`}
                style={{ width: `${Math.min(Math.abs(fxSharePct), 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
