const PdfViewer = ({ filename }) => {
    return (
        <div style={{ width: '95vw', height: '120vh' }}>
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
