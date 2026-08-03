const { asyncHandler } = require('../utils/asyncHandler');

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  listUsers = asyncHandler(async (req, res) => {
    const data = await this.userService.listUsers();
    res.json({ success: true, message: 'Users retrieved', data });
  });

  getUserDetails = asyncHandler(async (req, res) => {
    const data = await this.userService.getUserDetails(req.params.userId);
    res.json({ success: true, message: 'User details retrieved', data });
  });

  deleteUser = asyncHandler(async (req, res) => {
    await this.userService.deleteUser(req.params.userId);
    res.json({ success: true, message: 'User deleted successfully' });
  });
}

module.exports = { UserController };
