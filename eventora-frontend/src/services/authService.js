import axios from "axios";
import { COGNITO_ENDPOINT, COGNITO_CLIENT_ID } from "../constants";

// Standalone Axios client configuration
const cognitoClient = axios.create({
  baseURL: COGNITO_ENDPOINT,
});

const defaultHeaders = {
  "Content-Type": "application/x-amz-json-1.1",
};

export const authService = {
  login: async (email, password) => {
    const payload = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    const response = await cognitoClient.post("", JSON.stringify(payload), {
      headers: {
        ...defaultHeaders,
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      }
    });

    const authResult = response.data?.AuthenticationResult;
    if (authResult) {
      if (authResult.AccessToken) {
        localStorage.setItem("eventora_access_token", authResult.AccessToken);
      }
      return {
        token: authResult.IdToken,
        accessToken: authResult.AccessToken,
        refreshToken: authResult.RefreshToken,
      };
    }
    throw new Error("Authentication failed. No tokens returned.");
  },

  signup: async (email, password, name, role = "User") => {
    const payload = {
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "name", Value: name },
        { Name: "email", Value: email },
        { Name: "custom:role", Value: role },
      ],
    };

    const response = await cognitoClient.post("", JSON.stringify(payload), {
      headers: {
        ...defaultHeaders,
        "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp",
      }
    });
    return response.data;
  },

  confirmSignup: async (email, code) => {
    const payload = {
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    };

    const response = await cognitoClient.post("", JSON.stringify(payload), {
      headers: {
        ...defaultHeaders,
        "X-Amz-Target": "AWSCognitoIdentityProviderService.ConfirmSignUp",
      }
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const payload = {
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
    };

    const response = await cognitoClient.post("", JSON.stringify(payload), {
      headers: {
        ...defaultHeaders,
        "X-Amz-Target": "AWSCognitoIdentityProviderService.ForgotPassword",
      }
    });
    return response.data;
  },

  resetPassword: async (email, code, newPassword) => {
    const payload = {
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    };

    const response = await cognitoClient.post("", JSON.stringify(payload), {
      headers: {
        ...defaultHeaders,
        "X-Amz-Target": "AWSCognitoIdentityProviderService.ConfirmForgotPassword",
      }
    });
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const accessToken = localStorage.getItem("eventora_access_token");
    if (!accessToken) {
      throw new Error("User session access token is missing.");
    }

    const payload = {
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
      AccessToken: accessToken,
    };

    const response = await cognitoClient.post("", JSON.stringify(payload), {
      headers: {
        ...defaultHeaders,
        "X-Amz-Target": "AWSCognitoIdentityProviderService.ChangePassword",
      }
    });
    return response.data;
  }
};

export default authService;
