from mongoengine import Document, EmbeddedDocument, StringField, FloatField, BooleanField, ListField, DateTimeField, IntField, DictField
from datetime import datetime

class Inventory(EmbeddedDocument):
    stock = IntField(required=True)
    supplier = StringField(required=True)
    last_updated = DateTimeField(default=datetime.utcnow)

class Product(Document):
    name = StringField(required=True, unique=True)
    description = StringField(required=True)
    price = FloatField(required=True, min_value=0)
    category = StringField(required=True)
    brand = StringField()
    features = ListField(StringField())
    sold_by = StringField(required=True)
    image_url = StringField(required=True)
    inventory = ListField(DictField())
    is_active = BooleanField(default=True)
    in_stock = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'indexes': [
            {'fields': ['name', 'brand', 'sold_by'], 'unique': True}
        ],
        'collection': 'Walmart_Products'
    }
    
    def to_json(self):

        inventory_data = self.inventory[0] if self.inventory else {
            'stock': 0,
            'supplier': '',
            'lastUpdated': datetime.utcnow()
        }
        
        return {
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'brand': self.brand,
            'features': self.features,
            'soldBy': self.sold_by,
            'imageUrl': self.image_url,
            'inventory': {
                'stock': inventory_data.get('stock', 0),
                'supplier': inventory_data.get('supplier', ''),
                'lastUpdated': inventory_data.get('lastUpdated', datetime.utcnow())
            },
            'isActive': self.is_active,
            'inStock': self.in_stock,
            '_id': str(self.id),
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }