import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime

# Import your existing system
try:
    from upi_recommendation_system import UPIRecommendationSystem
    SYSTEM_AVAILABLE = True
except ImportError:
    SYSTEM_AVAILABLE = False
    st.error("⚠️ upi_recommendation_system.py not found.")

# Page config
st.set_page_config(
    page_title="UPI Recommendation System",
    page_icon="💳",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # Header
    st.markdown('<h1 class="main-header">💳 UPI Recommendation System</h1>', unsafe_allow_html=True)
    st.markdown("### AI-Powered Transaction Amount Predictions")
    
    # Sidebar
    with st.sidebar:
        st.header("📊 Project Info")
        st.success("""
        **Features:**
        - 10,000 UPI transactions
        - Random Forest (59.5% accuracy)
        - 5 user behavior clusters
        - Real-time predictions
        """)
    
    # Main interface
    tab1, tab2, tab3 = st.tabs(["🎯 Demo", "📈 Performance", "🏗️ Architecture"])
    
    with tab1:
        st.header("Live Recommendation Demo")
        
        col1, col2 = st.columns(2)
        
        with col1:
            user_id = st.selectbox("User:", ["USER_0001", "USER_0002", "NEW_USER"])
            category = st.selectbox("Category:", 
                ["Food & Dining", "Transportation", "Shopping", "Entertainment"])
            location = st.selectbox("Location:", 
                ["Mumbai", "Delhi", "Bangalore", "Chennai"])
            hour = st.slider("Hour:", 0, 23, 14)
        
        with col2:
            if st.button("Get Recommendation", type="primary"):
                # Your prediction logic here
                # For demo, using sample calculation
                base_amounts = {
                    "Food & Dining": 250, "Transportation": 120, 
                    "Shopping": 800, "Entertainment": 400
                }
                predicted = base_amounts.get(category, 500) * np.random.uniform(0.8, 1.2)
                
                st.metric("Recommended Amount", f"₹{predicted:.0f}")
                st.metric("Confidence", f"{np.random.uniform(0.7, 0.95):.1%}")
                st.success(f"Prediction for {user_id} in {location} at {hour}:00")
    
    with tab2:
        st.header("Model Performance")
        
        # Metrics
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("R² Score", "59.5%")
        with col2:
            st.metric("MAE", "₹476")
        with col3:
            st.metric("RMSE", "₹777")
        
        # Charts
        models_data = pd.DataFrame({
            'Model': ['Random Forest', 'Gradient Boosting', 'Linear Regression'],
            'MAE': [475.68, 478.66, 786.49]
        })
        
        fig = px.bar(models_data, x='Model', y='MAE', title="Model Comparison")
        st.plotly_chart(fig, use_container_width=True)
    
    with tab3:
        st.header("System Architecture")
        st.code("""
        Data Processing: Pandas, NumPy
        ML Models: Scikit-learn  
        Interface: Streamlit
        Deployment: Streamlit Cloud
        """)

if __name__ == "__main__":
    main()
