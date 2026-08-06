const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const services = ['cart-service', 'event-service', 'inventory-service', 'notification-service', 'order-service', 'payment-service', 'user-service', 'waitlist-service'];

function processFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const { search, replace } of replacements) {
        content = content.replace(search, replace);
    }
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

for (const service of services) {
    // 1. Fix auth.js
    const authPath = path.join(baseDir, service, 'src', 'middlewares', 'auth.js');
    processFile(authPath, [
        { search: /catch \(err\) \{\n\s*return next/g, replace: 'catch (err) {\n    console.warn("Auth context error:", err.message);\n    return next' },
        { search: /!req\.user \|\| !req\.user\.id/g, replace: '!req.user?.id' },
        { search: /!req\.user \|\| !req\.user\.role/g, replace: '!req.user?.role' },
        { search: /payload\["cognito:groups"\] &&\n\s*payload\["cognito:groups"\].length > 0/g, replace: 'payload["cognito:groups"]?.length > 0' }
    ]);

    // 2. Fix pagination.js
    const pagPath = path.join(baseDir, service, 'src', 'utils', 'pagination.js');
    processFile(pagPath, [
        { search: /parseInt\(/g, replace: 'Number.Number.parseInt(' }
    ]);
}

console.log("Done");
