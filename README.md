# FinCal Innovation Hackathon Submission

## Live Demo

Render deployment: https://fincal-innovation-hackathon.onrender.com/

## Project

**Title:** SIP Learning Planner  
**Category:** SIP Calculator  
**Theme:** Investor education, transparent assumptions, and responsible financial UX

This submission is an education-first SIP calculator built in Next.js for the FinCal Innovation Hackathon. The project is intentionally scoped to a single permitted category and is designed to explain compounding clearly without promoting any specific fund, scheme, or guaranteed outcome.

The calculator focuses on making SIP concepts easier to understand through plain-language summaries, interactive controls, visual comparisons, milestone tracking, inflation adjustment, and post-tax illustration.

## What Judges Should Notice

- The calculator follows the SIP-specific formula framework required in the hackathon brief.
- All key assumptions are user-editable and openly disclosed in the UI.
- The experience is built for desktop, tablet, and mobile using a mobile-first responsive layout.
- The interface is designed for accessibility with labels, ARIA support, keyboard-usable controls, screen-reader announcements, and accessible error states.
- The submission stays within the investor-awareness positioning: no product selling, no scheme ranking, no performance promises.

## Core Feature Set

### 1. SIP Calculator

The main calculator lets users adjust:

- Monthly investment amount
- Expected annual return
- Investment duration
- Assumed exit tax (LTCG)

It instantly updates:

- Total invested
- Estimated returns
- Future value
- Post-tax gains
- Post-tax future value

### 2. Investment Growth Chart

A responsive chart visualizes:

- Total portfolio growth
- Invested amount
- Returns generated over time

This helps users understand that long-term SIP growth is not linear.

### 3. Donut Breakdown

The donut chart shows the ratio between:

- Principal invested
- Returns earned

This gives a quick visual understanding of how much of the final corpus comes from contributions versus growth.

### 4. Educational Insights

The project includes a dedicated education section covering:

- Power of compounding
- Wealth multiplier
- Rule of 72
- Inflation-adjusted value

These are included to improve financial understanding, not just output numbers.

### 5. Scenario Comparison

Users can compare their current plan with:

- A higher monthly SIP
- A longer investment duration

This demonstrates how small changes in amount or time can materially change long-term outcomes.

### 6. Milestone Tracker

The app highlights when the plan reaches major milestones such as:

- Rs 1 Lakh
- Rs 5 Lakh
- Rs 10 Lakh
- Rs 25 Lakh
- Rs 50 Lakh
- Rs 1 Crore

This makes progress more concrete and easier to interpret.

### 7. Year-by-Year Timeline

A tabular yearly breakdown shows:

- Year
- Total invested
- Portfolio value
- Profit
- Milestone hit status

This supports transparency and makes the output auditable.

### 8. Plain-English Summary

The app generates a readable summary of the current SIP assumptions so that users can understand the result without needing to interpret formulas or graphs first.

### 9. Dark Mode

A persistent dark mode is included to improve usability and comfort across viewing conditions while preserving readability and contrast.

## Financial Logic

The SIP calculation follows the framework specified in the uploaded hackathon rules:

- Monthly rate: `r = annual rate / 12`
- Total months: `n = years * 12`
- SIP future value: `FV = P * [((1 + r)^n - 1) / r] * (1 + r)`

Additional educational assumptions included in this project:

- Inflation adjustment
- Illustrative post-tax wealth impact
- Scenario deltas for additional amount and additional duration

These additions are:

- User-editable
- Clearly disclosed
- Educational in purpose
- Not predictive

## Compliance With Hackathon Rules

### Category Compliance

- The submission is locked to **SIP Calculator** only.
- No other calculator category is implemented.

### Technology Stack Compliance

- Next.js `15.5.9`
- Node.js `22.11.0+`
- NPM `10.9.0+`
- Frontend built in Next.js
- Logic is fully Node-compatible

This project does not depend on Drupal integration. If CMS integration is required later, the frontend remains separable and compatible with a Node-based deployment workflow.

### Accessibility

The interface includes:

- Semantic headings and section structure
- Accessible labels for inputs
- `aria-label`, `aria-describedby`, and `aria-live` usage where relevant
- Keyboard-usable sliders and controls
- Accessible inline error messaging
- Logical tab flow
- Responsive layouts without forced horizontal scrolling in the main experience

### Responsiveness

The UI is designed to work across:

- Mobile
- Tablet
- Laptop
- Desktop

Layout behavior:

- Mobile: stacked single-column prioritization
- Tablet: multi-column sections for charts and insights
- Desktop: expanded grid layout with improved information density

### Brand Guideline Alignment

The project uses the required palette and font direction from the brief:

- Blue: `#224c87`
- Red: `#da3832`
- Grey: `#919090`
- Fonts: Montserrat, Arial, Verdana

The interface avoids exaggerated metaphors, promotional imagery, or guarantee-oriented language.

## Non-Promotional Design Choices

To stay aligned with the investor education and awareness objective:

- No specific HDFC Mutual Fund scheme is recommended
- No ranking or comparison of schemes is shown
- No guaranteed language is used in outputs
- The calculator is presented as illustrative only

## Testing And Verification

The repository includes a lightweight SIP math verification script covering:

- Zero investment case
- Zero return case
- Zero duration case
- Standard SIP output sanity check
- Validation that monthly rate is `annual / 12`
- Large and short-duration sanity checks
- Post-tax result checks

Available commands:

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run test
```

## Project Structure

```text
pages/
  _app.tsx
  index.tsx

components/
  SipCalculator.tsx
  NumericSliderInput.tsx
  InvestmentChart.tsx
  DonutChart.tsx
  EducationalInsights.tsx
  ScenarioComparison.tsx
  MilestoneTracker.tsx
  InvestmentTimeline.tsx
  ThemeToggle.tsx

lib/
  sipMath.ts
  formatters.ts

styles/
  globals.css
```

## Why This Submission Is Strong

- It is not just a calculator; it is a teaching interface.
- It turns SIP math into an understandable, interactive experience.
- It balances compliance, clarity, responsiveness, accessibility, and technical quality.
- It adds useful educational enhancements while remaining transparent and rule-aligned.

## Mandatory Disclaimer

This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
