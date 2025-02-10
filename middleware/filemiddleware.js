function fileMiddleware(req, res, next) {
    try {
        console.log("middleware");
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = fileMiddleware;
