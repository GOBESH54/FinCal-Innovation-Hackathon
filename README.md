# SIP Calculator - FinCal Innovation Hackathon

Education-first SIP calculator built with Next.js, focused on investor awareness and rule-compliant financial education.

## Highlights

- Mobile-first responsive UI (phone, tablet, laptop, desktop)
- SIP formula as specified in hackathon rules:
  - `r = annual rate / 12`
  - `n = years * 12`
  - `FV = P * [((1 + r)^n - 1) / r] * (1 + r)`
- User-editable assumptions:
  - Monthly investment
  - Expected annual return
  - Investment duration
  - Inflation
  - Tax impact (LTCG, illustrative)
  - Scenario deltas (extra monthly amount, extra years)
- Educational visual blocks:
  - Investment growth chart
  - Invested vs returns donut
  - Scenario comparison
  - Milestone tracker
  - Year-by-year timeline
- Accessibility-focused controls:
  - Labels and ARIA attributes on inputs
  - Keyboard-friendly controls and focus styles
  - Error-state messaging
  - Screen-reader updates for key output changes
- Dark mode with persistent user preference

## Mandatory Compliance Alignment

- Category: SIP Calculator only
- No scheme ranking or product promotion
- Mandatory HDFC disclaimer included verbatim
- Assumptions are disclosed and editable
- Outputs are illustrative, not guaranteed
- Brand colors used:
  - Blue `#224c87`
  - Red `#da3832`
  - Grey `#919090`
- Font stack:
  - Montserrat, Arial, Verdana

## Stack Compatibility

- Next.js `15.5.9`
- Node.js `22.11.0+`
- NPM `10.9.0+`
- Frontend: Next.js (pages router)
- Backend compatibility: Node-compatible logic
- Drupal/PHP/MySQL: not required unless CMS integration is added

## Local Setup

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run typecheck
npm run build
npm run test
```

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run typecheck` - TypeScript checks
- `npm run test` - SIP math sanity tests
- `npm run check` - typecheck + build + tests

## Project Structure

- `pages/index.tsx` - main app layout and compliance sections
- `components/SipCalculator.tsx` - core calculator controls and summary cards
- `components/InvestmentChart.tsx` - growth chart
- `components/DonutChart.tsx` - invested vs returns chart
- `components/InvestmentTimeline.tsx` - annual table
- `components/EducationalInsights.tsx` - educational explainers
- `components/ScenarioComparison.tsx` - what-if comparison
- `components/MilestoneTracker.tsx` - target milestones
- `components/NumericSliderInput.tsx` - accessible numeric input + slider
- `components/ThemeToggle.tsx` - dark/light mode toggle
- `lib/sipMath.ts` - financial formulas and scenario logic
- `lib/formatters.ts` - INR/percentage formatting helpers

## Mandatory Disclaimer

This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
