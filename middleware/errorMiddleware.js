const errorMiddleware = (err, req, res, next) => {

      const statusCode = err.statusCode || 500;

    res.status(statusCode);

    res.json({
        message: err.message
    });
};

module.exports = errorMiddleware;