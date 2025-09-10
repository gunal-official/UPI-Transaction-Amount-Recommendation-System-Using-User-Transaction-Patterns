from upi_recommendation_system import UPIRecommendationSystem
import pandas as pd

def test_system():
    print("🧪 Testing UPI Recommendation System...")
    
    # Initialize system
    recommender = UPIRecommendationSystem()
    
    try:
        # Load data
        recommender.load_data('upi_transactions_dataset.csv', 'user_behavior_profiles.csv')
        print("✅ Data loaded successfully")
        
        # Test recommendation
        result = recommender.recommend_amount(
            user_id='USER_0001',
            category='Food & Dining',
            location='Mumbai'
        )
        print(f"✅ Recommendation: ₹{result['recommended_amount']}")
        
        # Test user insights
        insights = recommender.get_user_insights('USER_0001')
        print(f"✅ User insights: {insights['user_segment']['cluster_name']}")
        
        print("\n🎉 All tests passed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_system()
