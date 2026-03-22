import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "FXRETURN | 환율 반영 수익률 분석기",
  description: "미국주식 수익을 주가 요인과 환율 요인으로 분리해 원화 기준으로 계산합니다."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        <div className="min-h-screen">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
