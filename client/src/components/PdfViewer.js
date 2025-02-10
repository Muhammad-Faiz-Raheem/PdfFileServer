const PdfViewer = ({ filename }) => {
    return (
        <div>
            <h3>Viewing: {filename}</h3>
            <iframe
                title="PDF Viewer"
                src={`http://localhost:5000/file/${filename}`}
                width="100%"
                height="500px"
            ></iframe>
        </div>
    );
};

export default PdfViewer;
