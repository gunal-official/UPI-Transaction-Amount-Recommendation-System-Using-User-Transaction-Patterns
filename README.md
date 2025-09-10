# UPI Transaction Amount Recommendation System

## 📋 Project Overview

A comprehensive machine learning system that recommends optimal transaction amounts for UPI payments based on user behavior patterns, transaction categories, and contextual factors.

## 🎯 Key Features

- **Personalized Recommendations**: Amount suggestions based on individual user spending patterns
- **Context-Aware**: Considers time, location, category, and payment method
- **User Segmentation**: Clusters users into spending behavior groups
- **Real-time Predictions**: Fast inference suitable for production environments
- **New User Handling**: Category-based recommendations for users without history

## 📊 Dataset

- **Size**: 10,000 synthetic UPI transactions
- **Users**: 1,000 unique users
- **Categories**: 10 transaction types (Food, Transportation, Shopping, etc.)
- **Time Period**: Full year of transaction data
- **Features**: 15+ engineered features for ML models

## 🤖 Machine Learning Models

| Model | MAE (₹) | RMSE (₹) | R² Score |
|-------|---------|----------|----------|
| **Random Forest** | **475.68** | **776.90** | **0.595** |
| Gradient Boosting | 478.66 | 761.18 | 0.611 |
| Linear Regression | 786.49 | 1142.29 | 0.124 |

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd upi-recommendation-system

# Install dependencies
pip install -r requirements.txt
```

### Usage

```python
from upi_recommendation_system import UPIRecommendationSystem

# Initialize the system
recommender = UPIRecommendationSystem()
recommender.load_data('upi_transactions_dataset.csv', 'user_behavior_profiles.csv')

# Get recommendation
recommendation = recommender.recommend_amount(
    user_id='USER_0001',
    category='Food & Dining',
    location='Mumbai',
    payment_method='PhonePe',
    hour=13
)

print(f"Recommended Amount: ₹{recommendation['recommended_amount']}")
```

### Run Demo

```bash
python upi_recommendation_system.py
```

## 📁 Project Structure

```
upi-recommendation-system/
├── upi_recommendation_system.py      # Main application
├── upi_transactions_dataset.csv      # Transaction data
├── user_behavior_profiles.csv        # User analysis
├── feature_importance_analysis.csv   # ML insights
├── project_info.json                # Project metadata
├── api_examples.json                 # API samples
├── requirements.txt                  # Dependencies
└── README.md                         # Documentation
```

## 🎯 User Clusters

| Cluster | Description | Avg Amount | Users |
|---------|-------------|------------|-------|
| 0 | Conservative Spenders | ₹829 | 162 |
| 1 | High-Value Users | ₹1,692 | 146 |
| 2 | Frequent Small Transactions | ₹657 | 227 |
| 3 | Active Users | ₹986 | 267 |
| 4 | Balanced Spenders | ₹1,208 | 198 |

## 🔍 Feature Importance

Top factors influencing recommendations:
1. **Transaction Category** (53.6%)
2. **Amount Variability** (15.8%)
3. **Day of Month** (3.7%)
4. **User History Length** (3.5%)
5. **Median Amount** (3.3%)

## 📈 API Endpoints

### Recommendation
```http
POST /recommend
{
  "user_id": "USER_0001",
  "category": "Food & Dining",
  "location": "Mumbai",
  "payment_method": "PhonePe",
  "hour": 13
}
```

### User Insights
```http
GET /user-insights/{user_id}
```

## 🛠️ Technical Details

- **Algorithm**: Random Forest Regression
- **Features**: 15 engineered features
- **Performance**: 59.5% variance explained
- **Speed**: Sub-second inference
- **Scalability**: Handles 1000+ users efficiently

## 📊 Business Impact

- **Improved UX**: Reduces amount entry friction
- **Increased Engagement**: Personalized experience
- **Fraud Prevention**: Anomaly detection capabilities
- **Data Insights**: User behavior analytics

## 🔮 Future Enhancements

- [ ] Deep learning models for complex patterns
- [ ] Real-time model updates
- [ ] A/B testing framework
- [ ] Mobile app integration
- [ ] Advanced fraud detection

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the fintech community**
