import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;

  const result = await cloudinary.uploader.upload_stream(
    { resource_type: "auto" },
    (error, result) => {
      if (error) return res.status(500).json({ error });

      res.json({ url: result.secure_url });
    }
  );

  result.end(file.buffer);
});

export default router;
