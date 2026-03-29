import mongoose, { Schema, Document } from "mongoose";

export type JobType = "full-time" | "part-time" | "remote" | "contract";

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: JobType;
  description: string;
  salary?: string;
  employer: mongoose.Types.ObjectId;
  isActive: boolean;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["full-time", "part-time", "remote", "contract"],
      required: true,
    },
    description: { type: String, required: true },
    salary: { type: String },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// text index enables MongoDB full-text search on title and description
jobSchema.index({ title: "text", description: "text", company: "text" });
jobSchema.index({ employer: 1 });

const JobModel = mongoose.model<IJob>("Job", jobSchema);
export default JobModel;
