import { analyzeGardenImage } from "../services/visionService.js";

export const analyzeGardenSpace = async (req, res, next) => {
  try {
    console.log("1. Vision route reached");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a garden image"
      });
    }

    console.log("2. Image received:", {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    });

    console.time("Gemini analysis");

    const analysis = await analyzeGardenImage(req.file);

    console.timeEnd("Gemini analysis");
    console.log("3. Gemini response received");

    return res.status(200).json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error("Vision controller error:", error);
    next(error);
  }
};