import json
import re
import os

with open("public/data/raw_products_snippet.js", "r", encoding="utf-8") as f:
    raw_js = f.read()

def pkr_to_inr(pkr_val):
    if not pkr_val:
        return 299
    try:
        inr = float(pkr_val) * 0.32
    except:
        inr = 299
    if inr <= 250:
        return 199
    elif inr <= 400:
        return 299
    elif inr <= 600:
        return 499
    elif inr <= 900:
        return 799
    elif inr <= 1200:
        return 999
    elif inr <= 1700:
        return 1499
    elif inr <= 2200:
        return 1999
    elif inr <= 2800:
        return 2499
    elif inr <= 3800:
        return 3499
    elif inr <= 4800:
        return 4499
    elif inr <= 6000:
        return 5499
    elif inr <= 8000:
        return 6999
    else:
        return int((round(inr / 500.0) * 500) - 1)

# Extract objects using regex split
items_raw = re.split(r'\}\,\{name:', raw_js)
print(f"Extracted {len(items_raw)} product raw string segments!")

parsed_products = []

for idx, seg in enumerate(items_raw):
    # Ensure segment starts with name
    if not seg.startswith("{name:") and not seg.startswith("name:"):
        seg = "name:" + seg
    
    name_m = re.search(r'name:`?([^`,]+)`?', seg)
    slug_m = re.search(r'slug:`?([^`,]+)`?', seg)
    desc_m = re.search(r'short_desc:`?([^`]+)`?', seg)
    
    name = name_m.group(1).replace('`', '').strip() if name_m else f"Digital Tool #{idx+1}"
    slug = slug_m.group(1).replace('`', '').strip() if slug_m else f"tool-{idx+1}"
    desc = desc_m.group(1).replace('`', '').strip() if desc_m else "Premium verified software license with instant access."
    
    # Extract variants prices
    prices = re.findall(r'price:([0-9\.]+)', seg)
    durations = re.findall(r'duration:`?([^`,]+)`?', seg)
    plans = re.findall(r'plan:`?([^`,]+)`?', seg)
    
    inr_variants = []
    if prices:
        for p_idx, p_val in enumerate(prices):
            inr_val = pkr_to_inr(p_val)
            dur = durations[p_idx] if p_idx < len(durations) else "1 Month"
            pl = plans[p_idx] if p_idx < len(plans) else "Standard"
            inr_variants.append({
                "title": f"{pl} ({dur})",
                "price": int(inr_val * 1.5),
                "sale_price": inr_val,
                "validity_days": 30 if "1" in dur else (365 if "Year" in dur or "12" in dur else 90),
                "type": "Personal Email Activation"
            })
    else:
        inr_variants = [
            {"title": "Standard Access", "price": 999, "sale_price": 499, "validity_days": 30, "type": "Personal License"}
        ]

    # Category
    cat = "AI Tools"
    low = name.lower()
    if any(k in low for k in ["adobe", "canva", "freepik", "envato", "figma", "vector", "ideogram", "leonardo"]):
        cat = "Design Tools"
    elif any(k in low for k in ["capcut", "filmora", "heygen", "invideo", "sora", "veo", "runway", "video", "youtube", "hedra", "hailuo"]):
        cat = "Video Editing"
    elif any(k in low for k in ["cursor", "replit", "github", "jetbrains", "elementor", "astra", "divi"]):
        cat = "Developer Tools"
    elif any(k in low for k in ["windows", "office", "drive"]):
        cat = "Software & OS"
    elif any(k in low for k in ["vpn", "proton", "nord", "express", "surfshark"]):
        cat = "Security & VPN"
    elif any(k in low for k in ["ahrefs", "semrush", "vidiq", "seo", "helium", "manychat"]):
        cat = "SEO & Marketing"
    elif any(k in low for k in ["coursera", "udemy", "skillshare", "turnitin"]):
        cat = "Education & Courses"
    elif any(k in low for k in ["grammarly", "quillbot", "stealth", "hix"]):
        cat = "Writing & Productivity"
    elif any(k in low for k in ["tradingview", "linkedin"]):
        cat = "Business & Career"

    img = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
    if "adobe" in low:
        img = "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80"
    elif "canva" in low:
        img = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
    elif "chatgpt" in low or "gpt" in low or "claude" in low:
        img = "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80"
    elif "code" in low or "cursor" in low or "github" in low:
        img = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
    elif "vpn" in low:
        img = "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80"
    elif "trading" in low or "crypto" in low:
        img = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80"

    parsed_products.append({
        "name": name,
        "slug": slug,
        "category": cat,
        "description": desc,
        "image_url": img,
        "delivery_type": "team_invite",
        "badge": "Best Seller" if idx % 4 == 0 else ("Verified" if idx % 3 == 0 else "Hot"),
        "rating_avg": round(4.8 + (idx % 18) * 0.01, 2),
        "rating_count": 140 + idx * 15,
        "features": [
            "100% Genuine Personal License",
            "Instant Access & Activation",
            "Full Term Replacement Guarantee",
            "24/7 WhatsApp Support"
        ],
        "variants": inr_variants
    })

bundles = [
    {
        "name": "Creator Super Bundle 2026",
        "slug": "creator-super-bundle",
        "description": "The ultimate creator pack: Canva Pro 1Yr + CapCut Pro 1Yr + ChatGPT Plus 1Mo + 50GB Graphic Assets.",
        "price": 3999,
        "sale_price": 1999,
        "badge": "Best Value Bundle",
        "image_url": "https://images.unsplash.com/photo-1542744094-3a3121699496?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Agency Power Pack",
        "slug": "agency-power-pack",
        "description": "Complete agency bundle: Adobe CC 1Yr + Midjourney 1Mo + SEMrush 1Mo + Canva Pro 1Yr + ChatGPT Plus 1Mo.",
        "price": 9999,
        "sale_price": 4999,
        "badge": "Agency Special",
        "image_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "AI Developer Master Suite",
        "slug": "ai-developer-suite",
        "description": "Full developer workspace: GitHub Copilot 1Yr + Cursor AI Pro 1Mo + JetBrains All Products 1Yr + Claude Pro 1Mo.",
        "price": 7999,
        "sale_price": 3499,
        "badge": "Dev Choice",
        "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
    }
]

catalog_data = {
    "products": parsed_products,
    "bundles": bundles
}

with open("public/data/catalog.json", "w", encoding="utf-8") as f:
    json.dump(catalog_data, f, indent=2, ensure_ascii=False)

print(f"SUCCESS: ALL {len(parsed_products)} PRODUCTS BUILT INTO CATALOG.JSON IN INR!")
