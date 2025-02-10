const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true, unique: true },
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    contentType: { type: String, required: true },
});

module.exports = mongoose.model("File", fileSchema);
