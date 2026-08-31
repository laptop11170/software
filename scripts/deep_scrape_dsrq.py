import urllib.request
import re
import json

base_url = "https://dsrqdigitals.com"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

def fetch(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

print("1. Fetching homepage...")
homepage_html = fetch(base_url)

# Extract sitemap or index js
index_js_match = re.search(r'src="(/assets/index-[^"]+\.js)"', homepage_html)
if not index_js_match:
    print("Could not find index.js")
    exit(1)

index_js_url = base_url + index_js_match.group(1)
print("2. Fetching index bundle:", index_js_url)
index_js = fetch(index_js_url)

# Find all chunk files mentioned in index.js
chunks = re.findall(r'assets/[A-Za-z0-9_\-]+\.js', index_js)
chunks = list(set(chunks))
print(f"Found {len(chunks)} JS chunk files.")

# Scan all chunk files for static data arrays or product definitions
products = []
products_by_slug = {}

for chunk in chunks:
    chunk_url = f"{base_url}/{chunk}"
    content = fetch(chunk_url)
    if not content:
        continue
        
    # Search for product objects with slug, name, description, category, price
    # e.g., name:"...", slug:"..."
    # Match patterns like {id:"...",name:"...",slug:"..."}
    raw_objs = re.findall(r'\{[^{}]*slug:"([a-z0-9\-]+)"[^{}]*name:"([^"]+)"[^{}]*\}', content)
    for slug, name in raw_objs:
        if slug not in products_by_slug:
            # Extract category & description around this snippet if available
            products_by_slug[slug] = {
                "slug": slug,
                "name": name,
                "chunk": chunk
            }

print(f"Discovered {len(products_by_slug)} products from JS bundles!")
for slug, p in products_by_slug.items():
    print(f" - {p['name']} ({slug})")

with open("public/data/discovered_products.json", "w") as f:
    json.dump(list(products_by_slug.values()), f, indent=2)
