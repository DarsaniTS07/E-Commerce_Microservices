require("dotenv").config();

const { connectDatabase } = require("./config/db");
const { createApp } = require("./app");

async function bootstrap() {
    await connectDatabase();

    const app = createApp();

    const port = Number(process.env.PORT || 3002);

    app.listen(port, () => {
        console.log(`Inventory Service listening on port ${port}`);
    });
}

bootstrap().catch((error) => {
    console.error(error);
    process.exit(1);
});