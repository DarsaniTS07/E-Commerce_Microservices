const { CognitoIdentityProviderClient, ListUsersCommand, AdminGetUserCommand, AdminDeleteUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { fromSSO } = require('@aws-sdk/credential-provider-sso');

class UserService {
  constructor() {
    const config = {
      region: process.env.AWS_REGION
    };
    
    if (process.env.AWS_PROFILE) {
      config.credentials = fromSSO({ profile: process.env.AWS_PROFILE });
    }

    this.cognito = new CognitoIdentityProviderClient(config);
    this.userPoolId = process.env.COGNITO_USER_POOL_ID;
  }

  async listUsers() {
    const command = new ListUsersCommand({
      UserPoolId: this.userPoolId,
      Limit: 50
    });
    const response = await this.cognito.send(command);
    return response.Users.map(user => this._formatUser(user));
  }

  async getUserDetails(userId) {
    const command = new AdminGetUserCommand({
      UserPoolId: this.userPoolId,
      Username: userId
    });
    const response = await this.cognito.send(command);
    return this._formatUser(response);
  }

  async deleteUser(userId) {
    const command = new AdminDeleteUserCommand({
      UserPoolId: this.userPoolId,
      Username: userId
    });
    await this.cognito.send(command);
    return { success: true };
  }

  _formatUser(cognitoUser) {
    const attributes = cognitoUser.Attributes || cognitoUser.UserAttributes || [];
    const getAttr = (name) => attributes.find(a => a.Name === name)?.Value || null;

    return {
      userId: cognitoUser.Username,
      email: getAttr('email'),
      name: getAttr('name'),
      status: cognitoUser.UserStatus,
      createdAt: cognitoUser.UserCreateDate,
      enabled: cognitoUser.Enabled
    };
  }
}

module.exports = { UserService };
