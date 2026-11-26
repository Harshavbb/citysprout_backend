
import mongoose from "mongoose";

import Analysis from "../models/Analysis.js";
import analyzeSpace from "../services/recommendationService.js";
import { analyzeGardenImage } from "../services/visionService.js";

// ============================================
// ANALYZE GARDEN
// ============================================

export const analyzeGarden = async (req, res) => {
  const timerLabel = `Garden analysis ${Date.now()}`;

  try {
    const {
      user_id,
      sunlight,
      water_availability,
      available_area,
      maintenance = "low",
      season,
    } = req.body;

    // 1. Validate image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Garden image is required",
      });
    }

    // 2. Validate user ID
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({
        success: false,
        message: "A valid MongoDB user ID is required",
      });
    }

    // 3. Validate required fields
    if (
      sunlight === undefined ||
      sunlight === null ||
      String(sunlight).trim() === "" ||
      water_availability === undefined ||
      String(water_availability).trim() === "" ||
      available_area === undefined ||
      String(available_area).trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Sunlight, water availability and available area are required",
      });
    }

    // 4. Normalize numeric inputs
    const sunlightHours = Number(sunlight);
    const availableArea = Number(available_area);

    if (
      !Number.isFinite(sunlightHours) ||
      sunlightHours < 0 ||
      sunlightHours > 24
    ) {
      return res.status(400).json({
        success: false,
        message: "Sunlight must be between 0 and 24 hours",
      });
    }

    if (
      !Number.isFinite(availableArea) ||
      availableArea <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Available area must be a positive number in square feet",
      });
    }

    const waterAccess = String(water_availability)
      .toLowerCase()
      .trim();

    if (
      !["reliable", "intermittent", "limited"].includes(
        waterAccess
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Water availability must be reliable, intermittent or limited",
      });
    }

    const maintenanceLevel = String(maintenance)
      .toLowerCase()
      .trim();

    if (
      !["low", "medium", "high"].includes(
        maintenanceLevel
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Maintenance must be low, medium or high",
      });
    }

    const selectedSeason = season
      ? String(season).toLowerCase().trim()
      : "";

    if (
      selectedSeason &&
      !["rabi", "kharif", "zaid", "perennial"].includes(
        selectedSeason
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Season must be rabi, kharif, zaid or perennial",
      });
    }

    console.time(timerLabel);

    // 5. Analyze the garden image using Gemini Vision
    const visionResult = await analyzeGardenImage(req.file);

    // 6. Generate crop recommendations
    // Gemini provides visual information.
    // User inputs provide sunlight, water, area and maintenance.
    const recommendationResult = analyzeSpace(
      visionResult,
      {
        sunlightHours,
        waterAccess,
        availableArea,
        maintenance: maintenanceLevel,
        season: selectedSeason,
      }
    );

    // 7. Save the complete analysis
    const savedAnalysis = await Analysis.create({
      userId: user_id,

      sunlightHours,

      waterAccess,

      availableArea,

      areaUnit: "sq_ft",

      maintenance: maintenanceLevel,

      season: selectedSeason || null,

      visionAnalysis: visionResult,

      spaceType: recommendationResult.spaceType,

      primaryRecommendation:
        recommendationResult.primaryRecommendation,

      suitableCrops:
        recommendationResult.suitableCrops,

      totalEvaluated:
        recommendationResult.totalEvaluated,

      eligibleCount:
        recommendationResult.eligibleCount,

      warnings:
        recommendationResult.warnings,

      scoringNote:
        recommendationResult.scoringNote,
    });

    console.timeEnd(timerLabel);

    // 8. Return combined response
    return res.status(200).json({
      success: true,
      message: "Garden analyzed successfully",

      analysisId: savedAnalysis._id,

      vision: visionResult,

      recommendations: recommendationResult,
    });

  } catch (error) {
    console.error("Garden analysis error:", error);

    console.timeEnd(timerLabel);

    const inputErrors = [
      "Sunlight hours",
      "Water access",
      "Available area",
      "Maintenance",
      "Season",
      "growing space",
    ];

    const isInputError = inputErrors.some((message) =>
      error.message?.includes(message)
    );

    return res.status(isInputError ? 400 : 500).json({
      success: false,
      message: isInputError
        ? error.message
        : "Unable to analyze garden",
    });
  }
};


// ============================================
// UPLOAD IMAGE
// ============================================

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const imageUrl =
      `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      url: imageUrl,
    });

  } catch (error) {
    console.error("Image upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload image",
    });
  }
};


// ============================================
// LEGACY DETECT SPACE ENDPOINT
// ============================================

export const detectSpace = async (req, res) => {
  return res.status(410).json({
    success: false,
    message:
      "This endpoint has been replaced. Use POST /api/farming/analyze.",
  });
};


// ============================================
// GET ANALYSIS HISTORY
// ============================================

export const getAnalysisHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const analyses = await Analysis.find({
      userId,
    })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: analyses.length,
      analyses,
    });

  } catch (error) {
    console.error("Analysis history error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve analysis history",
    });
  }
};


// ============================================
// DELETE ANALYSIS
// ============================================

export const deleteAnalysis = async (req, res) => {
  try {
    const { analysisId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(analysisId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid analysis ID",
      });
    }

    const analysis = await Analysis.findById(analysisId);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    await Analysis.findByIdAndDelete(analysisId);

    return res.status(200).json({
      success: true,
      message: "Analysis deleted successfully",
    });

  } catch (error) {
    console.error("Delete analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete analysis",
    });
  }
};
