const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");
const File = require("./models/FileModel")

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
    gfs = new GridFSBucket(conn.db, { bucketName: "uploads" });
    console.log("Connected to MongoDB Atlas GridFS");
});

// Configure Multer (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// **Upload File (Without multer-gridfs-storage)**
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Convert buffer to Readable Stream
        const readableStream = new Readable();
        readableStream.push(req.file.buffer);
        readableStream.push(null);

        // Store in GridFS
        const uploadStream = gfs.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
        });

        readableStream.pipe(uploadStream);

        uploadStream.on("finish", () => {
            res.json({ message: "File uploaded successfully", fileId: uploadStream.id });
        });

        // uploadStream.on("finish", async () => {
        //     try {
        //         // Save file metadata in MongoDB
        //         const newFile = new File({
        //             filename: req.file.originalname,
        //             fileId: uploadStream.id,
        //             contentType: req.file.mimetype
        //         });

        //         await newFile.save();

        //         res.json({
        //             message: "File uploaded successfully",
        //             fileId: uploadStream.id,
        //             filename: req.file.originalname
        //         });

        //     } catch (dbError) {
        //         res.status(500).json({ error: "Database error", details: dbError });
        //     }
        // });

        uploadStream.on("error", (err) => {
            res.status(500).json({ error: "Upload failed", details: err });
        });

    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// **Retrieve File**
app.get("/file/:filename", async (req, res) => {
    try {
        const file = await conn.db.collection("uploads.files").findOne({ filename: req.params.filename });

        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        res.set("Content-Type", file.contentType);

        // Create read stream from GridFSBucket
        const readstream = gfs.openDownloadStreamByName(req.params.filename);
        readstream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving file" });
    }
});

app.get("/files", async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving files" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
