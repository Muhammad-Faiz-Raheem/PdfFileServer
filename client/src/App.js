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
        setFiles([...res.data]);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  const handleDelete = async (filename) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/file/${filename}`);
      setFiles(files.filter((file) => file.filename !== filename));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', gap: '50px', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <h1>PDF Upload & Viewer</h1>
        <UploadFile />
      </div>

      <div>
        <h2 style={{ textAlign: 'center' }}>Uploaded Files</h2>
        <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
          {files.length <= 0 ? <p>No files uploaded yet.</p> :
            files?.map((file) => (
              <div key={file.filename} style={{ display: 'flex', flexDirection: 'column', width: '200px', gap: '2px' }}>
                <img src="https://i.pinimg.com/736x/3a/0d/51/3a0d510e8aff0312920ce1bcb5b022ac.jpg" alt="pdf" width={200} style={{ borderRadius: '10px' }} />
                <button
                  key={file.filename}
                  onClick={() => setSelectedFile(file.filename)}
                  style={{ display: "block", borderRadius: '20px', border: '0.5px solid', cursor: "pointer", minHeight: '40px' }}>
                  {file.filename}
                </button>
                <button
                  onClick={() => handleDelete(file.filename)}
                  style={{ display: "block", marginBottom: "10px", borderRadius: '20px', border: '0.5px solid', cursor: "pointer", minHeight: '40px' }}>
                  Delete
                </button>
              </div>
            ))
          }
        </div>
      </div>

      <div>
        {selectedFile && <PdfViewer filename={selectedFile} />}
      </div>
    </div>
  );
}

export default App;
