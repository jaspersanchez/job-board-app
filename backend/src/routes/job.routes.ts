import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  createJob,
  deleteJob,
  getJobById,
  getJobs,
  getMyJobs,
  updateJob,
} from "../controllers/job.controller";
import { requireRole } from "../middleware/role.middleware";

const router = express.Router();

router.get("/", getJobs);
router.get("/mine", protect, requireRole("employer"), getMyJobs);
router.get("/:id", getJobById);
router.post("/", protect, requireRole("employer"), createJob);
router.put("/:id", protect, requireRole("employer"), updateJob);
router.delete("/:id", protect, requireRole("employer"), deleteJob);

export default router;
