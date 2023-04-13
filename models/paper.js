import mongoose from "mongoose";

const PaperSchema = new mongoose.Schema({
    title: String,
    abstract: String,
    authors: [String],
    url: String,
    classifications: [String],
});

// the title is unique
PaperSchema.index({ title: 1 }, { unique: true });

const Paper = mongoose.models.Paper || mongoose.model("Paper", PaperSchema);

export default Paper;