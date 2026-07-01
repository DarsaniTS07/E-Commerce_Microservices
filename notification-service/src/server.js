require("dotenv").config();

const { createApp } = require("./app");
const { connectDatabase } = require("./config/db");

async function bootstrap() {
    await connectDatabase();

    const app = createApp();

    const port = Number(process.env.PORT || 3007);

    app.listen(port, () => {
        console.log(`Notification Service listening on port ${port}`);
    });
}

bootstrap().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
});