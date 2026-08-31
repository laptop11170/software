import shutil
import os

# Copy favicon.svg to public/favicon.svg and favicon.ico
svg_path = "favicon.svg"
public_svg = "public/favicon.svg"
ico_path = "favicon.ico"

os.makedirs("public", exist_ok=True)
shutil.copy(svg_path, public_svg)
shutil.copy(svg_path, ico_path)

print("Favicon files generated and synced successfully!")
