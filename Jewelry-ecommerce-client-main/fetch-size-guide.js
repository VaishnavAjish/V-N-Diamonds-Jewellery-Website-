const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'vipulmaheshwari.sites2.digju.in',
  port: 443,
  path: '/size-guide/',
  method: 'GET',
  rejectUnauthorized: false
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (d) => {
    data += d;
  });
  res.on('end', () => {
    // save raw
    fs.writeFileSync('size_guide_raw.html', data);
    
    // try to get text
    let text = data.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                   .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                   .replace(/<[^>]+>/g, '\n')
                   .replace(/^\s*[\r\n]/gm, '\n');
                   
    fs.writeFileSync('size_guide_text.txt', text);
    console.log('Saved size guide content to size_guide_text.txt');
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();
