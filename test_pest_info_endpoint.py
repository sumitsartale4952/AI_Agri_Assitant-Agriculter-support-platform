import requests

# Test fetching pest info from backend
pest_name = "mosquito"
response = requests.get(f"http://localhost:8000/api/ml/pest-info/{pest_name}")

if response.ok:
    data = response.json()
    print("✅ Local Pest Info Found!")
    print(f"Pest: {data.get('pest_name')}")
    print(f"Severity: {data.get('severity')}")
    print(f"Affected Crops: {data.get('affected_crops')}")
    print(f"\nOrganic Control Options:")
    for opt in data.get('organic_control', []):
        print(f"  • {opt}")
    print(f"\nChemical Control Options:")
    for opt in data.get('chemical_control', []):
        print(f"  • {opt}")
else:
    print(f"❌ Error: {response.status_code}")
