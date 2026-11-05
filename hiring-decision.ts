export type WorkerRelationship = "employee" | "independent-contractor";
export type CompensationBasis = "salary" | "hourly";
export type HiringScenarioId = "hire-now" | "reduced-hours" | "delayed-hire";

/**
 * Inputs for a development-only synthetic hiring scenario.
 * Null means unknown/not entered; zero is an explicit value.
 */
export type HiringDecisionInputs = {
  businessLabel: string;
  workerRelationship: WorkerRelationship | null;
  compensationBasis: CompensationBasis | null;
  currentCash: number | null;
  monthlyOperatingCashFlow: number | null;
  reserveTarget: number | null;
  annualSalary: number | null;
  hourlyRate: number | null;
  regularHoursPerWeek: number | null;
  employerCostsMonthly: number | null;
  oneTimeHiringCosts: number | null;
  plannedStartMonth: number | null;
  delayMonths: number | null;
  reducedHoursPerWeek: number | null;
  reducedAnnualSalary: number | null;
  reducedHourlyRate: number | null;
  reducedEmployerCostsMonthly: number | null;
  reducedOneTimeHiringCosts: number | null;
  expectedMonthlyRevenue: number | null;
  variableCostPercent: number | null;
  revenueStartMonth: number | null;
  collectionDelayMonths: number | null;
  reducedExpectedMonthlyRevenue: number | null;
  reducedVariableCostPercent: number | null;
  reducedRevenueStartMonth: number | null;
  reducedCollectionDelayMonths: number | null;
};

export type HiringInputKey = keyof HiringDecisionInputs;

export type HiringMonth = {
  month: number;
  baselineOperatingCashFlow: number;
  incrementalRevenueReceipts: number;
  incrementalVariableCosts: number;
  compensation: number;
  explicitlyEnteredEmployerCosts: number;
  oneTimeHiringCosts: number;
  incrementalCashImpact: number;
  baselineEndingCash: number;
  scenarioEndingCash: number;
  reserveHeadroom: number | null;
};

export type HiringProjection = {
  scenarioId: HiringScenarioId;
  title: string;
  startMonth: number;
  annualizedCompensation: number;
  monthlyCompensation: number;
  monthsBelowReserve: number | null;
  monthsBelowZero: number;
  lowestEndingCash: number;
  finalEndingCash: number;
  finalIncrementalCashImpact: number;
  months: HiringMonth[];
  limitations: string[];
};

export type HiringScenarioResult =
  | {
      status: "incomplete";
      scenarioId: HiringScenarioId;
      title: string;
      missingInputs: string[];
    }
  | {
      status: "calculated";
      scenarioId: HiringScenarioId;
      title: string;
      projection: HiringProjection;
    };

export type HiringDecisionResult = {
  baseline: {
    endingCash: number[];
    lowestEndingCash: number;
    finalEndingCash: number;
  } | null;
  baselineMissingInputs: string[];
  scenarios: HiringScenarioResult[];
};

const MONTHS = 12;

const LABELS: Partial<Record<HiringInputKey, string>> = {
  workerRelationship: "Worker relationship",
  compensationBasis: "Compensation basis",
  currentCash: "Current business cash",
  monthlyOperatingCashFlow: "Monthly operating cash flow before this hire",
  reserveTarget: "Cash reserve target",
  annualSalary: "Annual salary",
  hourlyRate: "Hourly rate",
  regularHoursPerWeek: "Regular hours per week",
  employerCostsMonthly: "Monthly employer costs or benefits",
  oneTimeHiringCosts: "One-time hiring costs",
  plannedStartMonth: "Planned start month",
  delayMonths: "Delay period",
  reducedHoursPerWeek: "Reduced hours per week",
  reducedAnnualSalary: "Reduced-hours annual salary",
  reducedHourlyRate: "Reduced-hours hourly rate",
  reducedEmployerCostsMonthly: "Reduced-hours monthly employer costs",
  reducedOneTimeHiringCosts: "Reduced-hours one-time hiring costs",
  expectedMonthlyRevenue: "Expected monthly incremental revenue",
  variableCostPercent: "Variable-cost percentage",
  revenueStartMonth: "Revenue start month",
  collectionDelayMonths: "Revenue collection delay",
  reducedExpectedMonthlyRevenue: "Reduced-hours expected monthly revenue",
  reducedVariableCostPercent: "Reduced-hours variable-cost percentage",
  reducedRevenueStartMonth: "Reduced-hours revenue start month",
  reducedCollectionDelayMonths: "Reduced-hours revenue collection delay",
};

