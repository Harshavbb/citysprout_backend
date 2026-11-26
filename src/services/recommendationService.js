
import cropKnowledgeBase from "../data/cropKnowledgeBase.js";

const WEIGHTS = {
  sunlight: 25,
  water: 15,
  area: 10,
  space: 10,
  growingMethod: 15,
  maintenance: 10,
  season: 15,
};

const FACTORS = Object.keys(WEIGHTS);

const normalize = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const numberOrNull = (value) => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const normalizeSpace = (value) => {
  const space = normalize(value);

  if (space === "balcony / terrace") return "balcony";
  if (space === "indoor space") return "indoor";

  return space;
};

const clamp = (value) => Math.max(0, Math.min(1, value));

const sunlightFit = (crop, hours) => {
  const requirement = crop.sunlightRequirement;

  if (!requirement || requirement.minHours == null || hours === null) {
    return null;
  }

  if (hours < requirement.minHours) return 0;

  if (
    requirement.idealHours == null ||
    hours >= requirement.idealHours
  ) {
    return 1;
  }

  const range = requirement.idealHours - requirement.minHours;

  if (range <= 0) return 1;

  return (
    0.75 +
    0.25 * ((hours - requirement.minHours) / range)
  );
};

const getDataConfidence = (crop) => {
  const confidence = normalize(crop.dataConfidence);

  if (["high", "moderate", "partial", "provisional", "low"].includes(confidence)) {
    return confidence;
  }

  return "unknown";
};

const getRecommendationConfidence = (coverage, dataConfidence) => {
  if (coverage >= 80 && ["high"].includes(dataConfidence)) {
    return "high";
  }

  if (
    coverage >= 60 &&
    ["high", "moderate"].includes(dataConfidence)
  ) {
    return "moderate";
  }

  return "low";
};

const scoreCrop = (crop, conditions) => {
  const factors = {};

  const add = (name, fit) => {
    if (fit !== null && fit !== undefined) {
      factors[name] = clamp(fit);
    }
  };

  // 1. Sunlight
  add(
    "sunlight",
    sunlightFit(crop, conditions.sunlightHours)
  );

  // 2. Water access
  if (
    crop.waterAccessCompatibility &&
    crop.waterAccessCompatibility[conditions.waterAccess] != null
  ) {
    add(
      "water",
      crop.waterAccessCompatibility[conditions.waterAccess]
    );
  }

  // 3. Available area
  if (crop.minimumAreaSqFt != null) {
    add(
      "area",
      conditions.availableArea >= crop.minimumAreaSqFt ? 1 : 0
    );
  }

  // 4. Growing space
  if (Array.isArray(crop.spaceTypes) && crop.spaceTypes.length > 0) {
    add(
      "space",
      crop.spaceTypes.map(normalize).includes(conditions.spaceType) ? 1 : 0
    );
  }

  // 5. Growing method
  if (
    Array.isArray(crop.methods) &&
    crop.methods.length > 0 &&
    conditions.growingMethods.length > 0
  ) {
    const cropMethods = crop.methods.map(normalize);

    add(
      "growingMethod",
      cropMethods.some((method) =>
        conditions.growingMethods.includes(method)
      )
        ? 1
        : 0
    );
  }

  // 6. Maintenance
  if (crop.maintenanceRequirement) {
    add(
      "maintenance",
      normalize(crop.maintenanceRequirement) === conditions.maintenance
        ? 1
        : 0
    );
  }

  // 7. Season
  if (
    conditions.season &&
    Array.isArray(crop.seasons) &&
    crop.seasons.length > 0
  ) {
    add(
      "season",
      crop.seasons.map(normalize).includes(conditions.season) ? 1 : 0
    );
  }

  const assessedFactors = Object.keys(factors);

  const unassessedFactors = FACTORS.filter(
    (factor) => !assessedFactors.includes(factor)
  );

  const evidenceCoverage = assessedFactors.reduce(
    (total, factor) => total + WEIGHTS[factor],
    0
  );

  const earnedWeight = Object.entries(factors).reduce(
    (total, [factor, fit]) => total + WEIGHTS[factor] * fit,
    0
  );

  // Weighted contribution across all seven factors.
  const matchScore = Math.round(earnedWeight);

  // Compatibility among only the factors with available data.
  const assessedMatch =
    evidenceCoverage > 0
      ? Math.round((earnedWeight / evidenceCoverage) * 100)
      : null;

  const dataConfidence = getDataConfidence(crop);

  const recommendationConfidence = getRecommendationConfidence(
    evidenceCoverage,
    dataConfidence
  );

  const scoreBreakdown = {};

  for (const factor of FACTORS) {
    scoreBreakdown[factor] =
      factors[factor] === undefined
        ? null
        : Math.round(factors[factor] * 100);
  }

  const reasons = [];

  if (factors.sunlight === 1) {
    reasons.push("Sunlight meets the recorded crop requirement.");
  } else if (factors.sunlight === 0) {
    reasons.push("Available sunlight is below the recorded requirement.");
  } else if (factors.sunlight !== undefined) {
    reasons.push("Sunlight partially meets the recorded crop requirement.");
  }

  if (factors.water === 1) {
    reasons.push("Water availability matches the recorded requirement.");
  } else if (factors.water === 0) {
    reasons.push("Water availability does not match the recorded requirement.");
  }

  if (factors.area === 1) {
    reasons.push("Available area meets the recorded minimum.");
  } else if (factors.area === 0) {
    reasons.push("Available area is below the recorded minimum.");
  }

  if (factors.space === 1) {
    reasons.push("Listed as suitable for this growing space.");
  } else if (factors.space === 0) {
    reasons.push("This growing space is not listed as suitable.");
  }

  if (factors.growingMethod === 1) {
    reasons.push("Supports at least one visually suggested growing method.");
  } else if (factors.growingMethod === 0) {
    reasons.push("No suggested growing method matches the recorded methods.");
  }

  if (factors.maintenance === 1) {
    reasons.push("Matches the recorded maintenance requirement.");
  } else if (factors.maintenance === 0) {
    reasons.push("Does not match the recorded maintenance requirement.");
  }

  if (factors.season === 1) {
    reasons.push("Matches the recorded seasonal suitability.");
  } else if (factors.season === 0) {
    reasons.push("Does not match the recorded seasonal suitability.");
  }

  if (unassessedFactors.length > 0) {
    reasons.push(
      `${unassessedFactors.length} factor(s) could not be assessed due to incomplete crop data or missing inputs.`
    );
  }

  return {
    crop: crop.name,
    cropId: crop.id,

    // Existing frontend compatibility
    score: matchScore,
    confidence: recommendationConfidence,

    // Explicit scoring details
    matchScore,
    assessedMatch,
    evidenceCoverage,
    recommendationConfidence,

    scoreBreakdown,
    assessedFactors,
    unassessedFactors,
    reasons,

    suitableMethods: crop.methods || [],
    compatibleMethods: (crop.methods || []).filter((method) =>
      conditions.growingMethods.includes(normalize(method))
    ),

    maintenance: crop.maintenance || null,
    dataConfidence,
  };
};

