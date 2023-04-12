import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const connectDB = () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  mongoose.connect(process.env.MONGODB_URI).catch((err) => {
    console.error(err);
  });
};
export default connectDB;