const axios = require('axios');
const COGNITO_ENDPOINT = "https://cognito-idp.ap-southeast-1.amazonaws.com/";
const COGNITO_CLIENT_ID = "1mguaa0i4kroahbop469djdddm";

async function run() {
  const payload = {
    ClientId: COGNITO_CLIENT_ID,
    Username: 'testuser2@example.com',
    Password: 'Password123!',
    UserAttributes: [
      { Name: "name", Value: "Test User 2" },
      { Name: "email", Value: 'testuser2@example.com' },
      { Name: "custom:role", Value: "User" },
    ],
  };

  try {
    const response = await axios.post(COGNITO_ENDPOINT, payload, {
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp",
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}
run();
