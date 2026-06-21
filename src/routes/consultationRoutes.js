import express from "express";

const router = express.Router();

router.get("/services", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Urban Farming Consultation",
      description:
        "Personalized advice for balcony and terrace gardening.",
      price: "₹499",
    },
    {
      id: 2,
      name: "Garden Setup Assistance",
      description:
        "Complete setup support for urban gardens.",
      price: "₹1499",
    },
    {
      id: 3,
      name: "Hydroponics Planning",
      description:
        "Guidance for hydroponic farming systems.",
      price: "₹999",
    },
  ]);
});

export default router;