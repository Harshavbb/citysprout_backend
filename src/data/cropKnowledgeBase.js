
const cropKnowledgeBase = [
  {
    id: "tomato",
    name: "Tomato",

    sunlightRequirement: {
      minHours: 6,
      idealHours: 8,
    },

    waterRequirement: "moderate",
    minimumAreaSqFt: null,

    recommendedSpacingCm: {
      row: 60,
      plant: 45,
    },

    spaceTypes: ["backyard", "terrace", "balcony"],
    methods: ["container gardening", "raised beds"],

    maintenance: "medium",
    maintenanceRequirement: null,

    seasons: [],

    dataConfidence: "partial",

    waterAccessCompatibility: null,

    dataNotes: [
      "Spacing varies by variety and cultivation system.",
      "Planting season must be determined by region.",
      "Water access compatibility has not been verified."
    ],
  },

  {
    id: "chilli",
    name: "Chilli",

    sunlightRequirement: {
      minHours: null,
      idealHours: null,
    },

    waterRequirement: "moderate",
    minimumAreaSqFt: null,

    recommendedSpacingCm: {
      row: 60,
      plant: 45,
    },

    spaceTypes: ["backyard", "terrace", "balcony"],
    methods: ["container gardening", "raised beds"],

    maintenance: "medium",
    maintenanceRequirement: null,

    seasons: [],

    dataConfidence: "partial",

    waterAccessCompatibility: null,

    dataNotes: [
      "Spacing is based on an ICAR cultivation advisory.",
      "Planting window varies across regions and varieties.",
      "Sunlight and water-access thresholds need verification."
    ],
  },

  {
    id: "spinach",
    name: "Spinach",

    sunlightRequirement: {
      minHours: null,
      idealHours: null,
    },

    waterRequirement: "moderate",
    minimumAreaSqFt: null,

    recommendedSpacingCm: null,

    spaceTypes: ["backyard", "terrace", "balcony"],
    methods: ["container gardening", "raised beds"],

    maintenance: "low",
    maintenanceRequirement: null,

    seasons: [],

    dataConfidence: "partial",

    waterAccessCompatibility: null,

    dataNotes: [
      "Growing windows vary with local temperature and climate.",
      "Do not assume year-round suitability in every region."
    ],
  },

  {
    id: "mint",
    name: "Mint",

    sunlightRequirement: {
      minHours: null,
      idealHours: null,
    },

    waterRequirement: "moderate",
    minimumAreaSqFt: null,

    recommendedSpacingCm: null,

    spaceTypes: [
      "backyard",
      "terrace",
      "balcony",
      "indoor",
      "windowsill",
    ],

    methods: ["container gardening", "vertical gardening"],

    maintenance: "low",
    maintenanceRequirement: null,

    seasons: [],

    dataConfidence: "provisional",

    waterAccessCompatibility: null,

    dataNotes: [
      "Indoor suitability depends on available light and ventilation.",
      "Water and sunlight requirements need crop-specific verification."
    ],
  },

  {
    id: "coriander",
    name: "Coriander",

    sunlightRequirement: {
      minHours: null,
      idealHours: null,
    },

    waterRequirement: "moderate",
    minimumAreaSqFt: null,

    recommendedSpacingCm: null,

    spaceTypes: [
      "backyard",
      "terrace",
      "balcony",
      "windowsill",
    ],

    methods: ["container gardening", "raised beds"],

    maintenance: "low",
    maintenanceRequirement: null,

    seasons: [],

    dataConfidence: "provisional",

    waterAccessCompatibility: null,

    dataNotes: [
      "Sowing window varies with regional temperature.",
      "Heat sensitivity and variety should be considered."
    ],
  },

  {
    id: "lettuce",
    name: "Lettuce",

    sunlightRequirement: {
      minHours: null,
      idealHours: null,
    },

    waterRequirement: "moderate",
    minimumAreaSqFt: null,

    recommendedSpacingCm: null,

    spaceTypes: [
      "backyard",
      "terrace",
      "balcony",
      "indoor",
    ],

    methods: ["container gardening", "hydroponics"],

    maintenance: "medium",
    maintenanceRequirement: null,

    seasons: [],

    dataConfidence: "provisional",

    waterAccessCompatibility: null,

    dataNotes: [
      "Heat tolerance varies by lettuce variety.",
      "Indoor and hydroponic suitability requires suitable growing conditions."
    ],
  },

  {
    id: "okra",
    name: "Okra",

    sunlightRequirement: {
      minHours: null,
      idealHours: null,
    },

    waterRequirement: "moderate",
    minimumAreaSqFt: null,

    recommendedSpacingCm: {
      row: 60,
      plant: 45,
    },

    spaceTypes: ["backyard", "terrace"],
    methods: ["raised beds", "container gardening"],

    maintenance: "low",
    maintenanceRequirement: null,

    seasons: [],

    dataConfidence: "partial",

    waterAccessCompatibility: null,

    dataNotes: [
      "ICAR-IIVR lists warm-season sowing windows and 60 x 45 cm spacing.",
      "Actual planting windows vary by region."
    ],
  },

  {
    id: "microgreens",
    name: "Microgreens",

    sunlightRequirement: {
      minHours: null,
      idealHours: null,
    },

    waterRequirement: "moderate",
    minimumAreaSqFt: null,

    recommendedSpacingCm: null,

    spaceTypes: [
      "backyard",
      "terrace",
      "balcony",
      "indoor",
      "windowsill",
    ],

    methods: ["container gardening", "indoor gardening"],

    maintenance: "low",
    maintenanceRequirement: null,

    seasons: ["perennial"],

    dataConfidence: "provisional",

    waterAccessCompatibility: null,

    dataNotes: [
      "Growing duration and conditions depend on the seed crop.",
      "Perennial here means flexible year-round production, not a perennial plant."
    ],
  },

  {
    id: "basil",
    name: "Basil",

    sunlightRequirement: {
      minHours: null,
      idealHours: null,
    },

    waterRequirement: "moderate",
    minimumAreaSqFt: null,

    recommendedSpacingCm: null,

    spaceTypes: [
      "backyard",
      "terrace",
      "balcony",
      "windowsill",
    ],

    methods: ["container gardening"],

    maintenance: "low",
    maintenanceRequirement: null,

    seasons: [],

    dataConfidence: "provisional",

    waterAccessCompatibility: null,

    dataNotes: [
      "Growing conditions vary by basil species and local climate.",
      "Sunlight and water requirements need verification."
    ],
  },
];

export default cropKnowledgeBase;
