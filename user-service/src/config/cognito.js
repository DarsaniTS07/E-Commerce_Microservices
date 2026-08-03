const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID,
});

module.exports = { verifier };