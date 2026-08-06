const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('build') && !file.includes('dist')) {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
            }
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });
    return arrayOfFiles;
}

const allFiles = getAllFiles(baseDir);

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Unused imports (we can blindly remove specific ones if they match exact patterns)
    const unusedImports = [
        'Search', 'CheckCheck', 'CreditCard', 'ShieldCheck', 'Link', 
        'useEffect', 'useState', 'ShoppingCart', 'CheckCircle', 'Check', 
        'cn', 'MoreVertical', 'Input', 'Activity', 'X', 'ChangePassword'
    ];
    
    // Very simple cleanup: if it's the only import from a package
    for (const imp of unusedImports) {
        const regex1 = new RegExp(`import\\s+\\{\\s*${imp}\\s*\\}\\s+from\\s+['"][^'"]+['"];?\\n`, 'g');
        content = content.replace(regex1, '');
        const regex2 = new RegExp(`import\\s+${imp}\\s+from\\s+['"][^'"]+['"];?\\n`, 'g');
        content = content.replace(regex2, '');
    }

    // Optional chaining
    // payload?.length > 0 -> payload?.length > 0
    content = content.replace(/(\w+)\s*&&\s*\1\.([a-zA-Z0-9_]+)/g, '$1?.$2');
    // x?.y && x.y.z -> x?.y?.z (basic approximation)
    content = content.replace(/!(\w+)\s*\|\|\s*!\1\.([a-zA-Z0-9_]+)/g, '!$1?.$2');

    // parseInt -> Number.parseInt
    content = content.replace(/\bparseInt\(/g, 'Number.Number.parseInt(');

    // Empty catch blocks (Handle exception or don't catch it at all)
    // catch (error) { console.error(error); } -> catch (error) { console.error(error); }
    content = content.replace(/catch\s*\(([^)]+)\)\s*\{\s*\}/g, 'catch ($1) { console.error($1); }');
    content = content.replace(/catch\s*\{\s*\}/g, 'catch (err) { console.error(err); }');

    // Remove unused location
    content = content.replace(/const\s+location\s*=\s*[^;]+;?\\n/g, '');
    
    // Breadcrumb Boolean equivalent
    content = content.replace(/=>\s*Boolean\([^)]+\)/g, '=> Boolean');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

for (const file of allFiles) {
    processFile(file);
}

console.log("Global fixes applied.");
