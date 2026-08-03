import zipfile, os

base        = os.path.dirname(os.path.abspath(__file__))
service     = os.path.basename(base)
out         = os.path.join(base, service + '.zip')


if os.path.exists(out):
    os.remove(out)

include_files = ['handler.js', 'package.json', 'package-lock.json']


include_dirs = ['src', 'node_modules']

with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, allowZip64=True) as zf:
    for f in include_files:
        fp = os.path.join(base, f)
        if os.path.exists(fp):
            zf.write(fp, f)
    # Bundle .env.lambda as .env for Lambda deployments
    env_lambda = os.path.join(base, '.env.lambda')
    if os.path.exists(env_lambda):
        zf.write(env_lambda, '.env')
    for d in include_dirs:
        dp = os.path.join(base, d)
        if not os.path.isdir(dp):
            continue
        for root, dirs, files in os.walk(dp):
            for file in files:
                full = os.path.join(root, file)
                rel  = os.path.relpath(full, base).replace('\\', '/')
                zf.write(full, rel)

print('OK: ' + out)
