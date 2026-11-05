import { describe, expect, it } from "vitest";
import {
  buildHiringAdvisorExplanation,
  calculateHiringDecision,
  emptyHiringDecision,
  getSyntheticHiringExample,
} from "./hiring-decision";

const northstar = getSyntheticHiringExample("northstar-studio")!;

function scenario(
  id: "hire-now" | "reduced-hours" | "delayed-hire",
  inputs = northstar,
) {
  const result = calculateHiringDecision(inputs);
  return result.scenarios.find((item) => item.scenarioId === id)!;
}

describe("development-only hiring cash model", () => {
  it("keeps unknown values distinct from explicit zero and withholds incomplete scenarios", () => {
    const unknown = { ...northstar, expectedMonthlyRevenue: null };
    const incomplete = scenario("hire-now", unknown);
    expect(incomplete.status).toBe("incomplete");
    if (incomplete.status === "incomplete") {
      expect(incomplete.missingInputs).toContain("Expected monthly incremental revenue");
    }

    const confirmedZero = { ...northstar, expectedMonthlyRevenue: 0, variableCostPercent: 0 };
    const calculated = scenario("hire-now", confirmedZero);
    expect(calculated.status).toBe("calculated");
    if (calculated.status === "calculated") {
      expect(calculated.projection.months[0].incrementalRevenueReceipts).toBe(0);
      expect(calculated.projection.months[0].incrementalVariableCosts).toBe(0);
      expect(calculated.projection.months[0].incrementalCashImpact).toBe(-12_800);
    }
  });

  it("computes baseline and hire cash independently without counting current payroll twice", () => {
    const result = calculateHiringDecision(northstar);
    const hire = result.scenarios.find((item) => item.scenarioId === "hire-now")!;
    expect(result.baseline?.endingCash[0]).toBe(190_000);
    expect(hire.status).toBe("calculated");
    if (hire.status !== "calculated") return;

    expect(hire.projection.months[0]).toMatchObject({
      baselineOperatingCashFlow: 10_000,
      compensation: 6_000,
      explicitlyEnteredEmployerCosts: 800,
      oneTimeHiringCosts: 6_000,
      incrementalRevenueReceipts: 0,
      incrementalCashImpact: -12_800,
      baselineEndingCash: 190_000,
      scenarioEndingCash: 177_200,
    });
    expect(hire.projection.months[2]).toMatchObject({
      incrementalRevenueReceipts: 15_000,
      incrementalVariableCosts: 5_250,
      incrementalCashImpact: 2_950,
    });
    expect(hire.projection.finalIncrementalCashImpact).toBe(9_900);
    expect(hire.projection.finalEndingCash).toBe(309_900);
  });

  it("produces contrasting sample outcomes from their entered cash assumptions, without a score or verdict", () => {
    const cushion = scenario("hire-now", getSyntheticHiringExample("northstar-studio")!);
    const caution = scenario("hire-now", getSyntheticHiringExample("juniper-kitchen")!);
    expect(cushion.status).toBe("calculated");
    expect(caution.status).toBe("calculated");
    if (cushion.status !== "calculated" || caution.status !== "calculated") return;

    expect(cushion.projection.months[0].scenarioEndingCash).toBe(177_200);
    expect(cushion.projection.finalEndingCash).toBe(309_900);
    expect(cushion.projection.monthsBelowReserve).toBe(0);
    expect(Math.round(caution.projection.finalEndingCash)).toBe(-19_840);
    expect(caution.projection.monthsBelowReserve).toBe(12);
    expect(caution.projection.monthsBelowZero).toBe(5);
    expect(caution.projection.finalIncrementalCashImpact).toBeLessThan(0);
    expect(JSON.stringify([cushion, caution])).not.toMatch(/score|approval|eligibility|affordable/i);
  });

  it("models reduced-hour compensation and revenue only from separate user-entered assumptions", () => {
    const reduced = scenario("reduced-hours");
    expect(reduced.status).toBe("calculated");
    if (reduced.status !== "calculated") return;
    expect(reduced.projection.monthlyCompensation).toBe(3_600);
    expect(reduced.projection.months[0].explicitlyEnteredEmployerCosts).toBe(480);
    expect(reduced.projection.months[0].oneTimeHiringCosts).toBe(6_000);
    expect(reduced.projection.months[2].incrementalRevenueReceipts).toBe(9_000);
    expect(reduced.projection.months[2].incrementalVariableCosts).toBe(3_150);
    expect(reduced.projection.months[2].incrementalCashImpact).toBe(1_770);

    const unknownReducedRevenue = {
      ...northstar,
      reducedExpectedMonthlyRevenue: null,
    };
    const incomplete = scenario("reduced-hours", unknownReducedRevenue);
    expect(incomplete.status).toBe("incomplete");
    if (incomplete.status === "incomplete") {
      expect(incomplete.missingInputs).toContain(
        "Reduced-hours expected monthly revenue",
      );
    }
  });

  it("shifts the same hire and its revenue timing for the delay alternative", () => {
    const delayed = scenario("delayed-hire");
    expect(delayed.status).toBe("calculated");
    if (delayed.status !== "calculated") return;
    expect(delayed.projection.startMonth).toBe(4);
    expect(delayed.projection.months[0].compensation).toBe(0);
    expect(delayed.projection.months[3].compensation).toBe(6_000);
    expect(delayed.projection.months[4].incrementalRevenueReceipts).toBe(0);
    expect(delayed.projection.months[5].incrementalRevenueReceipts).toBe(15_000);
    expect(delayed.projection.monthsBelowReserve).toBe(0);
  });

  it("allows cash projections without a reserve target and leaves only reserve comparisons unavailable", () => {
    const withoutReserve = { ...northstar, reserveTarget: null };
    const result = calculateHiringDecision(withoutReserve);
    const hire = result.scenarios.find((item) => item.scenarioId === "hire-now")!;
    expect(hire.status).toBe("calculated");
    if (hire.status === "calculated") {
      expect(hire.projection.monthsBelowReserve).toBeNull();
      expect(hire.projection.months[0].reserveHeadroom).toBeNull();
      expect(hire.projection.finalEndingCash).toBe(309_900);
      expect(buildHiringAdvisorExplanation(hire).findings.join(" ")).toMatch(
        /reserve comparison is unavailable/,
      );
    }
  });

  it("does not require a delay assumption to calculate the now and reduced-hours alternatives", () => {
    const noDelay = { ...northstar, delayMonths: null };
    const result = calculateHiringDecision(noDelay);
    expect(result.scenarios.find((item) => item.scenarioId === "hire-now")?.status).toBe("calculated");
    expect(result.scenarios.find((item) => item.scenarioId === "reduced-hours")?.status).toBe("calculated");
    const delayed = result.scenarios.find((item) => item.scenarioId === "delayed-hire")!;
    expect(delayed.status).toBe("incomplete");
    if (delayed.status === "incomplete") {
      expect(delayed.missingInputs).toContain("Delay period");
    }
  });

  it("does not count receipts that arrive after month 12", () => {
    const inputs = {
      ...northstar,
      plannedStartMonth: 10,
      revenueStartMonth: 12,
      collectionDelayMonths: 2,
    };
    const hire = scenario("hire-now", inputs);
    expect(hire.status).toBe("calculated");
    if (hire.status !== "calculated") return;
    expect(hire.projection.months.every((month) => month.incrementalRevenueReceipts === 0)).toBe(true);
    expect(hire.projection.limitations.join(" ")).toMatch(/begin after month 12/);
  });

  it("reports a negative-cash period separately from reserve-target months", () => {
    const lowCushion = {
      ...northstar,
      currentCash: 2_000,
      monthlyOperatingCashFlow: -2_000,
      reserveTarget: 0,
      expectedMonthlyRevenue: 0,
      variableCostPercent: 0,
      revenueStartMonth: 12,
      collectionDelayMonths: 1,
    };
    const hire = scenario("hire-now", lowCushion);
    expect(hire.status).toBe("calculated");
    if (hire.status === "calculated") {
      expect(hire.projection.monthsBelowZero).toBeGreaterThan(0);
      expect(buildHiringAdvisorExplanation(hire).findings.join(" ")).toMatch(/below \$0/);
    }
  });

  it("shows reserve shortfalls as arithmetic findings without an affordability grade", () => {
    const juniper = getSyntheticHiringExample("juniper-kitchen")!;
    const hire = scenario("hire-now", juniper);
    expect(hire.status).toBe("calculated");
    if (hire.status !== "calculated") return;
    expect(hire.projection.monthsBelowReserve).toBeGreaterThan(0);
    expect(hire.projection.lowestEndingCash).toBeLessThan(juniper.reserveTarget!);
    const explanation = buildHiringAdvisorExplanation(hire);
    expect(explanation.label).toMatch(/Simulated explanation/);
    expect(explanation.findings.join(" ")).toMatch(/below the entered reserve target/);
    expect(JSON.stringify(explanation)).not.toMatch(/approved|eligible|affordable|green|orange/i);
  });

  it("keeps a baseline projection unavailable when business cash or operating cash flow is unknown", () => {
    const result = calculateHiringDecision({
      ...northstar,
      currentCash: null,
      monthlyOperatingCashFlow: null,
    });
    expect(result.baseline).toBeNull();
    expect(result.baselineMissingInputs).toEqual([
      "Current business cash",
      "Monthly operating cash flow before this hire",
    ]);
    expect(result.scenarios.every((item) => item.status === "incomplete")).toBe(true);
  });

  it("validates negative costs, invalid periods, percentages, and hourly inputs", () => {
    const invalid = {
      ...northstar,
      employerCostsMonthly: -1,
      plannedStartMonth: 13,
      variableCostPercent: 101,
    };
    const result = scenario("hire-now", invalid);
    expect(result.status).toBe("incomplete");
    if (result.status === "incomplete") {
      expect(result.missingInputs).toContain("Monthly employer costs or benefits cannot be negative");
      expect(result.missingInputs).toContain("Planned start month must be a whole month from 1 to 12");
      expect(result.missingInputs).toContain("Variable-cost percentage must be between 0 and 100");
    }

    const hourlyMissing = {
      ...emptyHiringDecision,
      ...northstar,
      compensationBasis: "hourly" as const,
      hourlyRate: null,
    };
    const hourly = scenario("hire-now", hourlyMissing);
    expect(hourly.status).toBe("incomplete");
    if (hourly.status === "incomplete") {
      expect(hourly.missingInputs).toContain("Hourly rate");
    }
  });

  it("uses explicit hourly terms for both relationship labels and withholds salary-based contractor assumptions", () => {
    const hourlyInputs = {
      ...northstar,
      compensationBasis: "hourly" as const,
      hourlyRate: 40,
    };
    const employee = scenario("hire-now", {
      ...hourlyInputs,
      workerRelationship: "employee",
    });
    const contractor = scenario("hire-now", {
      ...hourlyInputs,
      workerRelationship: "independent-contractor",
    });
    const unsupported = scenario("hire-now", {
      ...northstar,
      workerRelationship: "independent-contractor",
      compensationBasis: "salary",
    });
    expect(employee.status).toBe("calculated");
    expect(contractor.status).toBe("calculated");
    expect(unsupported.status).toBe("incomplete");
    if (unsupported.status === "incomplete") {
      expect(unsupported.missingInputs.join(" ")).toMatch(/not interchangeable/);
    }
    if (employee.status === "calculated" && contractor.status === "calculated") {
      expect(contractor.projection.monthlyCompensation).toBe(40 * 40 * 52 / 12);
      expect(employee.projection.limitations.join(" ")).toMatch(/classification determination/);
      expect(contractor.projection.limitations.join(" ")).toMatch(/contractor-engagement costs/);
    }
  });

  it("uses a separately entered hourly rate in the reduced-hours alternative", () => {
    const example = getSyntheticHiringExample("juniper-kitchen")!;
    const result = scenario("reduced-hours", {
      ...example,
      reducedHourlyRate: 24,
    });
    expect(result.status).toBe("calculated");
    if (result.status === "calculated") {
      expect(result.projection.monthlyCompensation).toBe(24 * 20 * 52 / 12);
    }
  });

  it("withholds non-finite projections caused by extreme inputs instead of returning Infinity", () => {
    const result = calculateHiringDecision({
      ...northstar,
      currentCash: 1e308,
      monthlyOperatingCashFlow: 1e308,
    });
    expect(result.baseline).toBeNull();
    expect(result.baselineMissingInputs).toContain(
      "The 12-month baseline exceeds the supported calculation range",
    );
    expect(JSON.stringify(result)).not.toMatch(/Infinity|NaN/);
  });
});
