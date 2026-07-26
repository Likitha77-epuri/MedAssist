import logging
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

logger = logging.getLogger("mediassist")
logging.basicConfig(level=logging.INFO)

class Database:
    client: AsyncIOMotorClient = None
    db = None

    def connect(self):
        try:
            self.client = AsyncIOMotorClient(settings.mongodb_url)
            self.db = self.client[settings.database_name]
            logger.info(f"Connected to MongoDB at: {settings.mongodb_url}")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")

    def disconnect(self):
        if self.client:
            self.client.close()
            logger.info("Closed MongoDB connection")

db_helper = Database()

def get_collection(name: str):
    if db_helper.db is None:
        db_helper.connect()
    return db_helper.db[name]
