
import connectDB from "../../lib/connectDB";
import Paper from "../../models/paper";
import Classifications from "../../models/classifications";

export default async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
      try {
          const classifications = await Classifications.findOne();
          res.status(200).json(classifications.classifications || []);
      } catch (error) {
          res.status(400).json({ message: "Error getting classifications" });
      }
  } else if (req.method === "PUT") {
    const {
        title,
        classifications,
    } = req.body;

    try {
      const existingPaper = await Paper.findOne({ title });
      if (existingPaper) {
        await Paper.findOneAndUpdate({ title }, {
            title,
            classifications,
        });
      } else {
        // throw an error
        res.status(404).json({ message: "Paper not found" });
      }
      res.status(200).json({ message: "Paper classifications updated" });
    } catch (error) {
      res.status(400).json({ message: "Error updating paper classifications" });
    }
  }
};