from mongoengine import connect
import os

def initialize_db():
    connect(
        host=os.getenv("MONGO_CONN")
    )
