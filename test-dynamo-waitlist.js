const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "ap-southeast-1" });
const docClient = DynamoDBDocumentClient.from(client);

async function check() {
  const result = await docClient.send(
    new ScanCommand({
      TableName: "darsani_waitlist"
    })
  );
  console.log(result.Items);
}
check();
