import express from "express";
import { protect } from "../middleware/auth.middleware";
import { uploadResume } from "../middleware/upload.middleware";
import { requireRole } from "../middleware/role.middleware";
import { applyToJob } from "../controllers/application.controller";

const router = express.Router();

router.post(
  "/:jobId",
  protect,
  requireRole("applicant"),
  uploadResume.single("resume"),
  applyToJob,
);

export default router;
