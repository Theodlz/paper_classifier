import mongoose from "mongoose";

const ClassificationsSchema = new mongoose.Schema({
    classifications: [String],
});

const Classifications = mongoose.models.Classifications || mongoose.model("Classifications", ClassificationsSchema);

export default Classifications;