export const emptyHiringDecision: HiringDecisionInputs = {
  businessLabel: "My synthetic business",
  workerRelationship: null,
  compensationBasis: null,
  currentCash: null,
  monthlyOperatingCashFlow: null,
  reserveTarget: null,
  annualSalary: null,
  hourlyRate: null,
  regularHoursPerWeek: null,
  employerCostsMonthly: null,
  oneTimeHiringCosts: null,
  plannedStartMonth: null,
  delayMonths: null,
  reducedHoursPerWeek: null,
  reducedAnnualSalary: null,
  reducedHourlyRate: null,
  reducedEmployerCostsMonthly: null,
  reducedOneTimeHiringCosts: null,
  expectedMonthlyRevenue: null,
  variableCostPercent: null,
  revenueStartMonth: null,
  collectionDelayMonths: null,
  reducedExpectedMonthlyRevenue: null,
  reducedVariableCostPercent: null,
  reducedRevenueStartMonth: null,
  reducedCollectionDelayMonths: null,
};

const syntheticExamples: Record<string, HiringDecisionInputs> = {
  "northstar-studio": {
    ...emptyHiringDecision,
    businessLabel: "Northstar Studio Services — synthetic example",
    workerRelationship: "employee",
    compensationBasis: "salary",
    currentCash: 180_000,
    monthlyOperatingCashFlow: 10_000,
    reserveTarget: 60_000,
    annualSalary: 72_000,
    hourlyRate: null,
    regularHoursPerWeek: 40,
    employerCostsMonthly: 800,
    oneTimeHiringCosts: 6_000,
    plannedStartMonth: 1,
    delayMonths: 3,
    reducedHoursPerWeek: 24,
    reducedAnnualSalary: 43_200,
    reducedHourlyRate: null,
    reducedEmployerCostsMonthly: 480,
    reducedOneTimeHiringCosts: 6_000,
    expectedMonthlyRevenue: 15_000,
    variableCostPercent: 35,
    revenueStartMonth: 2,
    collectionDelayMonths: 1,
    reducedExpectedMonthlyRevenue: 9_000,
    reducedVariableCostPercent: 35,
    reducedRevenueStartMonth: 2,
    reducedCollectionDelayMonths: 1,
  },
  "juniper-kitchen": {
    ...emptyHiringDecision,
    businessLabel: "Juniper Table Kitchen — synthetic example",
    workerRelationship: "employee",
    compensationBasis: "hourly",
    currentCash: 55_000,
    monthlyOperatingCashFlow: -3_000,
    reserveTarget: 40_000,
    annualSalary: null,
    hourlyRate: 28,
    regularHoursPerWeek: 40,
    employerCostsMonthly: 500,
    oneTimeHiringCosts: 7_000,
    plannedStartMonth: 1,
    delayMonths: 3,
    reducedHoursPerWeek: 20,
    reducedAnnualSalary: null,
    reducedHourlyRate: 28,
    reducedEmployerCostsMonthly: 300,
    reducedOneTimeHiringCosts: 7_000,
    expectedMonthlyRevenue: 9_000,
    variableCostPercent: 55,
    revenueStartMonth: 3,
    collectionDelayMonths: 2,
    reducedExpectedMonthlyRevenue: 4_500,
    reducedVariableCostPercent: 55,
    reducedRevenueStartMonth: 3,
    reducedCollectionDelayMonths: 2,
  },
};

