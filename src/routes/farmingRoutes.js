import express from "express";

import upload
from "../middleware/uploadMiddleware.js";

import {
  uploadImage,
  detectSpace,
  getAnalysisHistory,
  deleteAnalysis
}
from "../controllers/farmingController.js";

const router = express.Router();

router.post(
  "/upload",
  upload.single("file"),
  uploadImage
);

router.post(
  "/detect",
  detectSpace
);

router.get(
  "/history/:userId",
  getAnalysisHistory
);

router.delete(
  "/history/:analysisId",
  deleteAnalysis
);

export default router;