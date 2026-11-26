import express from "express";

import upload
from "../middleware/uploadMiddleware.js";

import {
  uploadImage,
  detectSpace,
  getAnalysisHistory,
  deleteAnalysis,
  analyzeGarden
}
from "../controllers/farmingController.js";


import visionUpload from "../middleware/visionUploadMiddleware.js";
import { analyzeGardenSpace } from "../controllers/visionController.js";

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

router.post(
  "/vision",
  visionUpload.single("file"),
  analyzeGardenSpace
);

router.post(
  "/analyze",
  visionUpload.single("file"),
  analyzeGarden
);
export default router;