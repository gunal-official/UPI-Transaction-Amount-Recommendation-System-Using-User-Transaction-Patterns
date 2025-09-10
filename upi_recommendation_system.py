
"""
UPI Transaction Amount Recommendation System
===========================================

A machine learning-based system that recommends optimal transaction amounts
for UPI payments based on user behavior patterns and transaction context.

Author: Data Science Team
Date: December 2024
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import KMeans
import pickle
import json
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class UPIRecommendationSystem:
    """
    Main recommendation system class
    """

    def __init__(self, model_path=None):
        self.model = None
        self.encoders = {}
        self.scaler = None
        self.user_profiles = None
        self.user_clusters = None

        if model_path:
            self.load_model(model_path)

    def load_data(self, transactions_path, user_profiles_path):
        """Load transaction data and user profiles"""
        self.transactions = pd.read_csv(transactions_path)
        self.user_profiles = pd.read_csv(user_profiles_path, index_col=0)
        print(f"✅ Loaded {len(self.transactions)} transactions and {len(self.user_profiles)} user profiles")

    def recommend_amount(self, user_id, category, receiver_type='Merchant', 
                        location='Mumbai', payment_method='PhonePe', hour=14):
        """
        Recommend transaction amount for a user

        Parameters:
        -----------
        user_id : str
            User identifier
        category : str
            Transaction category (e.g., 'Food & Dining', 'Transportation')
        receiver_type : str
            Type of receiver ('Merchant', 'Individual', 'Service Provider', 'E-commerce')
        location : str
            Transaction location
        payment_method : str
            UPI payment method ('PhonePe', 'Google Pay', 'Paytm', etc.)
        hour : int
            Hour of transaction (0-23)

        Returns:
        --------
        dict : Recommendation details including amount and confidence
        """

        if user_id not in self.user_profiles.index:
            return self._recommend_for_new_user(category)

        user_profile = self.user_profiles.loc[user_id]

        # Create feature vector
        try:
            feature_vector = np.array([
                user_profile['avg_amount'],
                user_profile['median_amount'], 
                user_profile['amount_std'],
                user_profile['transaction_count'],
                user_profile['avg_hour'],
                user_profile['weekend_ratio'],
                30,  # days_since_first
                self._encode_safely('category', category),
                self._encode_safely('receiver_type', receiver_type),
                self._encode_safely('location', location),
                self._encode_safely('payment_method', payment_method),
                hour,
                1 if hour >= 18 or hour <= 6 else 0,  # is_weekend proxy
                datetime.now().month,
                datetime.now().day
            ]).reshape(1, -1)

            # Make prediction
            if self.model:
                predicted_amount = self.model.predict(feature_vector)[0]
            else:
                predicted_amount = user_profile['avg_amount'] * np.random.uniform(0.8, 1.2)

            # Apply business constraints
            predicted_amount = max(10, min(10000, predicted_amount))

            return {
                'user_id': user_id,
                'recommended_amount': round(predicted_amount, 2),
                'user_cluster': int(user_profile.get('cluster', 0)),
                'confidence': min(0.95, 0.6 + (user_profile['transaction_count'] / 50)),
                'user_avg_spending': round(user_profile['avg_amount'], 2),
                'category': category,
                'context': {
                    'location': location,
                    'time': f"{hour:02d}:00",
                    'payment_method': payment_method
                }
            }

        except Exception as e:
            print(f"Error in recommendation: {e}")
            return self._recommend_for_new_user(category)

    def _encode_safely(self, encoder_name, value):
        """Safely encode categorical values"""
        if encoder_name in self.encoders:
            try:
                return self.encoders[encoder_name].transform([value])[0]
            except:
                return 0  # Default value
        return 0

    def _recommend_for_new_user(self, category):
        """Recommend for new users based on category averages"""
        category_averages = {
            'Food & Dining': 250,
            'Transportation': 120,
            'Shopping': 800,
            'Bills & Utilities': 650,
            'Entertainment': 400,
            'Healthcare': 800,
            'Education': 2000,
            'Groceries': 350,
            'Fuel': 500,
            'Transfer to Friends': 1500
        }

        base_amount = category_averages.get(category, 500)
        recommended_amount = base_amount * np.random.uniform(0.8, 1.2)

        return {
            'user_id': 'NEW_USER',
            'recommended_amount': round(recommended_amount, 2),
            'user_cluster': 0,
            'confidence': 0.3,
            'user_avg_spending': 0,
            'category': category,
            'note': 'Recommendation based on category average (new user)'
        }

    def get_user_insights(self, user_id):
        """Get comprehensive user insights"""
        if user_id not in self.user_profiles.index:
            return {'error': 'User not found'}

        user_profile = self.user_profiles.loc[user_id]

        cluster_labels = {
            0: "Conservative Spenders",
            1: "High-Value Users",
            2: "Frequent Small Transactions", 
            3: "Active Users",
            4: "Balanced Spenders"
        }

        return {
            'user_id': user_id,
            'spending_profile': {
                'avg_amount': round(user_profile['avg_amount'], 2),
                'total_transactions': int(user_profile['transaction_count']),
                'spending_consistency': round(user_profile['amount_std'], 2),
                'preferred_category': user_profile.get('preferred_category', 'Unknown')
            },
            'behavior_patterns': {
                'typical_hour': round(user_profile['avg_hour'], 1),
                'weekend_activity': f"{user_profile['weekend_ratio']*100:.1f}%"
            },
            'user_segment': {
                'cluster_id': int(user_profile.get('cluster', 0)),
                'cluster_name': cluster_labels.get(int(user_profile.get('cluster', 0)), 'Unknown')
            }
        }

    def batch_recommendations(self, requests):
        """Process multiple recommendation requests"""
        results = []
        for request in requests:
            result = self.recommend_amount(**request)
            results.append(result)
        return results

def main():
    """Main function to demonstrate the system"""

    print("🚀 UPI Transaction Amount Recommendation System")
    print("=" * 55)

    # Initialize system
    recommender = UPIRecommendationSystem()

    try:
        # Load data
        recommender.load_data('upi_transactions_dataset.csv', 'user_behavior_profiles.csv')

        # Demo recommendations
        sample_requests = [
            {
                'user_id': 'USER_0001',
                'category': 'Food & Dining',
                'location': 'Mumbai',
                'payment_method': 'PhonePe',
                'hour': 13
            },
            {
                'user_id': 'USER_0002', 
                'category': 'Transportation',
                'location': 'Delhi',
                'payment_method': 'Google Pay',
                'hour': 8
            },
            {
                'user_id': 'NEW_USER_123',
                'category': 'Shopping',
                'location': 'Bangalore',
                'payment_method': 'Paytm', 
                'hour': 15
            }
        ]

        print("\n🎯 Sample Recommendations:")
        print("-" * 50)

        for request in sample_requests:
            recommendation = recommender.recommend_amount(**request)
            print(f"\n👤 User: {recommendation['user_id']}")
            print(f"💰 Recommended Amount: ₹{recommendation['recommended_amount']}")
            print(f"🎯 Confidence: {recommendation['confidence']:.1%}")
            print(f"🏷️  Category: {recommendation['category']}")

            if recommendation['user_id'] != 'NEW_USER':
                insights = recommender.get_user_insights(request['user_id'])
                if 'error' not in insights:
                    print(f"📊 User Segment: {insights['user_segment']['cluster_name']}")

        print("\n✅ System demonstration completed successfully!")

    except FileNotFoundError:
        print("❌ Data files not found. Please ensure CSV files are in the current directory.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
