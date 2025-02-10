import { useEffect, useState } from "react";
import UploadFile from "./components/UploadFile";
import PdfViewer from "./components/PdfViewer";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/files");
        setFiles(res.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  return (
    <div style={{ margin: '20px' }}>
      <h1>PDF Upload & Viewer</h1>
      <UploadFile />

      <h2>Uploaded Files</h2>
      {files.length === 0 ? <p>No files uploaded yet.</p> :
        files.map((file) => (
          <div key={file.filename}>
            <img src="https://i.pinimg.com/736x/3a/0d/51/3a0d510e8aff0312920ce1bcb5b022ac.jpg" alt="pdf" width={200} />
            <button
              key={file.filename}
              onClick={() => setSelectedFile(file.filename)}
              style={{ display: "block", marginBottom: "10px", cursor: "pointer" }}>
              {file.filename}
            </button>
          </div>
        ))
      }

      {selectedFile && <PdfViewer filename={selectedFile} />}
    </div>
  );
}

export default App;
