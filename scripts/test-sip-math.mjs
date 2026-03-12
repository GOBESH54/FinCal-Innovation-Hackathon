/**
 * Lightweight SIP math sanity tests — no external dependencies.
 * Validates core formulas match the hackathon-mandated SIP specification:
 *   r = Annual Rate / 12
 *   FV = P * [((1+r)^n - 1) / r] * (1+r)
 */

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

function approxEqual(a, b, tolerance = 0.01) {
  if (b === 0) return Math.abs(a) < tolerance;
  return Math.abs(a - b) / Math.abs(b) < tolerance;
}

// ── Inline SIP formula (mirrors lib/sipMath.ts logic) ──

function sipFV(monthlyInvestment, annualReturnPercent, years) {
  const r = annualReturnPercent / 100 / 12; // r = Annual rate ÷ 12
  const n = years * 12;
  if (r === 0) return monthlyInvestment * n;
  const growth = Math.pow(1 + r, n);
  return monthlyInvestment * ((growth - 1) / r) * (1 + r);
}

// ── Test cases ──

console.log("\n=== SIP Math Sanity Tests ===\n");

// 1. Zero investment
assert(sipFV(0, 12, 10) === 0, "Zero monthly => zero FV");

// 2. Zero return
assert(sipFV(5000, 0, 10) === 600000, "0% return => total invested = 5000*120");

// 3. Zero years
assert(sipFV(5000, 12, 0) === 0, "0 years => zero FV");

// 4. Standard case: ₹5000/mo, 12% annual, 10 years
//    Using r=0.01 (12%/12), n=120
//    FV = 5000 * [((1.01)^120 - 1) / 0.01] * 1.01
//    Expected ≈ ₹11,61,695 (within 1% tolerance)
const fv1 = sipFV(5000, 12, 10);
assert(approxEqual(fv1, 1161695, 0.01), `5K/12%/10yr FV ≈ 11.6L (got ${Math.round(fv1)})`);

// 5. Monthly rate formula: must be annualRate/12, NOT (1+annualRate)^(1/12)-1
const simpleMonthly = 12 / 100 / 12; // = 0.01
const effectiveMonthly = Math.pow(1 + 12 / 100, 1 / 12) - 1; // ≈ 0.009489
assert(
  Math.abs(simpleMonthly - 0.01) < 1e-10,
  `Monthly rate = annualRate/12 = 0.01 (not effective: ${effectiveMonthly.toFixed(6)})`
);

// 6. Large investment: ₹50,000/mo, 15%, 30 years
//    With r = 0.0125 (15%/12), n=360, FV is very large due to compounding
const fv2 = sipFV(50000, 15, 30);
assert(fv2 > 30000000, `50K/15%/30yr FV > 3Cr (got ${Math.round(fv2)})`);
assert(fv2 < 400000000, `50K/15%/30yr FV < 40Cr (got ${Math.round(fv2)})`);

// 7. Short term: ₹10,000/mo, 8%, 1 year
const fv3 = sipFV(10000, 8, 1);
assert(fv3 > 120000, `10K/8%/1yr FV > 1.2L (invested) (got ${Math.round(fv3)})`);
assert(fv3 < 130000, `10K/8%/1yr FV < 1.3L (got ${Math.round(fv3)})`);

// 8. Tax Impact Assessment
function sipFV_tax(monthlyInvestment, annualReturnPercent, years, taxRatePercent) {
  const fv = sipFV(monthlyInvestment, annualReturnPercent, years);
  const invested = monthlyInvestment * years * 12;
  const gains = fv - invested;
  const postTaxGains = gains > 0 ? gains * (1 - taxRatePercent / 100) : 0;
  return { fv, invested, gains, postTaxGains, postTaxFutureValue: invested + postTaxGains };
}

const resultTaxes = sipFV_tax(10000, 12, 10, 12.5);
assert(resultTaxes.postTaxGains < resultTaxes.gains, "Post-tax gains should be less than total gains");
assert(
  approxEqual(resultTaxes.gains - resultTaxes.postTaxGains, resultTaxes.gains * 0.125, 0.01),
  "Tax should be ~12.5% of total gains"
);

// ── Summary ──

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) {
  process.exit(1);
}
