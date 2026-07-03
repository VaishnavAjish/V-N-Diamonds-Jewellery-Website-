const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else { 
            /* Is a file */
            if (file.endsWith('.jsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace "Shofy" with "V N Diamonds"
    content = content.replace(/Shofy/g, "V N Diamonds");
    
    // Replace emails
    content = content.replace(/shofy@mail\.com/g, "info@vndiamonds.com");
    content = content.replace(/contact@shofy\.com/g, "info@vndiamonds.com");
    content = content.replace(/swe\.hamedhasan@gmail\.com/g, "info@vndiamonds.com");

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated:', file);
    }
});
