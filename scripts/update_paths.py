
import os

file_path = "frontend/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Update CSS path
content = content.replace('href="css/styles.css"', 'href="/static/css/styles.css"')

# Update JS paths
scripts = [
    "js/api.js",
    "js/state.js",
    "js/components.js",
    "js/pages/dashboard.js",
    "js/pages/clients.js",
    "js/pages/projects.js",
    "js/pages/vendors.js",
    "js/pages/bills.js",
    "js/pages/amount.js",
    "js/pages/valuation.js"
]

for script in scripts:
    content = content.replace(f'src="{script}"', f'src="/static/{script}"')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated frontend/index.html paths")
