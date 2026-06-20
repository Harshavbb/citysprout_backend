import mongoose from "mongoose";

const analysisSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      imageUrl: String,

      sunlight: String,

      waterAvailability: String,

      spaceType: String,

      primaryRecommendation: String,

      suitableCrops: [String],

      confidenceScore: Number
    },
    {
      timestamps: true
    }
  );

export default mongoose.model(
  "Analysis",
  analysisSchema
);