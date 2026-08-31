import json
import re
import os

with open("public/data/excel_tools_list.json", "r", encoding="utf-8") as f:
    raw_tools = json.load(f)

print(f"Loaded {len(raw_tools)} tool items from Excel dataset.")

# Function to parse INR sale price from original price or estimate clean INR price
def extract_inr_price(price_str, validity_str, tool_name):
    if not price_str or "not specified" in price_str.lower():
        # Default reasonable prices based on validity
        if "12" in validity_str or "year" in validity_str.lower():
            return 999
        elif "6" in validity_str:
            return 599
        elif "3" in validity_str:
            return 399
        else:
            return 199

    # Look for INR pattern ₹XXX
    inr_match = re.search(r'₹\s*([0-9,]+)', price_str)
    if inr_match:
        val = int(inr_match.group(1).replace(',', ''))
        # Discount by ~40-60% for resale pricing
        return max(199, int(val * 0.4))
    
    # Look for USD pattern $XX
    usd_match = re.search(r'\$\s*([0-9\.]+)', price_str)
    if usd_match:
        usd_val = float(usd_match.group(1))
        # USD to INR conversion (e.g. $50 -> ₹3999, $20 -> ₹1499, $10 -> ₹799)
        inr_val = usd_val * 40
        return max(199, int(round(inr_val / 50.0) * 50 - 1))
        
    return 299

# Group products by tool name
grouped_products = {}

for item in raw_tools:
    raw_name = item.get("name", "").strip()
    if not raw_name:
        continue
        
    # Clean name key
    name_key = raw_name.lower().replace(" ", "-")
    
    plan = item.get("plan", "Standard")
    desc = item.get("description", "Premium software license.")
    orig_price = item.get("original_price", "")
    validity = item.get("validity", "1 Month")
    
    sale_price = extract_inr_price(orig_price, validity, raw_name)
    list_price = int(sale_price * 1.5)

    variant_obj = {
        "title": f"{plan} ({validity})",
        "price": list_price,
        "sale_price": sale_price,
        "validity_days": 365 if "12" in validity or "year" in validity.lower() else (180 if "6" in validity else (90 if "3" in validity else 30)),
        "type": "Personal Email Activation",
        "notes": orig_price if orig_price and "not specified" not in orig_price.lower() else None
    }

    if name_key not in grouped_products:
        # Categorize
        cat = "AI Tools"
        low = raw_name.lower()
        if any(k in low for k in ["adobe", "canva", "freepik", "envato", "figma", "vector", "design", "photoshop", "illustrator"]):
            cat = "Design Tools"
        elif any(k in low for k in ["capcut", "filmora", "heygen", "invideo", "sora", "veo", "runway", "video", "youtube", "prime", "netflix", "hotstar"]):
            cat = "Video & Streaming"
        elif any(k in low for k in ["cursor", "replit", "github", "jetbrains", "elementor", "astra", "divi", "lovable", "bolt", "v0", "dev"]):
            cat = "Developer & SaaS"
        elif any(k in low for k in ["windows", "office", "drive", "cloud", "storage"]):
            cat = "Software & OS"
        elif any(k in low for k in ["vpn", "nord", "express", "surfshark", "proton"]):
            cat = "Security & VPN"
        elif any(k in low for k in ["ahrefs", "semrush", "vidiq", "seo", "helium", "manychat", "marketing"]):
            cat = "SEO & Marketing"
        elif any(k in low for k in ["coursera", "udemy", "skillshare", "turnitin", "education"]):
            cat = "Education & Courses"
        elif any(k in low for k in ["grammarly", "quillbot", "stealth", "writer", "notion"]):
            cat = "Writing & Productivity"
        elif any(k in low for k in ["tradingview", "linkedin", "finance"]):
            cat = "Business & Career"

        img = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
        if "adobe" in low:
            img = "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80"
        elif "canva" in low:
            img = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
        elif "gpt" in low or "chat" in low or "claude" in low or "ai" in low:
            img = "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80"
        elif "code" in low or "cursor" in low or "dev" in low or "lovable" in low:
            img = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"

        # Split features from description
        features = [f.strip() for f in desc.split('.') if len(f.strip()) > 5][:4]
        if not features:
            features = ["100% Verified License", "Instant Activation", "Replacement Warranty", "24/7 WhatsApp Support"]

        grouped_products[name_key] = {
            "name": raw_name,
            "slug": name_key,
            "category": cat,
            "description": desc,
            "image_url": img,
            "delivery_type": "team_invite",
            "badge": "Excel Verified",
            "rating_avg": 4.9,
            "rating_count": 250,
            "features": features,
            "variants": [variant_obj]
        }
    else:
        # Append variant if not duplicate title
        existing_titles = [v["title"] for v in grouped_products[name_key]["variants"]]
        if variant_obj["title"] not in existing_titles:
            grouped_products[name_key]["variants"].append(variant_obj)

final_products = list(grouped_products.values())

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
        "description": "Full developer workspace: GitHub Copilot 1Yr + Cursor AI Pro 1Mo + Lovable Pro 3Mo + JetBrains All Products 1Yr.",
        "price": 7999,
        "sale_price": 3499,
        "badge": "Dev Choice",
        "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
    }
]

catalog_data = {
    "products": final_products,
    "bundles": bundles
}

with open("public/data/catalog.json", "w", encoding="utf-8") as f:
    json.dump(catalog_data, f, indent=2, ensure_ascii=False)

print(f"\n==================================================")
print(f"SUCCESSFULLY CONVERTED EXCEL DATASET!")
print(f"Total Unique Product Cards: {len(final_products)}")
print(f"Total Combined Plans/Variants: {sum(len(p['variants']) for p in final_products)}")
print(f"==================================================")
