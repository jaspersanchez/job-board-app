import mongoose from "mongoose";

export type ApplicationStatus = "pending" | "reviewed" | "rejected";

export interface IApplication extends mongoose.Document {
  job: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  resumeUrl: string;
  status: ApplicationStatus;
}

const applicationSchema = new mongoose.Schema<IApplication>(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// prevent duplicate application - one application per job
applicationSchema.index({ job: 1, application: 1 }, { unique: true });

const ApplicationModel = mongoose.model<IApplication>(
  "Application",
  applicationSchema,
);

export default ApplicationModel;
