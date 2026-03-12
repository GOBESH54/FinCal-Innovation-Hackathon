# SIP Calculator — FinSight Planner

An education-first SIP (Systematic Investment Plan) calculator built for the **FinCal Innovation Hackathon** (Technex'26, IIT-BHU). This tool helps users understand compounding, inflation, and long-term investment planning through interactive visualizations — without promoting any specific mutual fund scheme.

## ✨ Features

| Feature | Description |
|---------|-------------|
| **SIP Calculator** | Monthly compounding with animated results and donut chart |
| **Investment Growth Chart** | Area + bar chart with milestone reference lines |
| **Donut Breakdown** | SVG donut showing invested vs. returns ratio |
| **Educational Insights** | Power of Compounding, Wealth Multiplier, Rule of 72, Inflation Impact |
| **Scenario Comparison** | "What If?" — compare current vs +₹1000/mo vs +5 years |
| **Milestone Tracker** | When do you reach ₹1L, ₹5L, ₹10L, ₹25L, ₹50L, ₹1Cr? |
| **Year-by-Year Timeline** | Table with milestone highlighting |
| **Dark / Light Mode** | Toggle with localStorage persistence |
| **Accessibility** | WCAG 2.1 AA — keyboard, screen reader, focus management |
| **Responsive** | Desktop, tablet, and mobile layouts |

## 🛡️ Hackathon Compliance

- **Category:** SIP Calculator (one team, one category)
- **No commercial promotion** — educational tool only
- **HDFC Mandatory Disclaimer** included
- **Original code** — all logic and UI are original

## 🛠️ Tech Stack

- Next.js 15.5.9
- React 19.2.4
- TypeScript
- Recharts (charting library)
- CSS Modules with glassmorphism design
- Google Fonts (Montserrat) + Arial / Verdana fallbacks

## 🚀 Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## 📐 Architecture

```
├── components/
│   ├── SipCalculator.tsx      # Main calculator with inputs + donut
│   ├── DonutChart.tsx         # SVG donut (invested vs returns)
│   ├── InvestmentChart.tsx    # Area + bar chart with milestones
│   ├── InvestmentTimeline.tsx # Year-by-year table
│   ├── EducationalInsights.tsx # Compounding, multiplier, Rule of 72
│   ├── ScenarioComparison.tsx # What-if scenario cards
│   ├── MilestoneTracker.tsx   # When do I reach ₹X?
│   ├── NumericSliderInput.tsx # Accessible slider + text input
│   └── ThemeToggle.tsx        # Dark/light mode switch
├── lib/
│   ├── sipMath.ts             # SIP formulas, milestones, scenarios
│   └── formatters.ts          # INR formatting utilities
├── pages/
│   ├── index.tsx              # Main page layout
│   └── _app.tsx               # App wrapper
└── styles/
    ├── globals.css            # Design tokens, dark mode, animations
    └── calculator.module.css  # Component styles
```

## ♿ Accessibility (WCAG 2.1 AA)

- Keyboard-operable sliders and buttons
- `aria-live` updates for dynamic results
- Screen-reader labels on all controls
- High-contrast text (verified 4.5:1+ ratios)
- Visible focus indicators
- Semantic HTML structure

## 📜 Disclaimer

This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
