require('dotenv').config();
const { UserService } = require('./src/services/user.service');

async function test() {
  try {
    const service = new UserService();
    const users = await service.listUsers();
    console.log("Success! Found users:", users.length);
    if (users.length > 0) {
      const details = await service.getUserDetails(users[0].userId);
      console.log("Details for first user:", details);
    }
  } catch (err) {
    console.error("Failed:", err);
  }
}

test();
