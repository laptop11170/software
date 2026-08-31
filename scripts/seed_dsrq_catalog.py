import json
import os

products = [
    {
        "name": "Adobe Creative Cloud All Apps",
        "slug": "adobe-creative-cloud",
        "category": "Design Tools",
        "description": "Full access to 20+ Adobe desktop and mobile apps including Photoshop, Illustrator, Premiere Pro, After Effects, and Lightroom with 100GB Cloud Storage.",
        "image_url": "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "team_invite",
        "badge": "Best Seller",
        "rating_avg": 4.9,
        "rating_count": 420,
        "features": ["Personal Email Invite", "20+ Desktop & Mobile Apps", "Generative Fill & AI Features", "Cloud Sync & Fonts", "1 Year Warranty"],
        "variants": [
            {"title": "1 Month Plan", "price": 1299, "sale_price": 799, "validity_days": 30, "type": "Personal Email Invite"},
            {"title": "6 Months Plan", "price": 3999, "sale_price": 2499, "validity_days": 180, "type": "Personal Email Invite"},
            {"title": "1 Year Full Plan", "price": 6999, "sale_price": 3999, "validity_days": 365, "type": "Personal Email Invite"}
        ]
    },
    {
        "name": "Canva Pro",
        "slug": "canva-pro",
        "category": "Design Tools",
        "description": "Unlock 100M+ premium stock photos, videos, audio, 610k+ premium templates, Magic Resize, Background Remover, and Brand Kits.",
        "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "team_invite",
        "badge": "Top Rated",
        "rating_avg": 4.95,
        "rating_count": 810,
        "features": ["Personal Email Activation", "Background Remover", "Brand Kit & Custom Fonts", "Magic Studio AI Tools", "1TB Cloud Storage"],
        "variants": [
            {"title": "1 Month Access", "price": 399, "sale_price": 199, "validity_days": 30, "type": "Team Invite"},
            {"title": "6 Months Access", "price": 999, "sale_price": 599, "validity_days": 180, "type": "Team Invite"},
            {"title": "1 Year Access", "price": 1999, "sale_price": 999, "validity_days": 365, "type": "Team Invite"}
        ]
    },
    {
        "name": "ChatGPT Plus (GPT-4o & Sora)",
        "slug": "chatgpt-plus",
        "category": "AI Tools",
        "description": "Access GPT-4o, DALL-E 3 image generation, Advanced Data Analysis, Custom GPTs, Web Browsing, and priority access during peak hours.",
        "image_url": "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "shared_account",
        "badge": "Trending",
        "rating_avg": 4.88,
        "rating_count": 645,
        "features": ["GPT-4o & Canvas Access", "DALL-E 3 Image Generation", "Custom GPTs & Data Analysis", "Instant Activation", "Warranty Replacement Guarantee"],
        "variants": [
            {"title": "1 Month Shared Profile", "price": 899, "sale_price": 499, "validity_days": 30, "type": "Shared Profile"},
            {"title": "1 Month Private Account", "price": 2499, "sale_price": 1799, "validity_days": 30, "type": "Private Account"}
        ]
    },
    {
        "name": "Claude Pro (Anthropic AI)",
        "slug": "claude-pro",
        "category": "AI Tools",
        "description": "Access Claude 3.5 Sonnet & Haiku with 200k token context window, Artifacts interactive preview, and 5x higher usage limits.",
        "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "shared_account",
        "badge": "Hot AI",
        "rating_avg": 4.92,
        "rating_count": 520,
        "features": ["Claude 3.5 Sonnet Unlocked", "200k Token Context Limit", "Artifacts Preview Enabled", "Instant Delivery"],
        "variants": [
            {"title": "1 Month Shared Profile", "price": 999, "sale_price": 599, "validity_days": 30, "type": "Shared Profile"},
            {"title": "1 Month Private Account", "price": 2599, "sale_price": 1899, "validity_days": 30, "type": "Private Account"}
        ]
    },
    {
        "name": "Midjourney v6 Alpha",
        "slug": "midjourney",
        "category": "AI Tools",
        "description": "The world's most advanced AI image generator. Create photorealistic art, architectural renders, logos, and UI graphics.",
        "image_url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "shared_account",
        "badge": "Popular",
        "rating_avg": 4.85,
        "rating_count": 389,
        "features": ["Fast GPU Hours", "v6 & v5.2 Models", "Commercial Usage Rights", "Private Server Bot Access"],
        "variants": [
            {"title": "1 Month Fast Access", "price": 1199, "sale_price": 699, "validity_days": 30, "type": "Shared Access"},
            {"title": "1 Month Private Account", "price": 3499, "sale_price": 2499, "validity_days": 30, "type": "Private Account"}
        ]
    },
    {
        "name": "Perplexity AI Pro",
        "slug": "perplexity-pro",
        "category": "AI Tools",
        "description": "AI-powered answer engine with Pro Search, Claude 3.5 Sonnet, GPT-4o, Sonar Large, and file upload analysis.",
        "image_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "shared_account",
        "badge": "AI Research",
        "rating_avg": 4.87,
        "rating_count": 290,
        "features": ["Unlimited Pro Searches", "Choose GPT-4o or Claude 3.5", "File & Document Analysis", "Instant Access"],
        "variants": [
            {"title": "1 Month Pro Plan", "price": 699, "sale_price": 399, "validity_days": 30, "type": "Shared Account"},
            {"title": "6 Months Pro Plan", "price": 1999, "sale_price": 1299, "validity_days": 180, "type": "Shared Account"}
        ]
    },
    {
        "name": "CapCut Pro Desktop & Mobile",
        "slug": "capcut-pro",
        "category": "Video Editing",
        "description": "Unlock Pro AI effects, auto-captions, background removal, motion tracking, 4K export, and 100GB cloud storage.",
        "image_url": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "private_account",
        "badge": "Hot",
        "rating_avg": 4.92,
        "rating_count": 510,
        "features": ["Pro Effects & Transitions", "Auto Captioning", "AI Video Upscaler", "Multi-device Sync"],
        "variants": [
            {"title": "1 Month Pro Plan", "price": 499, "sale_price": 299, "validity_days": 30, "type": "Account"},
            {"title": "1 Year Pro Plan", "price": 1799, "sale_price": 999, "validity_days": 365, "type": "Account"}
        ]
    },
    {
        "name": "Grammarly Premium",
        "slug": "grammarly-premium",
        "category": "Writing & Productivity",
        "description": "Advanced grammar checking, tone detector, plagiarism checker, vocabulary enhancement, and AI rewrite prompts.",
        "image_url": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "shared_account",
        "badge": "Essential",
        "rating_avg": 4.8,
        "rating_count": 460,
        "features": ["Plagiarism Checker", "Tone Adjustments", "Full Sentence Rewrites", "Browser Extension Integration"],
        "variants": [
            {"title": "1 Month Shared Access", "price": 399, "sale_price": 199, "validity_days": 30, "type": "Shared"},
            {"title": "1 Year Shared Access", "price": 1299, "sale_price": 699, "validity_days": 365, "type": "Shared"}
        ]
    },
    {
        "name": "LinkedIn Premium Business",
        "slug": "linkedin-premium",
        "category": "Business & Career",
        "description": "Unlimited profile browsing, 15 InMail messages per month, see who viewed your profile, LinkedIn Learning access, and AI profile builder.",
        "image_url": "https://images.unsplash.com/photo-1611944212129-29977ae1398c?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "team_invite",
        "badge": "Verified",
        "rating_avg": 4.9,
        "rating_count": 342,
        "features": ["15 InMails / Month", "Unlimited Profile Search", "LinkedIn Learning Unlocked", "Competitor Insights"],
        "variants": [
            {"title": "6 Months Voucher / Invite", "price": 2499, "sale_price": 1499, "validity_days": 180, "type": "Personal Activation"}
        ]
    },
    {
        "name": "SEMrush Guru & Ahrefs Pack",
        "slug": "semrush-ahrefs-pack",
        "category": "SEO & Marketing",
        "description": "Complete SEO toolkit for keyword research, backlink analysis, site audit, rank tracking, and competitor intelligence.",
        "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "shared_account",
        "badge": "Agency Choice",
        "rating_avg": 4.75,
        "rating_count": 298,
        "features": ["Domain Overview & Audit", "Keyword Magic Tool", "Backlink Analysis", "Daily Position Tracking"],
        "variants": [
            {"title": "1 Month Shared SEO Panel", "price": 1499, "sale_price": 899, "validity_days": 30, "type": "Shared Panel"}
        ]
    },
    {
        "name": "Envato Elements Unlimited",
        "slug": "envato-elements",
        "category": "Design Tools",
        "description": "Unlimited downloads of stock videos, video templates, music, graphics, 3D assets, WordPress themes, and presentation templates.",
        "image_url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "shared_account",
        "badge": "Designer Favorite",
        "rating_avg": 4.91,
        "rating_count": 620,
        "features": ["Unlimited Stock Video & Music", "WP Themes & Plugins", "Commercial License Included", "Instant Direct Downloader"],
        "variants": [
            {"title": "1 Month Unlimited", "price": 899, "sale_price": 499, "validity_days": 30, "type": "Shared Account"},
            {"title": "6 Months Unlimited", "price": 2499, "sale_price": 1499, "validity_days": 180, "type": "Shared Account"}
        ]
    },
    {
        "name": "Freepik Premium",
        "slug": "freepik-premium",
        "category": "Design Tools",
        "description": "Download millions of premium vectors, photos, PSD files, icons, and AI image generator credits.",
        "image_url": "https://images.unsplash.com/photo-1542744094-3a3121699496?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "shared_account",
        "badge": "Vector Hub",
        "rating_avg": 4.88,
        "rating_count": 430,
        "features": ["Premium PSDs & Vectors", "Commercial License", "No Attribution Required", "High-speed Download"],
        "variants": [
            {"title": "1 Month Access", "price": 499, "sale_price": 299, "validity_days": 30, "type": "Shared Account"},
            {"title": "1 Year Access", "price": 1499, "sale_price": 899, "validity_days": 365, "type": "Shared Account"}
        ]
    },
    {
        "name": "ElevenLabs AI Voice Studio",
        "slug": "elevenlabs-pro",
        "category": "AI Tools",
        "description": "Ultra-realistic text-to-speech AI voice generator, voice cloning, emotion control, and dubbing in 29+ languages.",
        "image_url": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "shared_account",
        "badge": "AI Voice",
        "rating_avg": 4.94,
        "rating_count": 310,
        "features": ["100k Character Credits", "Voice Cloning Unlocked", "Commercial Audio License", "Instant Access"],
        "variants": [
            {"title": "1 Month Starter Pro", "price": 999, "sale_price": 599, "validity_days": 30, "type": "Shared Account"}
        ]
    },
    {
        "name": "GitHub Copilot Pro",
        "slug": "github-copilot",
        "category": "Developer Tools",
        "description": "AI pair programmer for VS Code, JetBrains, Neovim. Autocomplete code in real time, generate functions, and fix bugs automatically.",
        "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "team_invite",
        "badge": "Dev Essential",
        "rating_avg": 4.96,
        "rating_count": 780,
        "features": ["VS Code & JetBrains Plugin", "Real-time Code Suggestion", "GPT-4o Coding Assistant", "Personal GitHub Activation"],
        "variants": [
            {"title": "1 Month Pro Plan", "price": 499, "sale_price": 299, "validity_days": 30, "type": "GitHub Invite"},
            {"title": "1 Year Pro Plan", "price": 1799, "sale_price": 999, "validity_days": 365, "type": "GitHub Invite"}
        ]
    },
    {
        "name": "JetBrains All Products Pack",
        "slug": "jetbrains-all-products",
        "category": "Developer Tools",
        "description": "Complete IDE suite including IntelliJ IDEA Ultimate, PyCharm Pro, WebStorm, Rider, GoLand, CLion, and DataGrip.",
        "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "team_invite",
        "badge": "Ultimate IDE",
        "rating_avg": 4.97,
        "rating_count": 390,
        "features": ["15+ JetBrains IDEs Unlocked", "Personal Account Activation", "Official License Key", "1 Year Warranty"],
        "variants": [
            {"title": "1 Year Official Student/Pro License", "price": 1499, "sale_price": 699, "validity_days": 365, "type": "License Activation"}
        ]
    },
    {
        "name": "Windows 11 Pro Lifetime Retail Key",
        "slug": "windows-11-pro",
        "category": "Software & OS",
        "description": "100% Genuine Microsoft Windows 11 Professional 32/64-bit retail activation key with lifetime online updates.",
        "image_url": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "license_key",
        "badge": "Lifetime Key",
        "rating_avg": 4.98,
        "rating_count": 920,
        "features": ["Genuine Microsoft Key", "Lifetime Validity & Updates", "Instant Key Delivery", "BitLocker & Remote Desktop"],
        "variants": [
            {"title": "1 PC Lifetime Key", "price": 999, "sale_price": 499, "validity_days": 3650, "type": "Digital Key"}
        ]
    },
    {
        "name": "Microsoft Office 2024 Pro Plus Key",
        "slug": "office-2024-pro-plus",
        "category": "Software & OS",
        "description": "Lifetime digital license key for Word, Excel, PowerPoint, Outlook, Access, and Publisher 2024.",
        "image_url": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "license_key",
        "badge": "Lifetime Key",
        "rating_avg": 4.95,
        "rating_count": 870,
        "features": ["Word, Excel, PPT, Outlook 2024", "1 PC Bindable Key", "Lifetime Updates", "Instant Key Email"],
        "variants": [
            {"title": "1 PC Lifetime License Key", "price": 1299, "sale_price": 599, "validity_days": 3650, "type": "Digital Key"}
        ]
    },
    {
        "name": "NordVPN / ExpressVPN Ultra Pack",
        "slug": "nordvpn-expressvpn",
        "category": "Security & VPN",
        "description": "High-speed encrypted VPN with 5000+ servers worldwide, threat protection, kill switch, and zero-logs privacy.",
        "image_url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "shared_account",
        "badge": "Privacy Choice",
        "rating_avg": 4.86,
        "rating_count": 640,
        "features": ["Double Encryption & P2P", "Unblock Netflix & Streaming", "Fast 10Gbps Servers", "Multi-device Support"],
        "variants": [
            {"title": "1 Month Premium Access", "price": 399, "sale_price": 199, "validity_days": 30, "type": "Account"},
            {"title": "1 Year Premium Access", "price": 1199, "sale_price": 599, "validity_days": 365, "type": "Account"}
        ]
    },
    {
        "name": "TradingView Premium",
        "slug": "tradingview-premium",
        "category": "Business & Finance",
        "description": "25 indicators per chart, 8 charts in one layout, 400 alert limits, second-based charts, and volume profile indicators.",
        "image_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "shared_account",
        "badge": "Traders Favorite",
        "rating_avg": 4.93,
        "rating_count": 510,
        "features": ["25 Indicators Per Chart", "8 Charts Layout", "Real-time Data & Alerts", "Volume Profile & Bar Replay"],
        "variants": [
            {"title": "1 Month Premium", "price": 1499, "sale_price": 799, "validity_days": 30, "type": "Shared Account"}
        ]
    },
    {
        "name": "Coursera Plus 1 Year Unlimited",
        "slug": "coursera-plus",
        "category": "Education & Courses",
        "description": "Unlimited access to 7,000+ courses, Specializations, and Professional Certificates from Google, IBM, Meta, and top universities.",
        "image_url": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&q=80",
        "delivery_type": "team_invite",
        "badge": "Certified",
        "rating_avg": 4.95,
        "rating_count": 480,
        "features": ["7,000+ Verified Courses", "Shareable Certificates", "Google & IBM Professional Badges", "Personal Email Invite"],
        "variants": [
            {"title": "1 Year Full Access", "price": 2999, "sale_price": 999, "validity_days": 365, "type": "Personal Email Invite"}
        ]
    }
]

bundles = [
    {
        "name": "Creator Super Bundle 2026",
        "slug": "creator-super-bundle",
        "description": "The ultimate creator toolkit: Canva Pro 1Yr + CapCut Pro 1Yr + ChatGPT Plus 1Mo + 50GB Graphic Assets Pack.",
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
    }
]

os.makedirs("public/data", exist_ok=True)
os.makedirs("supabase", exist_ok=True)

data = {
    "products": products,
    "bundles": bundles
}

with open("public/data/catalog.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Saved {len(products)} products and {len(bundles)} bundles to public/data/catalog.json!")
