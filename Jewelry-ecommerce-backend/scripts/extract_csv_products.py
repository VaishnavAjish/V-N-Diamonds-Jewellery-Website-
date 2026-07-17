import sys
import os
import json
import csv

def normalize(header):
    return str(header).strip().lower() if header is not None else ""

def detect_format(headers):
    norm_headers = [normalize(h) for h in headers]
    if "stone country location" in norm_headers and "stone type" in norm_headers:
        return "gemstone"
    elif "rapnet lot #" in norm_headers and "item title" in norm_headers:
        return "jewellery"
    elif "rapaport trade lot #" in norm_headers and "fluorescence intensity" in norm_headers:
        return "loosediamond"
    return "unknown"

def parse_csv(csv_path):
    rows_data = []
    
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        try:
            headers = next(reader)
        except StopIteration:
            raise ValueError("CSV file is empty")
            
        fmt = detect_format(headers)
        if fmt == "unknown":
            raise ValueError("Could not detect CSV format. Ensure it's Gemstone, Jewellery, or Loose Diamond format.")
            
        # Create header index mapping
        idx = {normalize(h): i for i, h in enumerate(headers)}
        
        for row_num, row in enumerate(reader, start=2):
            if not row or not any(row):
                continue
                
            def get_val(key):
                norm_key = normalize(key)
                if norm_key in idx and idx[norm_key] < len(row):
                    return str(row[idx[norm_key]]).strip()
                return ""
            
            data = {
                "row": row_num,
                "sku": get_val("Stock #"),
                "imagePath": None # Images aren't embedded in CSV
            }
            
            if fmt == "jewellery":
                data["productType"] = "jewelry"
                data["categoryName"] = get_val("Category") or get_val("Type")
                data["subCategory"] = get_val("Type")
                data["settingType"] = get_val("Item Title")
                data["description"] = get_val("Description")
                data["metalId"] = get_val("Metal Type")
                if get_val("Metal Karat"):
                    data["metalId"] += f" {get_val('Metal Karat')}"
                data["metalGms"] = ""
                data["metalCombined"] = data["metalId"]
                data["grossGms"] = get_val("Jewelry Weight")
                data["saleTotal"] = get_val("Price")
                data["diamondPcs"] = get_val("Gemstone Quantity")
                data["shape"] = get_val("Gemstone Shape")
                data["certificate"] = get_val("Jewelry Lab Name") or get_val("Gemstone Lab")
                data["certNo"] = get_val("Jewelry Lab Report") or get_val("Gem Lab Report #")
                
            elif fmt == "gemstone":
                data["productType"] = "gemstone"
                data["categoryName"] = get_val("Stone Type")
                data["subCategory"] = ""
                data["settingType"] = ""
                desc_parts = [get_val("Primary Color"), get_val("Color Intensity"), get_val("Carat Weight") + " Cts"]
                data["description"] = " ".join([p for p in desc_parts if p])
                data["metalId"] = ""
                data["metalGms"] = ""
                data["metalCombined"] = ""
                data["grossGms"] = ""
                data["saleTotal"] = get_val("Price per Carat") # Can't calculate total price without logic, just pass it through
                data["diamondPcs"] = "1"
                data["shape"] = get_val("Shape")
                data["certificate"] = get_val("Lab 1")
                data["certNo"] = get_val("Report # 1")
                
            elif fmt == "loosediamond":
                data["productType"] = "diamond"
                data["categoryName"] = "Diamond"
                data["subCategory"] = ""
                data["settingType"] = ""
                desc_parts = [get_val("Weight") + " Cts", get_val("Color"), get_val("Clarity"), get_val("Cut Grade")]
                data["description"] = " ".join([p for p in desc_parts if p])
                data["metalId"] = ""
                data["metalGms"] = ""
                data["metalCombined"] = ""
                data["grossGms"] = ""
                data["saleTotal"] = get_val("Cash Price") or get_val("BuyNow $/ct")
                data["diamondPcs"] = "1"
                data["shape"] = get_val("Shape")
                data["certificate"] = get_val("Lab")
                data["certNo"] = get_val("Report #")

            rows_data.append(data)
            
    return rows_data

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing CSV path"}))
        sys.exit(1)
        
    csv_path = sys.argv[1]
    
    try:
        data = parse_csv(csv_path)
        print(json.dumps(data))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
