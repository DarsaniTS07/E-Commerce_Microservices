const express = require("express");

const { requestLogger } = require("./middlewares/requestLogger");
const { attachAuthContext } = require("./middlewares/auth");
const {
    notFoundHandler,
    errorHandler,
} = require("./middlewares/errorHandler");

const createWaitlistRoutes = require("./routes/waitlist.routes");
const { WaitlistRepository } = require("./repositories/waitlist.repository");
const { WaitlistService } = require("./services/waitlist.service");

const { InventoryClient } = require("./clients/inventory.client");
const { NotificationClient } = require("./clients/notification.client");
const { EventClient } = require("./clients/event.client");

function createApp() {
    const app = express();

    const waitlistRepository = new WaitlistRepository();

    const inventoryClient = new InventoryClient(
        process.env.INVENTORY_SERVICE_BASE_URL
    );

    const notificationClient = new NotificationClient(
        process.env.NOTIFICATION_SERVICE_BASE_URL
    );

    const eventClient = new EventClient(
        process.env.EVENT_SERVICE_BASE_URL
    );

    const waitlistService = new WaitlistService(
        waitlistRepository,
        inventoryClient,
        notificationClient,
        eventClient
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

    app.use("/waitlist", createWaitlistRoutes(waitlistService));

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}

module.exports = { createApp };