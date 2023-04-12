import mongoose from "mongoose";

const PaperSchema = new mongoose.Schema({
    title: String,
    abstract: String,
    url: String,
    classifications: [String],
});

const Paper = mongoose.models.Paper || mongoose.model("Paper", PaperSchema);

export default Paper;