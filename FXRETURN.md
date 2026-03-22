FXRETURN
# 📄 PRD.md — 미국주식 환율 포함 수익률 계산기 (MVP)

## 1. Product Overview

### 1.1 목적 (Goal)

미국주식 투자자가 다음을 **한 번에 계산**할 수 있도록 한다:

* 주가 상승/하락으로 인한 수익
* 환율 변동으로 인한 환차익 / 환차손
* 최종 원화 기준 실현 수익
* 최종 수익률 (%)

핵심은:

> “달러로는 벌었는데, 원화로는 얼마 벌었는지”를 직관적으로 보여주는 것.

---

### 1.2 문제 정의 (Problem)

대부분 투자자는:

* 달러 기준 수익률만 확인함
* 환율 변동이 실제 수익에 얼마나 영향을 주는지 이해하기 어려움
* 증권사 앱에서 **주가 요인 vs 환율 요인 분리**가 명확하지 않음

---

### 1.3 타겟 사용자 (Target Users)

* 미국주식 투자 초보 ~ 중급
* 환율 영향이 궁금한 투자자
* 실제 원화 기준 수익을 알고 싶은 사용자

---

## 2. Core Value Proposition

### 핵심 가치

* 계산 과정이 투명함
* 주가 수익과 환차익을 분리해서 보여줌
* 입력 5개만으로 결과 확인 가능
* 모바일에서도 즉시 사용 가능

---

## 3. Scope (MVP)

### 포함 기능 (In Scope)

* 주가 수익 계산
* 환차익 / 환차손 계산
* 원화 기준 총 수익 계산
* 최종 수익률(%)
* 결과 구성요소 분리 표시

### 제외 기능 (Out of Scope)

* 배당
* 세금
* 수수료
* 자동 환율 API
* 로그인 / 저장 기능
* 백엔드 DB

---

## 4. User Flow

```
사용자 접속
→ 매수 정보 입력
→ 매도 정보 입력
→ [계산하기]
→ 결과 카드 즉시 표시
```

---

## 5. Input Fields (MVP)

| 항목       | 타입     | 설명      |
| -------- | ------ | ------- |
| 매수 평단가   | number | USD     |
| 매도 가격    | number | USD     |
| 보유 수량    | number | 주       |
| 매수 당시 환율 | number | KRW/USD |
| 매도 당시 환율 | number | KRW/USD |

---

## 6. Calculation Logic (핵심)

### 6.1 기본 정의

```
buyUSD = 매수평단가 × 수량
sellUSD = 매도가 × 수량
```

---

### 6.2 주가 수익 (USD 기준)

```
stockProfitUSD = sellUSD - buyUSD
```

---

### 6.3 원화 기준 매수금액

```
buyKRW = buyUSD × 매수환율
```

---

### 6.4 원화 기준 매도금액

```
sellKRW = sellUSD × 매도환율
```

---

### 6.5 총 손익 (원화 기준)

```
totalProfitKRW = sellKRW - buyKRW
```

---

### 6.6 총 수익률 (%)

```
ROI = (totalProfitKRW / buyKRW) × 100
```

---

### 6.7 주가 요인 / 환율 요인 분해 (UX 핵심)

#### 주가 요인 (환율 고정)

```
stockEffectKRW =
(매도가 - 매수가) × 수량 × 매도환율
```

#### 환율 요인

```
fxEffectKRW =
(매도환율 - 매수환율) × (매수가 × 수량)
```

검증:

```
stockEffectKRW + fxEffectKRW ≈ totalProfitKRW
```

---

## 7. Output (UI Result Cards)

### 결과 카드 1 (가장 크게)

* **총 수익(원화)**

### 결과 카드 2

* 총 수익률 (%)

### 결과 카드 3

* 주가 수익 기여 (원화)

### 결과 카드 4

* 환차익 / 환차손 (원화)

### 상세 정보

* 매수 원화금액
* 매도 원화금액
* 달러 기준 수익

---

## 8. UI/UX Requirements

### 레이아웃

* Single Page
* 상단 입력 / 하단 결과
* 모바일 우선

### UX 규칙

* 숫자 입력 즉시 계산 (버튼 optional)
* 원화는 천단위 콤마
* 수익 → + / 손실 → − 컬러 강조

### 디자인 스타일

* clean financial dashboard
* white background
* minimal cards
* 큰 숫자 중심

---

## 9. Tech Stack

* Next.js (App Router)
* TypeScript
* TailwindCSS
* shadcn/ui
* React hooks (useState)

---

## 10. File Structure

```
app/
  page.tsx

components/
  CalculatorForm.tsx
  ResultCards.tsx
  BreakdownSection.tsx

lib/
  calc.ts
  format.ts

types/
  calculator.ts
```

---

## 11. Non-functional Requirements

* 계산은 client-side only
* 0 dependency for finance libraries
* hydration mismatch 없이 SSR 안전
* Lighthouse 90+ 목표

---

## 12. Success Metrics (MVP)

* 평균 체류시간 > 1분
* 계산 완료율 > 60%
* 재방문율 > 20%
* AdSense 승인 가능 구조 (콘텐츠 페이지 추가 예정)

---

## 13. Future Roadmap (v2)

* 실시간 환율 API
* 배당 포함 계산
* 세금 옵션
* 시나리오 분석 (환율 슬라이더)
* 투자 기록 저장
* 공유 링크 생성

---

## 14. 핵심 제품 철학 (중요)

이 계산기는:

❌ 복잡한 금융 플랫폼이 아니다
⭕ “미국주식 원화 수익이 얼마인지 5초 안에 이해시키는 도구”다.
