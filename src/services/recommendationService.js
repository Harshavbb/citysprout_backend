const analyzeSpace = (
  sunlight,
  waterAvailability
) => {

  if (
    sunlight === "High Sunlight" &&
    waterAvailability === "Directly Available"
  ) {
    return {
      spaceType: "Balcony / Terrace",
      primaryRecommendation:
        "Standard Soil Pots",

      suitableCrops: [
        "Tomatoes",
        "Peppers",
        "Mint",
        "Chillies"
      ],

      confidenceScore: 0.92
    };
  }

  if (
    sunlight === "High Sunlight" &&
    waterAvailability === "Limited"
  ) {
    return {
      spaceType: "Terrace",
      primaryRecommendation:
        "Drip Irrigation",

      suitableCrops: [
        "Tomatoes",
        "Brinjal",
        "Okra"
      ],

      confidenceScore: 0.88
    };
  }

  if (
    sunlight === "Medium Sunlight"
  ) {
    return {
      spaceType: "Balcony",
      primaryRecommendation:
        "Vertical Gardening",

      suitableCrops: [
        "Spinach",
        "Lettuce",
        "Coriander"
      ],

      confidenceScore: 0.85
    };
  }

  return {
    spaceType: "Indoor Space",

    primaryRecommendation:
      "Hydroponic Setup",

    suitableCrops: [
      "Microgreens",
      "Mint",
      "Basil"
    ],

    confidenceScore: 0.80
  };
};

export default analyzeSpace;