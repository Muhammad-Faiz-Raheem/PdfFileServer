import { useState } from "react";
import axios from "axios";

const UploadFile = ({ setFilename }) => {
    const [file, setFile] = useState(null);
    const [uploadedFilename, setUploadedFilename] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(res.data);

            // Store the filename, not the file ID
            setUploadedFilename(file.name);
            setFilename(file.name);
            // setFilename((filename) => [...filename, file.name]);

            alert("File uploaded successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Please try again.");
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {uploadedFilename && <p>Uploaded File: {uploadedFilename}</p>}
        </div>
    );
};

export default UploadFile;
