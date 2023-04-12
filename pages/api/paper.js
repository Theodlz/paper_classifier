
import connectDB from "../../lib/connectDB";
import Paper from "../../models/paper";

export default async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
      const { page, nbPerPage } = req.query;
      // query the database for papers using the page and nbPerPage
      const paper = await Paper.find()
        .skip((page - 1) * nbPerPage)
        .limit(nbPerPage);
        
      if (!paper) {
        res.status(404).json({ success: false });
        return;
      }
      res.status(200).json(paper);
      return;
  } else if (req.method === "PUT") {
    const {
        title,
        abstract,
        url,
        classifications,
    } = req.body;

    try {
      const existingPaper = await Paper.findOne({ title });
      if (existingPaper) {
        await Paper.findOneAndUpdate({ title }, {
            title,
            abstract,
            url,
            classifications,
        });
      } else {
        const newPaper = new Paper(content);
        await newPaper.save();
      }
      res.status(200).json({ message: "Paper page updated" });
    } catch (error) {
      res.status(400).json({ message: "Error updating paper page" });
    }
  }
};