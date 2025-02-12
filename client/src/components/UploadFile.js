import { useState } from "react";
import axios from "axios";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file");

        // console.log(file);

        const formData = new FormData();
        formData.append("file", file);

        // for (let pair of formData.entries()) {
        //     console.log(pair[0], pair[1]);  // Logs key-value pairs of FormData
        // }

        try {
            setLoading(true);
            await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setLoading(false);

            alert("File uploaded successfully! Refresh to see changes.");
            window.location.reload();
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Please try again.");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid black', padding: '20px', borderRadius: '10px', alignItems: 'center' }}>
            <h2 style={{ textDecoration: 'underline' }}>Upload pdf file</h2>
            <input style={{ border: '1px solid black', padding: '10px', borderRadius: '5px' }} accept="application/pdf" type="file" onChange={handleFileChange} />
            <button disabled={loading} style={{ border: '1px solid black', padding: '5px 20px', borderRadius: '5px', cursor: 'pointer' }} onClick={handleUpload}>{loading ? "Uploading..." : "Upload"}</button>
        </div>
    );
};

export default UploadFile;
