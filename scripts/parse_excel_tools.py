import zipfile
import xml.etree.ElementTree as ET
import json

xlsx_path = r"c:\Users\7yadi\Downloads\Software\Software_and_AI_Tools_List.xlsx"

with zipfile.ZipFile(xlsx_path, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        ss_xml = z.read('xl/sharedStrings.xml')
        ss_tree = ET.fromstring(ss_xml)
        for elem in ss_tree.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
            shared_strings.append(elem.text or '')
    
    sheet_xml = z.read('xl/worksheets/sheet1.xml')
    sheet_tree = ET.fromstring(sheet_xml)
    
    rows = []
    for row_elem in sheet_tree.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
        row_cells = []
        for cell_elem in row_elem.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
            val_elem = cell_elem.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
            cell_type = cell_elem.get('t')
            
            if val_elem is not None:
                val = val_elem.text
                if cell_type == 's' and val is not None:
                    idx = int(val)
                    val = shared_strings[idx] if idx < len(shared_strings) else val
                row_cells.append(val or '')
            else:
                is_elem = cell_elem.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}is')
                if is_elem is not None:
                    t_elem = is_elem.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
                    row_cells.append(t_elem.text if t_elem is not None else '')
                else:
                    row_cells.append('')
        if any(row_cells):
            rows.append(row_cells)

headers = rows[0]
data_rows = rows[1:]

print(f"Header columns: {headers}")
print(f"Total software & tool entries found: {len(data_rows)}")

# Save to public/data/excel_parsed.json
tools_list = []
for idx, r in enumerate(data_rows):
    if len(r) >= 2 and r[1].strip():
        s_no = r[0] if len(r) > 0 else str(idx+1)
        name = r[1].strip() if len(r) > 1 else ""
        plan = r[2].strip() if len(r) > 2 else "Standard"
        desc = r[3].strip() if len(r) > 3 else "Premium digital tool license."
        orig_price = r[4].strip() if len(r) > 4 else ""
        validity = r[5].strip() if len(r) > 5 else "1 Month"
        
        tools_list.append({
            "s_no": s_no,
            "name": name,
            "plan": plan,
            "description": desc,
            "original_price": orig_price,
            "validity": validity
        })

with open("public/data/excel_tools_list.json", "w", encoding="utf-8") as f:
    json.dump(tools_list, f, indent=2, ensure_ascii=False)

print(f"Saved {len(tools_list)} tools to public/data/excel_tools_list.json!")
