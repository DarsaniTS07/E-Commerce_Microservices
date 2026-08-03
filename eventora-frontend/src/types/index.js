/**
 * @typedef {Object} User
 * @property {string} id - Cognito user UUID
 * @property {string} email - Registered email
 * @property {string} name - User's display name
 * @property {("User"|"Admin")} role - Assigned access controls
 */

/**
 * @typedef {Object} DecodedToken
 * @property {string} sub - Cognito sub UUID
 * @property {string} email - Cognito email claim
 * @property {string} name - Cognito name claim
 * @property {string} [custom:role] - Custom claims override for role mapping
 * @property {string[]} [cognito:groups] - Cognito group memberships
 * @property {number} exp - Token expiration timestamp
 */

export {};
