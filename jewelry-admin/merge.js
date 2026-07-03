const fs = require('fs');
try {
  let inv = fs.readFileSync('pages/invoices.js', 'utf8');
  let memo = inv.replace(/Invoice/g, 'Memo').replace(/invoice/g, 'memo');
  memo = memo.replace(/Invoices/g, 'Memos');
  memo = memo.replace(/invoices/g, 'memos');
  fs.writeFileSync('pages/memos.js', memo, 'utf8');
  console.log('Successfully wrote memos.js');
} catch(e) {
  console.error(e);
}
