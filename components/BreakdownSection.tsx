import type { CalculatorResult } from "@/types/calculator";
import { formatKrw, formatUsd, getProfitTone } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BreakdownSectionProps = {
  result: CalculatorResult;
};

export function BreakdownSection({ result }: BreakdownSectionProps) {
  const usdTone = getProfitTone(result.stockProfitUSD);
  const gapAbs = Math.abs(result.reconciliationGapKRW);
  const isReconciled = gapAbs < 1;

  const rows = [
    {
      label: "매수 원화금액",
      value: formatKrw(result.buyKRW),
      tone: "text-foreground"
    },
    {
      label: "매도 원화금액",
      value: formatKrw(result.sellKRW),
      tone: "text-foreground"
    },
    {
      label: "달러 기준 수익",
      value: `${result.stockProfitUSD >= 0 ? "+" : ""}${formatUsd(result.stockProfitUSD)}`,
      tone: usdTone
    }
  ];

  return (
    <Card className="overflow-hidden border-border/50 bg-card/80">
      {/* Subtle top rule */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <CardHeader className="pb-3 pt-5">
        <CardTitle className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border/50" />
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            상세 정보
          </span>
          <span className="h-px flex-1 bg-border/50" />
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        {/* Ledger table */}
        <div className="overflow-hidden rounded-lg border border-border/50">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-4 py-3 text-sm ${
                i % 2 === 0 ? "bg-muted/15" : "bg-transparent"
              } ${i < rows.length - 1 ? "border-b border-border/30" : ""}`}
            >
              <span className="text-muted-foreground">{row.label}</span>
              <strong className={`font-mono text-sm ${row.tone}`}>{row.value}</strong>
            </div>
          ))}
        </div>

        {/* Reconciliation status */}
        <div className="mt-4 flex items-center justify-between rounded-lg border border-border/40 bg-muted/10 px-4 py-3">
          <span className="text-sm text-muted-foreground">
            분해 검증 (주가요인 + 환율요인 = 총손익)
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
              isReconciled
                ? "border-success/30 bg-success/10 text-success"
                : "border-danger/30 bg-danger/10 text-danger"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isReconciled ? "bg-success" : "bg-danger"
              }`}
            />
            {isReconciled ? "일치" : `오차 ${formatKrw(gapAbs)}`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
