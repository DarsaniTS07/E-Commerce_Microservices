const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

class SnsClient {
    constructor() {
        this.client = new SNSClient({
            region: process.env.AWS_REGION,
        });

        this.topicArn = process.env.SNS_TOPIC_ARN;
    }

    async publish(event) {
        await this.client.send(
            new PublishCommand({
                TopicArn: this.topicArn,
                Message: JSON.stringify(event),
            })
        );
    }
}

module.exports = { SnsClient };