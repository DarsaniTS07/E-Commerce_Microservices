const express = require("express");

const { requestLogger } = require("./middlewares/requestLogger");
const { attachAuthContext } = require("./middlewares/auth");
const {
    notFoundHandler,
    errorHandler,
} = require("./middlewares/errorHandler");

const createNotificationRoutes = require("./routes/notification.routes");
const { NotificationRepository } = require("./repositories/notification.repository");
const { NotificationService } = require("./services/notification.service");

function createApp() {
    const app = express();

    const notificationRepository = new NotificationRepository();

    const notificationService = new NotificationService(
        notificationRepository
    );

    app.use(express.json());

    app.use(attachAuthContext);

    app.use(requestLogger);

    app.get("/health", (req, res) => {
        res.json({
            success: true,
            message: "Operation successful",
            data: {
                status: "ok",
            },
        });
    });

    app.use(
        "/notifications",
        createNotificationRoutes(notificationService)
    );

    app.use(notFoundHandler);

    app.use(errorHandler);

    return app;
}

module.exports = { createApp };