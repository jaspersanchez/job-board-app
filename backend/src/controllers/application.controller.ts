import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import JobModel from "../models/job.model";
import ApplicationModel from "../models/application.model";

export const applyToJob = async (req: AuthRequest, res: Response) => {
  const applicantId = req.user?._id!;
  // get job from db
  const job = await JobModel.findById(req.params.jobId);

  if (!job || !job.isActive) {
    res.status(404).json({ message: "Job not found or closed" });
    return;
  }
  console.log(req.file);
  // check if already applied
  const existing = await ApplicationModel.findOne({
    job: job._id,
    applicant: applicantId,
  });

  if (existing) {
    res.status(400).json({ message: "You already applied to this job" });
    return;
  }

  const resumeUrl = (req.file as any)?.path;

  console.log(resumeUrl, "Hey");

  if (!resumeUrl) {
    res.status(400).json({ message: "Resume is required" });
    return;
  }

  const application = await ApplicationModel.create({
    job: job._id,
    applicant: applicantId,
    resumeUrl,
  });

  res.status(201).json(application);
};
