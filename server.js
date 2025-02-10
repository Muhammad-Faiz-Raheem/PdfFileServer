const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");
const File = require("./models/FileModel");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
    gfs = new GridFSBucket(conn.db, { bucketName: "uploads" });
    console.log("Connected to GridFS");
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// **Upload File & Store Metadata**
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const readableStream = new Readable();
        readableStream.push(req.file.buffer);
        readableStream.push(null);

        const uploadStream = gfs.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
        });

        readableStream.pipe(uploadStream);

        uploadStream.on("finish", async () => {
            try {
                const newFile = new File({
                    filename: req.file.originalname,
                    fileId: uploadStream.id,
                    contentType: req.file.mimetype
                });

                await newFile.save();
                res.json({ message: "File uploaded", filename: req.file.originalname });
            } catch (dbError) {
                res.status(500).json({ error: "Database error", details: dbError });
            }
        });

        uploadStream.on("error", (err) => res.status(500).json({ error: "Upload failed", details: err }));

    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// **Retrieve All File Names**
app.get("/files", async (req, res) => {
    try {
        const files = await File.find().select("filename");
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving files" });
    }
});

// **Retrieve and Stream a File**
app.get("/file/:filename", async (req, res) => {
    try {
        const file = await File.findOne({ filename: req.params.filename });
        if (!file) return res.status(404).json({ error: "File not found" });

        res.set("Content-Type", file.contentType);
        gfs.openDownloadStream(file.fileId).pipe(res);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving file" });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
