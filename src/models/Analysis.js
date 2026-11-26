
import mongoose from "mongoose";

const scoreBreakdownSchema = new mongoose.Schema(
  {
    sunlight: { type: Number, default: null },
    water: { type: Number, default: null },
    area: { type: Number, default: null },
    space: { type: Number, default: null },
    growingMethod: { type: Number, default: null },
    maintenance: { type: Number, default: null },
    season: { type: Number, default: null },
  },
  {
    _id: false,
  }
);

const cropRecommendationSchema = new mongoose.Schema(
  {
    crop: String,
    cropId: String,

    // Scores
    score: Number,
    matchScore: Number,
    assessedMatch: Number,
    evidenceCoverage: Number,

    // Confidence
    confidence: String,
    recommendationConfidence: String,
    dataConfidence: String,

    // Factor-level breakdown
    scoreBreakdown: {
      type: scoreBreakdownSchema,
      default: () => ({}),
    },

    assessedFactors: [String],
    unassessedFactors: [String],

    // Explanation
    reasons: [String],

    // Growing methods
    suitableMethods: [String],
    compatibleMethods: [String],

    // Maintenance
    maintenance: String,
  },
  {
    _id: false,
  }
);

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imageUrl: {
      type: String,
      default: null,
    },

    sunlightHours: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },

    waterAccess: {
      type: String,
      enum: ["reliable", "intermittent", "limited"],
      required: true,
    },

    availableArea: {
      type: Number,
      required: true,
      min: 0.01,
    },

    areaUnit: {
      type: String,
      default: "sq_ft",
    },

    maintenance: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    season: {
      type: String,
      enum: ["rabi", "kharif", "zaid", "perennial", null],
      default: null,
    },

    visionAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    spaceType: String,

    primaryRecommendation: String,

    topCrop: {
      type: cropRecommendationSchema,
      default: null,
    },

    suitableCrops: {
      type: [cropRecommendationSchema],
      default: [],
    },

    totalEvaluated: Number,

    eligibleCount: Number,

    warnings: [String],

    scoringNote: String,

    rankingNote: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Analysis", analysisSchema);