const analyzeSpace = (vision, preferences) => {
  if (!vision || !preferences) {
    throw new Error("Vision analysis and user preferences are required");
  }

  const conditions = {
    sunlightHours: numberOrNull(preferences.sunlightHours),
    availableArea: numberOrNull(preferences.availableArea),
    waterAccess: normalize(preferences.waterAccess),
    maintenance: normalize(preferences.maintenance),
    season: normalize(preferences.season),
    spaceType: normalizeSpace(vision.spaceType),

    growingMethods: Array.isArray(vision.growingMethods)
      ? vision.growingMethods.map(normalize)
      : [],
  };

  if (
    conditions.sunlightHours === null ||
    conditions.sunlightHours < 0 ||
    conditions.sunlightHours > 24
  ) {
    throw new Error("Sunlight hours must be between 0 and 24");
  }

  if (!["reliable", "intermittent", "limited"].includes(conditions.waterAccess)) {
    throw new Error("Water access must be reliable, intermittent or limited");
  }

  if (
    conditions.availableArea === null ||
    conditions.availableArea <= 0
  ) {
    throw new Error("Available area must be a positive number in square feet");
  }

  if (!["low", "medium", "high"].includes(conditions.maintenance)) {
    throw new Error("Maintenance must be low, medium or high");
  }

  if (
    conditions.season &&
    !["rabi", "kharif", "zaid", "perennial"].includes(conditions.season)
  ) {
    throw new Error("Season must be rabi, kharif, zaid or perennial");
  }

  if (!conditions.spaceType || conditions.spaceType === "unknown") {
    throw new Error("A valid growing space type is required");
  }

  const eligibleCrops = cropKnowledgeBase.filter((crop) =>
    crop.spaceTypes?.map(normalize).includes(conditions.spaceType)
  );

  const suitableCrops = eligibleCrops
    .map((crop) => scoreCrop(crop, conditions))
    .filter(Boolean)
    .sort(
      (a, b) =>
        b.evidenceCoverage - a.evidenceCoverage ||
        b.matchScore - a.matchScore ||
        b.assessedMatch - a.assessedMatch ||
        a.crop.localeCompare(b.crop)
    )
    .slice(0, 5);

  const warnings = [];

  const constraints = (vision.potentialConstraints || []).map(normalize);

  if (
    constraints.some(
      (item) => item.includes("slop") || item.includes("uneven")
    )
  ) {
    warnings.push(
      "Check drainage and level or terrace sloped ground before planting."
    );
  }

  if (vision.imageQuality === "poor") {
    warnings.push(
      "Image quality is poor. A clearer image may improve the visual assessment."
    );
  }

  if (!conditions.season) {
    warnings.push(
      "No season selected. Seasonal suitability has not been assessed."
    );
  }

  if (suitableCrops.some((crop) => crop.recommendationConfidence === "low")) {
    warnings.push(
      "Crop data is incomplete. Treat these results as preliminary candidates."
    );
  }

  if (!suitableCrops.length) {
    warnings.push(
      "No crops in the current dataset match this growing space."
    );
  }

  return {
    spaceType: vision.spaceType,

    primaryRecommendation:
      conditions.growingMethods[0] || "Manual assessment required",

    topCrop: suitableCrops[0] || null,
    suitableCrops,

    totalEvaluated: cropKnowledgeBase.length,
    eligibleCount: eligibleCrops.length,

    warnings,

    scoringNote:
      "Match score represents weighted support across all seven factors. Unknown factors are not treated as failures. Evidence coverage indicates how much of the scoring model could be assessed.",

    rankingNote:
      "Crops are ranked by evidence coverage first, then weighted match score and assessed compatibility.",
  };
};

export default analyzeSpace;
