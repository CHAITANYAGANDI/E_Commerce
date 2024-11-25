# from flask import Blueprint
# from Controllers.inventory_controller import get_product_details, get_all_products, post_product_details
# from Middlewares.authorization import ensure_authenticated




# product_router = Blueprint('product_router', __name__)

# product_router.route('/get', methods=['GET'])(ensure_authenticated(get_all_product_details))
# product_router.route('/<int:productId>', methods=['GET'])(ensure_authenticated(get_product_details))
# product_router.route('/add', methods=['POST'])(ensure_authenticated(post_product_details))
