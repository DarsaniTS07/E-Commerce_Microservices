const { UserService } = require('../../src/services/user.service');

// Mock the AWS SDK Cognito client
jest.mock('@aws-sdk/client-cognito-identity-provider', () => ({
  CognitoIdentityProviderClient: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  ListUsersCommand: jest.fn(),
  AdminGetUserCommand: jest.fn(),
  AdminDeleteUserCommand: jest.fn(),
}));

const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');

describe('UserService', () => {
  let userService;
  let mockSend;

  beforeEach(() => {
    mockSend = jest.fn();
    CognitoIdentityProviderClient.mockImplementation(() => ({ send: mockSend }));
    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listUsers', () => {
    it('should return a list of formatted users', async () => {
      mockSend.mockResolvedValue({
        Users: [
          {
            Username: 'user-123',
            UserStatus: 'CONFIRMED',
            Enabled: true,
            UserCreateDate: new Date(),
            Attributes: [{ Name: 'email', Value: 'test@example.com' }],
          },
        ],
      });

      const result = await userService.listUsers();

      expect(mockSend).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('test@example.com');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return success', async () => {
      mockSend.mockResolvedValue({});

      const result = await userService.deleteUser('user-123');

      expect(mockSend).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });
});
