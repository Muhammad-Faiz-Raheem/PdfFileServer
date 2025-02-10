import { useEffect, useState } from "react";
import UploadFile from "./components/UploadFile";
import PdfViewer from "./components/PdfViewer";
import axios from "axios";

function App() {
  const [filename, setFilename] = useState("");
  // const [show, setShow] = useState(false);
  // const [pdf, setPdf] = useState("");

  // const [files, setFiles] = useState([]);

  // useEffect(() => {
  //   const fetchFiles = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:5000/files");
  //       setFiles(res.data);
  //     } catch (error) {
  //       console.error("Error fetching files:", error);
  //     }
  //   };
  //   fetchFiles();
  // }, []);

  // function handleClick(e) {
  //   setShow(true);
  //   setPdf(e.target.value);
  // }


  return (
    <div style={{ margin: '20px' }}>
      <h1>PDF Upload & Viewer</h1>
      <UploadFile setFilename={setFilename} />
      {filename && <PdfViewer filename={filename} />}

      {/* {files &&
        files.map((file) => (
          <div key={file._id}>
            <img src="https://i.pinimg.com/736x/3a/0d/51/3a0d510e8aff0312920ce1bcb5b022ac.jpg" alt="pdf" width={200} />
            <button style={{ display: 'block', width: '200px' }} value={file.name} onClick={handleClick}>{file.filename}</button>
          </div>
        ))
      }

      {(show && pdf) && <PdfViewer filename={filename} />} */}
    </div>
  );
}

export default App;
