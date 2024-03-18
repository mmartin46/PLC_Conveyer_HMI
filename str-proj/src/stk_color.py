from routes import *

# Initialize Flask app
app = Flask(__name__, static_url_path='/public')
CORS(app)

app.register_blueprint(main_bp)

if __name__ == '__main__':
    app.run(debug=True, host='192.168.0.254', port=8081)

