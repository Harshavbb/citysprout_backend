import Analysis from "../models/Analysis.js";
import analyzeSpace from "../services/recommendationService.js";


export const uploadImage = async (
  req,
  res
) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const imageUrl =
      `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(200).json({
      url: imageUrl
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


export const detectSpace = async (
  req,
  res
) => {

  try {

    const {
      image_url,
      sunlight,
      water_availability,
      user_id
    } = req.body;

    const analysisResult =
      analyzeSpace(
        sunlight,
        water_availability
      );

    await Analysis.create({
      userId: user_id,

      imageUrl: image_url,

      sunlight,

      waterAvailability:
        water_availability,

      spaceType:
        analysisResult.spaceType,

      primaryRecommendation:
        analysisResult.primaryRecommendation,

      suitableCrops:
        analysisResult.suitableCrops,

      confidenceScore:
        analysisResult.confidenceScore
    });

    res.status(200).json({
      status: "success",

      analysis: {
        space_type:
          analysisResult.spaceType,

        primary_recommendation:
          analysisResult.primaryRecommendation,

        suitable_crops:
          analysisResult.suitableCrops,

        confidence_score:
          analysisResult.confidenceScore
      }
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

export const getAnalysisHistory = async (
  req,
  res
) => {

  try {

    const { userId } = req.params;

    const analyses =
      await Analysis.find({
        userId
      })
      .sort({
        createdAt: -1
      });

    res.status(200).json(
      analyses
    );

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

export const deleteAnalysis =
async (req, res) => {

  try {

    const { analysisId } =
      req.params;

    const analysis =
      await Analysis.findById(
        analysisId
      );

    if (!analysis) {

      return res.status(404)
      .json({
        message:
          "Analysis not found"
      });

    }

    await Analysis.findByIdAndDelete(
      analysisId
    );

    res.status(200).json({
      message:
        "Analysis deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};