import os

with open("pages/invoices.js", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("Invoice", "Memo")
text = text.replace("invoice", "memo")
text = text.replace("INVOICE", "MEMO")
text = text.replace("Invoices", "Memos")
text = text.replace("invoices", "memos")

with open("pages/memos.js", "w", encoding="utf-8") as f:
    f.write(text)

print("SUCCESSFULLY MERGED")
