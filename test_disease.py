import requests
import json

# Test disease detection
image_path = 'backend/data/sample_inputs/strawberry-plant-leaf-spot.jpg'
with open(image_path, 'rb') as f:
    files = {'file': ('test.jpg', f, 'image/jpeg')}
    response = requests.post('http://localhost:8000/api/disease/detect', files=files)

data = response.json()

print("=" * 80)
print("DISEASE DETECTION TEST")
print("=" * 80)

print(f"\n✅ BASIC INFO:")
print(f"  Disease: {data.get('disease')}")
print(f"  Scientific Name: {data.get('scientific_name')}")
print(f"  Confidence: {data.get('confidence')}%")

print(f"\n📝 DESCRIPTION:")
desc = data.get('description', '')
if len(desc) > 100:
    print(f"  {desc[:150]}...")
else:
    print(f"  {desc}")

print(f"\n💊 TREATMENT:")
treatment = data.get('treatment', [])
if treatment:
    for t in treatment[:3]:
        print(f"  • {t}")

print(f"\n🛡️ PREVENTION:")
prevention = data.get('prevention', [])
if prevention:
    for p in prevention[:3]:
        print(f"  • {p}")

print(f"\n⚠️ SYMPTOMS:")
symptoms = data.get('symptoms', [])
if symptoms:
    for s in symptoms[:3]:
        print(f"  • {s}")
else:
    print("  (None available)")

print(f"\n🔍 ALTERNATIVES:")
alts = data.get('all_suggestions', [])
for alt in alts[:3]:
    print(f"  • {alt.get('name')}: {alt.get('probability')}%")

print(f"\n🖼️ Similar Images:")
if 'similar_images' in data:
    print(f"  Count: {len(data.get('similar_images', []))}")
else:
    print("  (Not available from Disease API)")

print("\n" + "=" * 80)
