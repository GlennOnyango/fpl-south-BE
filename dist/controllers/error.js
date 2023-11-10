"use strict";
exports.get404 = (req, res, next) => {
    res.status(404).json({
        status: "error",
        message: "Page not found",
    });
};
