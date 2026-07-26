import asyncio
import sys
import bcrypt

sys.path.insert(0, '.')
from database import get_collection

EMAIL = 'test@test.com'
NEW_PASSWORD = 'Admin@123'

async def reset():
    col = get_collection('users')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(NEW_PASSWORD.encode('utf-8'), salt).decode('utf-8')
    result = await col.update_one({'email': EMAIL}, {'$set': {'password': hashed}})
    if result.modified_count:
        print(f'[OK] Password reset for {EMAIL}')
        print(f'     New password: {NEW_PASSWORD}')
    else:
        print('[WARN] User not found or password unchanged')

asyncio.run(reset())
