from flask import Blueprint, request, jsonify
import  traceback
from mongoengine.errors import ValidationError
from Models.products_model import Product,Inventory
from datetime import datetime
from Middlewares.authorization import ensure_authenticated

product_api = Blueprint('product_api', __name__)

@product_api.route('/get', methods=['GET'])
@ensure_authenticated  
def get_all_products():
    try:
        products = Product.objects.all()
        if not products:
            return jsonify({'message': "No products found."}), 404

        return jsonify([product.to_json() for product in products]), 200
    except Exception as e:
        return jsonify({'message': "Error fetching products.", 'error': str(e)}), 500



@product_api.route('/<string:product_id>', methods=['GET'])
@ensure_authenticated
def get_product_details(product_id):
    try:
        product = Product.objects.get(id=product_id)
        return jsonify(product.to_json()), 200
    except Product.DoesNotExist:
        return jsonify({'message': "Product not found."}), 404
    except Exception as e:
        return jsonify({'message': "Error fetching product details.", 'error': str(e)}), 500



@product_api.route('/add', methods=['POST'])
@ensure_authenticated
def post_product_details():
    try:
        data = request.get_json()

        name = data.get("name")
        description = data.get("description")
        price = data.get("price")
        brand = data.get("brand")
        category = data.get("category")
        features = data.get("features")
        sold_by = data.get("soldBy")
        image_url = data.get("imageUrl")
        inventory_data = data.get("inventory")


        if not name or not price or not category or not image_url or not inventory_data or inventory_data.get('stock', 0) < 0 or not inventory_data.get('supplier'):
            return jsonify({'message': "Missing required fields."}), 400


        inventory_item = {
            'stock': inventory_data['stock'],
            'supplier': inventory_data['supplier'],
            'last_updated': datetime.utcnow()
        }

        in_stock = inventory_data['stock'] > 0


        product = Product(
            name=name,
            description=description,
            price=price,
            brand=brand,
            category=category,
            features=features or [],
            sold_by=sold_by,
            image_url=image_url,
            inventory=[inventory_item],
            is_active=True,
            in_stock=in_stock
        )


        product.save()


        return jsonify({
            'message': "Product created successfully.",
            'product': product.to_json()
        }), 201

    except ValidationError as ve:
        return jsonify({'message': "Validation error", 'error': str(ve)}), 400
    except Exception as e:

        traceback.print_exc() 
        return jsonify({'message': "Internal server error.", 'error': str(e)}), 500