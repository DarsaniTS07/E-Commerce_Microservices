const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "ap-southeast-1" });
const docClient = DynamoDBDocumentClient.from(client);

async function test() {
  try {
    const result = await docClient.send(
      new UpdateCommand({
        TableName: "darsani_inventory",
        Key: { eventId: "test-nonexistent-event" },
        UpdateExpression:
          "SET availableTickets = availableTickets - :qty, reservedTickets = reservedTickets + :qty",
        ExpressionAttributeValues: {
          ":qty": 1,
        },
        ConditionExpression: "availableTickets >= :qty",
        ReturnValues: "ALL_NEW",
      })
    );
    console.log("Success:", result);
  } catch (err) {
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
  }
}

test();
