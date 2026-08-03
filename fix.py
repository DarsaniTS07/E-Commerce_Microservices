import os

services = ['cart-service', 'event-service', 'inventory-service', 'notification-service', 'order-service', 'payment-service', 'user-service', 'waitlist-service']

for s in services:
    mz = os.path.join(s, 'makezip.py')
    if os.path.exists(mz):
        with open(mz, 'r') as f:
            content = f.read()
        
        # Replace the conditional .env inclusion
        content = content.replace("is_user_svc = service == 'user-service'", "")
        content = content.replace("if is_user_svc:\n    include_files.append('.env')", "")
        content = content.replace("include_files = ['handler.js', 'package.json', 'package-lock.json']", "include_files = ['handler.js', 'package.json', 'package-lock.json', '.env']")
        
        with open(mz, 'w') as f:
            f.write(content)
        print('Updated ' + mz)

    hj = os.path.join(s, 'handler.js')
    if os.path.exists(hj):
        with open(hj, 'r') as f:
            content = f.read()
        
        if 'dotenv' not in content:
            content = "require('dotenv').config();\n" + content
            with open(hj, 'w') as f:
                f.write(content)
            print('Updated ' + hj)
