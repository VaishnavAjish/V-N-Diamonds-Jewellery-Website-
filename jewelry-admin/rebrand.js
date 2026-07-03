const fs = require('fs');
const path = require('path');

const replaceInDir = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.match(/V N Diamonds/i)) {
        content = content.replace(/V N Diamonds/ig, 'Harene Diamonds');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  });
};

replaceInDir('pages');
replaceInDir('components');
