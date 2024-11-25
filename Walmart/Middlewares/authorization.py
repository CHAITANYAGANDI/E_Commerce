from flask import request, jsonify
from functools import wraps 
import jwt
import os

def ensure_authenticated(func):
    @wraps(func)
    def wrapper(*args, **kwargs):

        auth = request.headers.get('productsauthorization')
        
        if not auth:
            return jsonify({"error": "Unauthorized"}), 403

        try:

            decoded = jwt.decode(auth, os.getenv("INVENTORY_SECRET"), algorithms=["HS256"])
            request.inventory = decoded
            print(decoded)
            original_url = request.headers.get('x-original-url')

            if decoded.get("api_url") not in original_url:
                return jsonify({"error": "Invalid API URL. Access denied."}), 403
            
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token is expired"}), 403
        
        except Exception as e:
            return jsonify({"error": str(e)}), 403

        return func(*args, **kwargs)
    
    return wrapper
