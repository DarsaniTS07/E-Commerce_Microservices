const https = require('https');

const req = https.request({
  hostname: '4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com',
  path: '/waitlist/users/e96ab5ec-00c1-70e4-08a9-e9b12517077e/waitlists',
  method: 'GET',
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
});
req.on('error', console.error);
req.end();
