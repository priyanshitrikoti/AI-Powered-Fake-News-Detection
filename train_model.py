from model import FakeNewsDetector, create_sample_dataset
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
from sklearn.model_selection import train_test_split
import os

if __name__ == "__main__":
    print("🚀 Training Fake News Detection Model...")
    
    # 1. Dataset load karo
    df = create_sample_dataset()
    
    # 2. Data ko split karo taaki hum Metrics nikal sakein (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        df['text'], df['label'], test_size=0.2, random_state=42
    )
    
    detector = FakeNewsDetector()
    
    # Train only on training set
    detector.train(X_train, y_train)
    
    print("✅ Model training completed!")
    
    # --- CONFUSION MATRIX & EVALUATION SECTION ---
    # --- EVALUATION SECTION UPDATE ---
    # --- EVALUATION SECTION UPDATE ---
    print("\n📊 Generating Model Evaluation Metrics...")

    # Labels ko strings mein badlo (Fix: 0=REAL, 1=FAKE as per common datasets)
    y_test_mapped = y_test.map({0: 'REAL', 1: 'FAKE'}).fillna(y_test).astype(str) 

    # Predictions nikalo
    y_pred = [detector.predict(t)['prediction'] for t in X_test]

    # Accuracy variable define karo (Taaki Error na aaye)
    acc = accuracy_score(y_test_mapped, y_pred)
    print(f"⭐ Overall Accuracy: {acc*100:.2f}%")
    
    print("\n📝 Classification Report:")
    print(classification_report(y_test_mapped, y_pred))

    # Confusion Matrix
    cm = confusion_matrix(y_test_mapped, y_pred, labels=['FAKE', 'REAL'])
    
    # Plotting Heatmap
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Purples', 
                xticklabels=['FAKE', 'REAL'], yticklabels=['FAKE', 'REAL'])
    
    # Ab 'acc' yahan error nahi dega
    plt.title(f'Confusion Matrix (Accuracy: {acc*100:.2f}%)')
    plt.xlabel('Predicted by AI')
    plt.ylabel('Actual Label')
    
    # Static folder mein save karna (Check if folder exists)
    if not os.path.exists('static'):
        os.makedirs('static')
    
    plt.savefig('static/confusion_matrix.png')
    print("🖼️ Confusion Matrix image saved as 'static/confusion_matrix.png'")
    
    # --- TEST PREDICTIONS ---
    print("\n🔍 Custom Test Predictions:")
    test_texts = [
        "The economy is booming with record low unemployment.",
        "SHOCKING: Bill Gates planning to microchip everyone!!!",
        "humans have 5 legs"
    ]
    
    for text in test_texts:
        result = detector.predict(text)
        print(f"Text: {text[:50]}...")
        print(f"Prediction: {result['prediction']} ({result['confidence']}% confidence)")
        print("-" * 50)