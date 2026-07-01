const express = require("express");

const { requestLogger } = require("./middlewares/requestLogger");
const { attachAuthContext } = require("./middlewares/auth");
const {
    notFoundHandler,
    errorHandler,
} = require("./middlewares/errorHandler");

const createInventoryRoutes = require("./routes/inventory.routes");
const { InventoryService } = require("./services/inventory.service");
const { InventoryRepository } = require("./repositories/inventory.repository");

function createApp() {
    const app = express();

    const inventoryRepository = new InventoryRepository();
    const inventoryService = new InventoryService(inventoryRepository);

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

    app.use("/inventory", createInventoryRoutes(inventoryService));

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}

module.exports = { createApp };