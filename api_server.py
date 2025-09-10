from flask import Flask, request, jsonify
from upi_recommendation_system import UPIRecommendationSystem
import pandas as pd

app = Flask(__name__)

# Initialize the recommendation system
recommender = UPIRecommendationSystem()
recommender.load_data('upi_transactions_dataset.csv', 'user_behavior_profiles.csv')

@app.route('/')
def home():
    return jsonify({
        "message": "UPI Recommendation API",
        "endpoints": ["/recommend", "/user-insights/<user_id>"]
    })

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    result = recommender.recommend_amount(
        user_id=data.get('user_id'),
        category=data.get('category'),
        location=data.get('location', 'Mumbai'),
        payment_method=data.get('payment_method', 'PhonePe'),
        hour=data.get('hour', 14)
    )
    return jsonify(result)

@app.route('/user-insights/<user_id>')
def user_insights(user_id):
    result = recommender.get_user_insights(user_id)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
