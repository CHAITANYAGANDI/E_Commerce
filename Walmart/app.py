from flask import Flask
from Controllers.products_controller import product_api
from Models.db_connection import initialize_db
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3001"]}})


initialize_db()


app.register_blueprint(product_api, url_prefix='/')

if __name__ == '__main__':
    app.run(port=7004, debug=True)
