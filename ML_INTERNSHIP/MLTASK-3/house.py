import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

# Load the dataset
file_path = "house_prices.csv"
data = pd.read_csv(file_path)

# Display the first few rows of the dataset to understand its structure
print(data.head())

# Check for missing values and handle them (e.g., drop or fill)
if data.isnull().sum().any():
    data = data.dropna()  # Example: dropping rows with missing values

# Define features and target
target_column = "Price"  # Adjust this if the target column is named differently
if target_column not in data.columns:
    print(f"Error: '{target_column}' column not found in dataset!")
else:
    X = data.drop(columns=[target_column])
    y = data[target_column]

    # Convert categorical variables into dummy/indicator variables
    X = pd.get_dummies(X, drop_first=True)

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train a Random Forest Regressor model
    model = RandomForestRegressor(random_state=42)
    model.fit(X_train, y_train)

    # Make predictions
    y_pred = model.predict(X_test)

    # Evaluate the model
    mse = mean_squared_error(y_test, y_pred)
    print(f"Mean Squared Error: {mse}")

    # Optional: Save the trained model
    import joblib
    joblib.dump(model, "house_price_model.pkl")
    print("Model saved as 'house_price_model.pkl'")
