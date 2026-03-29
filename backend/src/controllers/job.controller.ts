import { Request, Response } from "express";
import JobModel from "../models/job.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { JsonWebTokenError } from "jsonwebtoken";

// public — search + filter
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  // extract query params
  const { search, type, location, page = "1", limit = "10" } = req.query;

  // make a filter object with conditions
  const filter: Record<string, any> = { isActive: true };
  // filters
  if (search) filter.$text = { $search: search };
  if (type) filter.type = type;
  if (location) filter.location = { $regex: location, $options: "i" };

  // pagination
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const total = await JobModel.countDocuments(filter);

  // query db
  const jobs = await JobModel.find(filter)
    .populate("employer", "name email")
    .skip(skip)
    .limit(parseInt(limit as string)); // replace emp id to name email
  // return result, total, page, total page

  res.json({
    jobs,
    total,
    page,
    totalPages: Math.ceil(total / parseInt(limit as string)),
  });
};

export const getJobById = async (req: AuthRequest, res: Response) => {
  const job = await JobModel.findById(req.params.id).populate(
    "employer",
    "name email",
  );
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  res.json(job);
};

export const getMyJobs = async (req: AuthRequest, res: Response) => {
  const employer = req.user?._id!;

  const jobs = await JobModel.find({ employer }).sort({ createdAt: -1 });

  res.json(jobs);
};

export const createJob = async (req: AuthRequest, res: Response) => {
  const employer = req.user?._id!;
  const job = await JobModel.create({ ...req.body, employer });

  res.status(201).json(job);
};

export const updateJob = async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  const myId = req.user?._id!;

  const job = await JobModel.findById(id);

  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }

  if (job.employer.toString() !== myId.toString()) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  const updated = await JobModel.findByIdAndUpdate(id, req.body, {
    returnDocument: "after",
  });

  res.json(updated);
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  const myId = req.user?._id!;

  const job = await JobModel.findById(id);

  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }

  if (job.employer.toString() !== myId.toString()) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  await job.deleteOne();

  res.json({ message: "Job deleted" });
};
