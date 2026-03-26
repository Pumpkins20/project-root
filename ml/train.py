import os

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# 1) Load dataset dari folder root/data
DATA_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "sales_data.csv")
)
df = pd.read_csv(DATA_PATH)

print(f"Dataset shape: {df.shape}")
print(f"Label distribution:\n{df['status'].value_counts()}")

# 2) Feature dan label
FEATURE_COLS = ["jumlah_penjualan", "harga", "diskon"]
X = df[FEATURE_COLS]
y = (df["status"] == "Laris").astype(int)

# 3) Stratified split agar proporsi label terjaga di train/test
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

# 4) Scaling disimpan untuk dipakai ulang saat inference backend
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 5) Random Forest + class_weight balanced untuk data imbalanced
model = RandomForestClassifier(
    n_estimators=100,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1,
)
model.fit(X_train_scaled, y_train)

# 6) Evaluasi
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred, target_names=["Tidak", "Laris"])
cm = confusion_matrix(y_test, y_pred)

print(f"\nAccuracy: {accuracy:.4f}")
print(f"\nClassification Report:\n{report}")
print(f"Confusion Matrix:\n{cm}")

eval_path = os.path.join(os.path.dirname(__file__), "evaluation_report.txt")
with open(eval_path, "w", encoding="utf-8") as file:
    file.write(f"Accuracy: {accuracy:.4f}\n\n")
    file.write("Classification Report:\n")
    file.write(f"{report}\n")
    file.write("Confusion Matrix:\n")
    file.write(f"{cm}\n")

# 7) Simpan model + scaler menjadi satu artifact
model_path = os.path.join(os.path.dirname(__file__), "model.joblib")
joblib.dump({"model": model, "scaler": scaler}, model_path)

print(f"Evaluation report saved to: {eval_path}")
print(f"Model artifact saved to: {model_path}")
