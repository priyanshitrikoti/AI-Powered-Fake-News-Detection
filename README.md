# AI-Powered-Fake-News-Detection
# 🛡️ AI-Powered Fake News Detector

An advanced Machine Learning web application designed to identify and classify news articles as **Real** or **Fake** using Natural Language Processing (NLP).

![Python](https://img.shields.io/badge/Python-3.13-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-Web--Framework-lightgrey?style=for-the-badge&logo=flask)
![Machine Learning](https://img.shields.io/badge/ML-Random%20Forest-green?style=for-the-badge&logo=scikit-learn)

## 🚀 Overview
In an era of rapid digital information, distinguishing between truth and misinformation is critical. This project uses a **Random Forest Classifier** trained on over **100,000+ articles** to detect deceptive patterns in news text with high precision.

### Key Stats:
* **Accuracy:** 94.7%
* **Response Time:** ~45ms
* **Model:** Random Forest (200 Estimators)
* **Vectorization:** TF-IDF

## ✨ Features
- **Live Detection Demo:** Paste any news headline or article for instant analysis.
- **NLP Pipeline:** Automatic text cleaning (Stemming, Stopword removal, and N-grams).
- **Modern UI:** Clean, responsive, and user-friendly interface.
- **Real-time Feedback:** Color-coded badges for easy identification (Red for Fake, Blue/Green for Real).

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Flask (Python)
- **Machine Learning:** Scikit-Learn, Pandas, NumPy, NLTK
- **Model Storage:** Joblib/Pickle

## 📂 Project Structure
```text
Backend_folder/
├── static/               # CSS and JS files
├── templates/            # HTML files (index.html)
├── data/                 # Training datasets (Fake.csv, True.csv)
├── app.py                # Main Flask Application
├── model.py              # ML Model logic
├── model.pkl             # Trained model file
└── requirements.txt      # List of dependencies