export function getSyntheticHiringExample(id: string): HiringDecisionInputs | null {
  const example = syntheticExamples[id];
  return example ? { ...example } : null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isValidMonth(value: number | null): value is number {
  return isFiniteNumber(value) && Number.isInteger(value) && value >= 1 && value <= MONTHS;
}

function commonMissing(inputs: HiringDecisionInputs): string[] {
  const keys: HiringInputKey[] = [
    "workerRelationship",
    "compensationBasis",
    "currentCash",
    "monthlyOperatingCashFlow",
    "regularHoursPerWeek",
    "plannedStartMonth",
  ];
  return keys
    .filter((key) => inputs[key] === null || inputs[key] === "")
    .map((key) => LABELS[key] ?? String(key));
}

function scenarioMissing(
  inputs: HiringDecisionInputs,
  scenarioId: HiringScenarioId,
): string[] {
  const missing = commonMissing(inputs);
  const keys: HiringInputKey[] =
    scenarioId === "reduced-hours"
      ? [
          "reducedEmployerCostsMonthly",
          "reducedOneTimeHiringCosts",
          "reducedHoursPerWeek",
          ...(inputs.compensationBasis === "hourly" ? ["reducedHourlyRate" as const] : []),
          "reducedExpectedMonthlyRevenue",
          "reducedVariableCostPercent",
          "reducedRevenueStartMonth",
          "reducedCollectionDelayMonths",
          ...(inputs.compensationBasis === "salary" ? ["reducedAnnualSalary" as const] : []),
        ]
      : [
          "employerCostsMonthly",
          "oneTimeHiringCosts",
          "expectedMonthlyRevenue",
          "variableCostPercent",
          "revenueStartMonth",
          "collectionDelayMonths",
          ...(inputs.compensationBasis === "salary"
            ? ["annualSalary" as const]
            : ["hourlyRate" as const]),
          ...(scenarioId === "delayed-hire" ? ["delayMonths" as const] : []),
        ];
  for (const key of keys) {
    if (inputs[key] === null || inputs[key] === "") {
      const label = LABELS[key] ?? String(key);
      if (!missing.includes(label)) missing.push(label);
    }
  }

  const numericKeys: HiringInputKey[] = [
    "currentCash",
    "monthlyOperatingCashFlow",
    "regularHoursPerWeek",
  ];
  if (inputs.reserveTarget !== null) numericKeys.push("reserveTarget");
  if (scenarioId === "reduced-hours") {
    numericKeys.push(
      "reducedHoursPerWeek",
      "reducedEmployerCostsMonthly",
      "reducedOneTimeHiringCosts",
      "reducedExpectedMonthlyRevenue",
      "reducedVariableCostPercent",
      "reducedCollectionDelayMonths",
      "reducedEmployerCostsMonthly",
      "reducedOneTimeHiringCosts",
    );
    if (inputs.compensationBasis === "salary") numericKeys.push("reducedAnnualSalary");
    if (inputs.compensationBasis === "hourly") numericKeys.push("reducedHourlyRate");
  } else {
    numericKeys.push(
      "employerCostsMonthly",
      "oneTimeHiringCosts",
      "expectedMonthlyRevenue",
      "variableCostPercent",
      "collectionDelayMonths",
    );
    if (scenarioId === "delayed-hire") numericKeys.push("delayMonths");
    if (inputs.compensationBasis === "salary") numericKeys.push("annualSalary");
    if (inputs.compensationBasis === "hourly") numericKeys.push("hourlyRate");
  }

  for (const key of numericKeys) {
    const value = inputs[key];
    if (value !== null && !isFiniteNumber(value)) {
      const label = LABELS[key] ?? String(key);
      if (!missing.includes(`${label} must be a finite number`)) {
        missing.push(`${label} must be a finite number`);
      }
    }
  }

  const monthKeys: HiringInputKey[] =
    scenarioId === "reduced-hours"
      ? ["plannedStartMonth", "reducedRevenueStartMonth"]
      : ["plannedStartMonth", "revenueStartMonth"];
  for (const key of monthKeys) {
    if (inputs[key] !== null && !isValidMonth(inputs[key] as number)) {
      const label = LABELS[key] ?? String(key);
      if (!missing.includes(`${label} must be a whole month from 1 to 12`)) {
        missing.push(`${label} must be a whole month from 1 to 12`);
      }
    }
  }

  const nonnegativeKeys: HiringInputKey[] = ["currentCash", "regularHoursPerWeek"];
  if (inputs.reserveTarget !== null) nonnegativeKeys.push("reserveTarget");
  if (scenarioId === "reduced-hours") {
    nonnegativeKeys.push(
      "reducedHoursPerWeek",
      "reducedEmployerCostsMonthly",
      "reducedOneTimeHiringCosts",
      "reducedExpectedMonthlyRevenue",
    );
    if (inputs.compensationBasis === "salary") nonnegativeKeys.push("reducedAnnualSalary");
    if (inputs.compensationBasis === "hourly") nonnegativeKeys.push("reducedHourlyRate");
  } else {
    nonnegativeKeys.push("expectedMonthlyRevenue");
    if (inputs.compensationBasis === "salary") nonnegativeKeys.push("annualSalary");
    if (inputs.compensationBasis === "hourly") nonnegativeKeys.push("hourlyRate");
  }
  for (const key of nonnegativeKeys) {
    const value = inputs[key];
    if (isFiniteNumber(value) && value < 0) {
      const label = LABELS[key] ?? String(key);
      if (!missing.includes(`${label} cannot be negative`)) {
        missing.push(`${label} cannot be negative`);
      }
    }
  }
  for (const key of [
    ...(scenarioId === "reduced-hours"
      ? ["reducedEmployerCostsMonthly", "reducedOneTimeHiringCosts"] as const
      : ["employerCostsMonthly", "oneTimeHiringCosts"] as const),
  ]) {
    const value = inputs[key];
    if (isFiniteNumber(value) && value < 0) {
      const label = LABELS[key] ?? String(key);
      if (!missing.includes(`${label} cannot be negative`)) {
        missing.push(`${label} cannot be negative`);
      }
    }
  }

  const hoursKeys: HiringInputKey[] = ["regularHoursPerWeek"];
  if (scenarioId === "reduced-hours") hoursKeys.push("reducedHoursPerWeek");
  for (const key of hoursKeys) {
    const value = inputs[key];
    if (isFiniteNumber(value) && value <= 0) {
      const label = LABELS[key] ?? String(key);
      if (!missing.includes(`${label} must be greater than zero`)) {
        missing.push(`${label} must be greater than zero`);
      }
    }
  }

  const percentKey =
    scenarioId === "reduced-hours"
      ? "reducedVariableCostPercent"
      : "variableCostPercent";
  const percent = inputs[percentKey];
  if (isFiniteNumber(percent) && (percent < 0 || percent > 100)) {
    const label = LABELS[percentKey] ?? String(percentKey);
    missing.push(`${label} must be between 0 and 100`);
  }

  const delayKeys: HiringInputKey[] = [
    ...(scenarioId === "delayed-hire" ? ["delayMonths" as const] : []),
    scenarioId === "reduced-hours"
      ? "reducedCollectionDelayMonths"
      : "collectionDelayMonths",
  ];
  for (const key of delayKeys) {
    const value = inputs[key];
    if (isFiniteNumber(value) && (!Number.isInteger(value) || value < 0 || value > 12)) {
      const label = LABELS[key] ?? String(key);
      if (!missing.includes(`${label} must be a whole number from 0 to 12`)) {
        missing.push(`${label} must be a whole number from 0 to 12`);
      }
    }
  }

  if (
    inputs.workerRelationship !== "employee" &&
    inputs.workerRelationship !== "independent-contractor"
  ) {
    if (!missing.includes("Choose employee or independent contractor for this scenario")) {
      missing.push("Choose employee or independent contractor for this scenario");
    }
  }
  if (inputs.compensationBasis !== "salary" && inputs.compensationBasis !== "hourly") {
    if (!missing.includes("Choose salary or hourly compensation")) {
      missing.push("Choose salary or hourly compensation");
    }
  }
  if (
    inputs.workerRelationship === "independent-contractor" &&
    inputs.compensationBasis === "salary"
  ) {
    missing.push(
      "A salaried employee and an independent-contractor engagement are not interchangeable; fixed-fee contractor terms are not modeled.",
    );
  }
  if (scenarioId === "reduced-hours") {
    const reducedHours = inputs.reducedHoursPerWeek;
    if (
      isFiniteNumber(reducedHours) &&
      isFiniteNumber(inputs.regularHoursPerWeek) &&
      reducedHours >= inputs.regularHoursPerWeek
    ) {
      missing.push("Reduced hours must be lower than regular hours");
    }
  }
  if (
    scenarioId === "reduced-hours" &&
    inputs.compensationBasis === "hourly" &&
    inputs.reducedHourlyRate === null
  ) {
    missing.push("Reduced-hours hourly rate is required for this comparison");
  }

  return missing;
}

function baselineMissing(inputs: HiringDecisionInputs): string[] {
  const missing: string[] = [];
  for (const key of ["currentCash", "monthlyOperatingCashFlow"] as const) {
    const value = inputs[key];
    if (value === null) {
      missing.push(LABELS[key] ?? key);
    } else if (!isFiniteNumber(value)) {
      missing.push(`${LABELS[key] ?? key} must be a finite number`);
    } else if (key === "currentCash" && value < 0) {
      missing.push(`${LABELS[key] ?? key} cannot be negative`);
    }
  }
  return missing;
}

function monthlyCompensation(
  inputs: HiringDecisionInputs,
  scenarioId: HiringScenarioId,
): { monthly: number; annualized: number; hours: number; employerCosts: number; oneTime: number } {
  const reduced = scenarioId === "reduced-hours";
  const hours = (reduced ? inputs.reducedHoursPerWeek : inputs.regularHoursPerWeek)!;
  let annualized: number;
  if (inputs.compensationBasis === "salary") {
    annualized = reduced ? inputs.reducedAnnualSalary! : inputs.annualSalary!;
  } else {
    annualized = (reduced ? inputs.reducedHourlyRate! : inputs.hourlyRate!) * hours * 52;
  }
  return {
    annualized,
    monthly: annualized / 12,
    hours,
    employerCosts: reduced
      ? inputs.reducedEmployerCostsMonthly!
      : inputs.employerCostsMonthly!,
    oneTime: reduced ? inputs.reducedOneTimeHiringCosts! : inputs.oneTimeHiringCosts!,
  };
}

function calculateBaseline(inputs: HiringDecisionInputs) {
  const missing = baselineMissing(inputs);
  if (missing.length) return { baseline: null, missing };
  let cash = inputs.currentCash!;
  const endingCash: number[] = [];
  for (let month = 1; month <= MONTHS; month++) {
    cash += inputs.monthlyOperatingCashFlow!;
    if (!isFiniteNumber(cash)) {
      return {
        baseline: null,
        missing: ["The 12-month baseline exceeds the supported calculation range"],
      };
    }
    endingCash.push(cash);
  }
  return {
    baseline: {
      endingCash,
      lowestEndingCash: Math.min(...endingCash),
      finalEndingCash: endingCash[endingCash.length - 1],
    },
    missing: [],
  };
}

function buildProjection(
  inputs: HiringDecisionInputs,
  scenarioId: HiringScenarioId,
  baseline: NonNullable<ReturnType<typeof calculateBaseline>["baseline"]>,
): HiringProjection | null {
  if (scenarioMissing(inputs, scenarioId).length) return null;
  const reduced = scenarioId === "reduced-hours";
  const shift = scenarioId === "delayed-hire" ? inputs.delayMonths! : 0;
  const startMonth = inputs.plannedStartMonth! + shift;
  const revenueStartMonth =
    (reduced ? inputs.reducedRevenueStartMonth! : inputs.revenueStartMonth!) + shift;
  const collectionDelay = reduced
    ? inputs.reducedCollectionDelayMonths!
    : inputs.collectionDelayMonths!;
  const revenueReceiptStartMonth = revenueStartMonth + collectionDelay;
  const revenue = reduced
    ? inputs.reducedExpectedMonthlyRevenue!
    : inputs.expectedMonthlyRevenue!;
  const variableCostPercent = reduced
    ? inputs.reducedVariableCostPercent!
    : inputs.variableCostPercent!;
  const comp = monthlyCompensation(inputs, scenarioId);
  if (
    ![
      comp.annualized,
      comp.monthly,
      comp.hours,
      comp.employerCosts,
      comp.oneTime,
      revenue,
      variableCostPercent,
    ].every(isFiniteNumber)
  ) {
    return null;
  }
  const months: HiringMonth[] = [];
  let scenarioCash = inputs.currentCash!;

  for (let month = 1; month <= MONTHS; month++) {
    const baselineOperatingCashFlow = inputs.monthlyOperatingCashFlow!;
    const active = month >= startMonth;
    const incrementalRevenueReceipts =
      month >= revenueReceiptStartMonth ? revenue : 0;
    const incrementalVariableCosts =
      incrementalRevenueReceipts * (variableCostPercent / 100);
    const compensation = active ? comp.monthly : 0;
    const explicitlyEnteredEmployerCosts = active ? comp.employerCosts : 0;
    const oneTimeHiringCosts = month === startMonth ? comp.oneTime : 0;
    const incrementalCashImpact =
      incrementalRevenueReceipts -
      incrementalVariableCosts -
      compensation -
      explicitlyEnteredEmployerCosts -
      oneTimeHiringCosts;
    scenarioCash += baselineOperatingCashFlow + incrementalCashImpact;
    const baselineEndingCash = baseline.endingCash[month - 1];
    const reserveHeadroom =
      inputs.reserveTarget === null ? null : scenarioCash - inputs.reserveTarget;
    if (
      ![
        incrementalRevenueReceipts,
        incrementalVariableCosts,
        compensation,
        explicitlyEnteredEmployerCosts,
        oneTimeHiringCosts,
        incrementalCashImpact,
        baselineEndingCash,
        scenarioCash,
        ...(reserveHeadroom === null ? [] : [reserveHeadroom]),
      ].every(isFiniteNumber)
    ) {
      return null;
    }
    months.push({
      month,
      baselineOperatingCashFlow,
      incrementalRevenueReceipts,
      incrementalVariableCosts,
      compensation,
      explicitlyEnteredEmployerCosts,
      oneTimeHiringCosts,
      incrementalCashImpact,
      baselineEndingCash,
      scenarioEndingCash: scenarioCash,
      reserveHeadroom,
    });
  }

  const scenarioTitle: Record<HiringScenarioId, string> = {
    "hire-now": "Hire at planned start",
    "reduced-hours": "Reduced-hours alternative",
    "delayed-hire": "Same hire, delayed",
  };
  return {
    scenarioId,
    title: scenarioTitle[scenarioId],
    startMonth,
    annualizedCompensation: comp.annualized,
    monthlyCompensation: comp.monthly,
    monthsBelowReserve:
      inputs.reserveTarget === null
        ? null
        : months.filter((item) => (item.reserveHeadroom ?? 0) < 0).length,
    monthsBelowZero: months.filter((item) => item.scenarioEndingCash < 0).length,
    lowestEndingCash: Math.min(...months.map((item) => item.scenarioEndingCash)),
    finalEndingCash: months[MONTHS - 1].scenarioEndingCash,
    finalIncrementalCashImpact:
      months[MONTHS - 1].scenarioEndingCash - baseline.finalEndingCash,
    months,
    limitations: [
      "The baseline monthly cash flow is held constant and is entered directly; revenue is not treated as profit or cash flow.",
      "Existing payroll, operating costs and debt payments must already be reflected in baseline cash flow; only this proposed hire is added.",
      "Employer taxes, benefits, insurance, or contractor-engagement costs are not estimated; enter known amounts explicitly. A blank is unknown, not zero.",
      "Revenue is modeled as monthly cash receipts after the entered collection delay. Variable costs are paid in the same month as those receipts.",
      "Taxes, financing, working-capital needs, seasonality, collection failure and cash-flow variability are not modeled.",
      "This is a cash projection, not an accounting-profit forecast, legal worker-classification determination, or affordability decision.",
      ...(startMonth > MONTHS
        ? ["The delayed start falls after month 12, so this projection contains no hire-related cash flows."]
        : []),
      ...(revenueReceiptStartMonth > MONTHS
        ? ["Expected receipts begin after month 12 and are excluded from this projection."]
        : []),
    ],
  };
}

export function calculateHiringDecision(
  inputs: HiringDecisionInputs,
): HiringDecisionResult {
  const baselineResult = calculateBaseline(inputs);
  const baseline = baselineResult.baseline;
  const scenarioIds: HiringScenarioId[] = [
    "hire-now",
    "reduced-hours",
    "delayed-hire",
  ];
  const scenarios = scenarioIds.map((scenarioId): HiringScenarioResult => {
    const title =
      scenarioId === "hire-now"
        ? "Hire at planned start"
        : scenarioId === "reduced-hours"
          ? "Reduced-hours alternative"
          : "Same hire, delayed";
    if (!baseline) {
      return {
        status: "incomplete",
        scenarioId,
        title,
        missingInputs: baselineResult.missing,
      };
    }
    const missingInputs = scenarioMissing(inputs, scenarioId);
    if (missingInputs.length) {
      return { status: "incomplete", scenarioId, title, missingInputs };
    }
    const projection = buildProjection(inputs, scenarioId, baseline);
    if (!projection) {
      return {
        status: "incomplete",
        scenarioId,
        title,
        missingInputs: ["Inputs exceed the supported calculation range."],
      };
    }
    return { status: "calculated", scenarioId, title, projection };
  });
  return {
    baseline,
    baselineMissingInputs: baselineResult.missing,
    scenarios,
  };
}

export function buildHiringAdvisorExplanation(result: HiringScenarioResult): {
  label: string;
  summary: string;
  findings: string[];
  nextSteps: string[];
} {
  if (result.status === "incomplete") {
    return {
      label: "Simulated explanation — no Meta request was made.",
      summary: "This scenario is incomplete; a cash projection is withheld until missing inputs are supplied.",
      findings: result.missingInputs.slice(0, 5),
      nextSteps: [
        "Enter values from current records or a clearly stated planning assumption.",
        "Keep unknown costs blank until you can support an estimate; do not enter zero just to complete the scenario.",
      ],
    };
  }
  const projection = result.projection;
  const lowestMonth = projection.months.find(
    (item) => item.scenarioEndingCash === projection.lowestEndingCash,
  )?.month;
  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  const reserveFinding =
    projection.monthsBelowReserve === null
      ? `No reserve target was entered, so a reserve comparison is unavailable. The lowest modeled cash balance is ${formatMoney(projection.lowestEndingCash)} in month ${lowestMonth ?? "unknown"}.`
      : projection.monthsBelowReserve > 0
        ? `The modeled cash balance falls below the entered reserve target in ${projection.monthsBelowReserve} of 12 months. Its lowest modeled balance is ${formatMoney(projection.lowestEndingCash)} in month ${lowestMonth ?? "unknown"}.`
        : `The modeled cash balance stays at or above the entered reserve target in all 12 months. Its lowest modeled balance is ${formatMoney(projection.lowestEndingCash)} in month ${lowestMonth ?? "unknown"}.`;
  const negativeCashFinding =
    projection.monthsBelowZero > 0
      ? `The modeled cash balance is below $0 in ${projection.monthsBelowZero} of 12 months.`
      : "The modeled cash balance does not fall below $0 in the 12-month projection.";
  return {
    label: "Simulated explanation — no Meta request was made.",
    summary: "This explanation restates the deterministic cash projection; it does not change inputs or decide affordability.",
    findings: [
      reserveFinding,
      negativeCashFinding,
      `The modeled month-12 cash balance is ${formatMoney(projection.finalEndingCash)}.`,
      `The modeled 12-month cash difference versus the no-hire baseline is ${formatMoney(projection.finalIncrementalCashImpact)}.`,
    ],
    nextSteps: [
      "Review the cash-receipt delay and variable-cost assumption against the expected work.",
      "Test a lower-revenue or later-collection case before making a commitment.",
    ],
  };
}
