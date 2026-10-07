const errorHandler = (error, req, res, next) => {
    console.error(error);

    if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(
            (validationError) => validationError.message
        );

        return res.status(400).json({
            message: "Validation failed",
            errors: messages
        });
    }

    if (error.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID"
        });
    }
    if (error.code === 11000) {
        return res.status(409).json({
            message: "Duplicate value"
        });
    }

    res.status(500).json({
        message: "Internal server error"
    });
};

export default errorHandler;