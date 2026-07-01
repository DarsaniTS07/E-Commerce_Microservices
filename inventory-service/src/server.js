require("dotenv").config();

const { createApp } = require("./app");

async function bootstrap() {
    const app = createApp();

    const port = Number(process.env.PORT || 3002);

    app.listen(port, () => {
        console.log(`Inventory Service listening on port ${port}`);
    });
}

bootstrap().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
});