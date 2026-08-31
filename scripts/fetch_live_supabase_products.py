import urllib.request
import json

supabase_url = "https://tkfzwivbvidwbpshnwph.supabase.co"
anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZnp3aXZidmlkd2Jwc2hud3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MzEzMDMsImV4cCI6MjA3ODAwNzMwM30.ecugAAs8OnxhCDlESV_2nmbAao7yBaQDZUbvyMy3"

headers = {
    "apikey": anon_key,
    "Authorization": f"Bearer {anon_key}",
    "Content-Type": "application/json"
}

# Try fetching public REST tables
tables = ["products", "digital_products", "bundles", "tools", "public_products"]

for table in tables:
    url = f"{supabase_url}/rest/v1/{table}?select=*"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"Table '{table}': FETCHED {len(data)} ROWS!")
            if data:
                print(f"Sample item from '{table}':", json.dumps(data[0], indent=2))
                with open(f"public/data/live_supabase_{table}.json", "w") as f:
                    json.dump(data, f, indent=2)
    except urllib.error.HTTPError as e:
        print(f"Table '{table}': HTTP {e.code} - {e.reason}")
    except Exception as e:
        print(f"Table '{table}': Exception - {e}")
