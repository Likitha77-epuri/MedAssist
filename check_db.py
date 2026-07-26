import asyncio
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from database import get_collection

async def check():
    col = get_collection("users")
    count = await col.count_documents({})
    print(f"User count: {count}")
    users = await col.find({}).to_list(10)
    for u in users:
        print(f"  - {u.get('email')} (role: {u.get('role', 'user')})")
    if count == 0:
        print("No users found in database!")

asyncio.run(check())
