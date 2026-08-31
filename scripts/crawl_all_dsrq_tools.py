import urllib.request
import re
import json

base_url = "https://dsrqdigitals.com"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

target_chunks = [
    "assets/Tools-hEsh5S0h.js",
    "assets/AllProducts-C5W7TVog.js",
    "assets/publicCatalog-Bl8Gkv4v.js",
    "assets/ToolDetail-BfbWoski.js",
    "assets/Bundles-DcWmBQZh.js",
    "assets/DesignerPlanShowcase-7pjJkdfz.js",
    "assets/YoutuberPlanShowcase-CxQs9wfD.js",
    "assets/DeveloperPlanShowcase-DXBnI2BK.js",
    "assets/StudentPlanShowcase-wXwT5xnJ.js",
    "assets/CreatorPlanShowcase-C5DR4enz.js",
    "assets/AgencyPlanShowcase-BcZMATfV.js",
    "assets/SaleOffers-gFN5Y-zE.js",
    "assets/WebsiteManagementSystem-B3xWunO9.js",
    "assets/ProductsManagement-Dlezd7vM.js"
]

all_found = []

for chunk in target_chunks:
    url = f"{base_url}/{chunk}"
    try:
        req = urllib.request.Request(url, headers=headers)
        code = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        
        # Regex for tool names / titles / slugs
        # e.g. name:"...", slug:"..." or "title":"..."
        titles = re.findall(r'(?:name|title):"([^"]+)"', code)
        slugs = re.findall(r'slug:"([^"]+)"', code)
        categories = re.findall(r'category:"([^"]+)"', code)
        
        print(f"[{chunk}] Found {len(titles)} titles, {len(slugs)} slugs")
        for t in titles:
            if len(t) > 3 and t not in ["Title", "Status", "Actions", "Name", "Category", "Description", "Price"]:
                all_found.append(t)
    except Exception as e:
        print(f"Error fetching {chunk}: {e}")

all_found = list(set(all_found))
print(f"\n==========================================")
print(f"TOTAL UNIQUE TOOL NAMES DISCOVERED: {len(all_found)}")
print(f"==========================================")
for item in sorted(all_found):
    print(f" - {item}")

with open("public/data/scraped_tool_names.json", "w") as f:
    json.dump(sorted(all_found), f, indent=2)
