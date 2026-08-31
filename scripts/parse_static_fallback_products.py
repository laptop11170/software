import urllib.request
import re
import json

url = "https://dsrqdigitals.com/assets/index-Me1_fSRA.js"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

match = re.search(r'products:(\[\{.*?\}\]),', content, re.DOTALL)
if match:
    raw = match.group(1)
    with open("public/data/raw_products_snippet.js", "w", encoding="utf-8") as f:
        f.write(raw)
    print("Saved raw products snippet!")
    
    # Extract keys using regex: name:..., slug:..., category:..., price:...
    # Matches: {name:"...",slug:"...",...}
    objects = re.findall(r'\{[^\}]+\}', raw)
    print(f"Parsed {len(objects)} raw objects!")
    
    # Let's extract all name & slug & category & image & price occurrences
    slugs = re.findall(r'slug:"([^"]+)"', raw)
    names = re.findall(r'name:"([^"]+)"', raw)
    categories = re.findall(r'category:"([^"]+)"', raw)
    images = re.findall(r'(?:image_url|logo):"([^"]+)"', raw)
    prices = re.findall(r'price:([0-9\.]+)', raw)
    
    print(f"Discovered {len(slugs)} unique tool slugs in embedded products bundle!")
    for idx, s in enumerate(slugs):
        n = names[idx] if idx < len(names) else s
        c = categories[idx] if idx < len(categories) else "Digital Tools"
        print(f"{idx+1}. [{c}] {n} (slug: {s})")
