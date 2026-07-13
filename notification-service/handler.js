const serverless = require("serverless-http");
const { createApp } = require("./src/app");

const { NotificationRepository } = require("./src/repositories/notification.repository");
const { NotificationService } = require("./src/services/notification.service");

const app = createApp();
const expressHandler = serverless(app);

exports.handler = async (event, context) => {

    // SQS Event
    if (event.Records && event.Records.length > 0) {

        console.log("SQS Event Received");

        const notificationRepository = new NotificationRepository();
        const notificationService = new NotificationService(
            notificationRepository
        );

        for (const record of event.Records) {

            try {

                // SNS → SQS envelope
                const sqsBody = JSON.parse(record.body);

                // Actual published message
                const message = JSON.parse(sqsBody.Message);

                console.log("Processing message:", message);

                await notificationService.createNotification({
                    userId: message.userId,
                    message: message.message
                });

            } catch (err) {

                console.error("Error processing record:", err);

                throw err;
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true
            })
        };
    }

    // API Gateway Request
    return expressHandler(event, context);
};