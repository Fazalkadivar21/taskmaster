import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
    },
    discription: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["High", "Mid", "Low"],
      default: "Low",
    },
    isCompleted: {
      type: String,
      enum : ["Completed","In-progress","Pending","Over due"],
      default: "In-progress",
    },
    due: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.task || mongoose.model("task", taskSchema);
