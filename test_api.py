#!/usr/bin/env python
"""
Test script to verify API endpoints are working
"""

import requests
import time
import sys

# Wait for server to start
print("Waiting for server to start...")
time.sleep(3)

BASE_URL = "http://localhost:8000"

tests = [
    ("Health Check", "GET", f"{BASE_URL}/health", None),
    ("API Health", "GET", f"{BASE_URL}/api/health", None),
    ("Schedules List", "GET", f"{BASE_URL}/api/schedules/?user_id=default_user", None),
    ("Schedules Save", "POST", f"{BASE_URL}/api/schedules/save?crop=rice&city=Mumbai&user_id=default_user", None),
]

print("\n" + "="*60)
print("API ENDPOINT TESTS")
print("="*60 + "\n")

for test_name, method, url, data in tests:
    try:
        if method == "GET":
            response = requests.get(url, timeout=5)
        elif method == "POST":
            response = requests.post(url, timeout=5)
        
        print(f"✓ {test_name}")
        print(f"  URL: {url}")
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            print(f"  ✓ SUCCESS")
        elif 300 <= response.status_code < 400:
            print(f"  ⚠ REDIRECT")
        elif 400 <= response.status_code < 500:
            print(f"  ✗ CLIENT ERROR")
        elif 500 <= response.status_code:
            print(f"  ✗ SERVER ERROR")
        print()
    except requests.exceptions.RequestException as e:
        print(f"✗ {test_name}")
        print(f"  ERROR: {str(e)}")
        print()
