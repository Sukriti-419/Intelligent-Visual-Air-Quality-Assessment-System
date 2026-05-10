# Intelligent-Visual-Air-Quality-Assessment-System
# Intelligent Visual Air Quality Assessment System

An AI-powered deep learning framework for estimating **Air Quality Index (AQI)** levels from outdoor images using transfer learning and computer vision techniques. This project classifies air pollution images into six AQI categories and provides an easy-to-use web interface for real-time prediction and visualization.

## 📌 Project Overview

Traditional air quality monitoring systems rely heavily on expensive sensor infrastructure with limited spatial coverage. This project proposes a low-cost alternative using image-based AQI classification through Convolutional Neural Networks (CNNs).

The system leverages pretrained deep learning models such as:

* VGG16
* DenseNet121
* EfficientNetB0
* MobileNetV2

The trained model predicts AQI categories directly from outdoor images captured using cameras or smartphones.

---

## 🚀 Features

* Image-based AQI prediction
* Transfer learning using pretrained CNN models
* Six-class AQI classification
* Real-time prediction through Flask web app
* Grad-CAM explainability visualization
* User-friendly interface
* Model comparison and evaluation
* Supports deployment on low-cost devices

---

## 🌫️ AQI Classes

The dataset contains six AQI categories:

1. Good
2. Moderate
3. Unhealthy for Sensitive Groups
4. Unhealthy
5. Very Unhealthy
6. Severe

---

## 🧠 Models Used

| Model          | Purpose                                  |
| -------------- | ---------------------------------------- |
| VGG16          | Feature extraction and classification    |
| DenseNet121    | Dense connectivity for improved learning |
| EfficientNetB0 | Lightweight and efficient architecture   |
| MobileNetV2    | Mobile-friendly lightweight CNN          |

---

## 📂 Dataset

The project uses the **Air Pollution Image Dataset from India and Nepal**, containing outdoor environmental images categorized into AQI classes. ([GitHub][1])

### Dataset Characteristics

* 12,240 outdoor images
* Real-world pollution conditions
* Multiple weather and lighting scenarios
* Six AQI categories

---

## 🛠️ Tech Stack

### Programming Language

* Python

### Libraries & Frameworks

* TensorFlow
* Keras
* OpenCV
* NumPy
* Pandas
* Matplotlib
* Scikit-learn
* Flask

---

## 📁 Project Structure

```bash
Intelligent-Visual-Air-Quality-Assessment-System/
│
├── dataset/
├── models/
├── notebooks/
├── static/
├── templates/
├── app.py
├── inference_pipeline.py
├── explainability.py
├── clinical_rules.py
├── recommendations.py
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/Sukriti-419/Intelligent-Visual-Air-Quality-Assessment-System.git
cd Intelligent-Visual-Air-Quality-Assessment-System
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### macOS/Linux

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Project

### Start Flask Application

```bash
python app.py
```

Open your browser and visit:

```bash
http://127.0.0.1:5000
```

---

## 📊 Model Workflow

1. Upload outdoor image
2. Image preprocessing and resizing
3. Feature extraction using pretrained CNN
4. AQI classification
5. Display predicted AQI category
6. Generate Grad-CAM visualization for explainability

---

## 📈 Evaluation Metrics

The models were evaluated using:

* Accuracy
* Precision
* Recall
* F1-Score
* Confusion Matrix

---

## 🔍 Explainable AI

The project integrates **Grad-CAM** to visualize which image regions contributed most to the AQI prediction, improving transparency and interpretability.

---

## 🌐 Future Scope

* Integration with IoT air quality sensors
* Real-time city-wide AQI monitoring
* Mobile application deployment
* Satellite image integration
* Hybrid sensor + vision-based AQI prediction
* Edge AI deployment for smart cities

---

## 📸 Sample Output

* AQI prediction result
* Confidence score
* Grad-CAM heatmap visualization

---

## 🤝 Contributors

* Sukriti
* Team Members

---

## 📚 References

* Air Pollution Image Dataset from India and Nepal ([GitHub][1])
* Research on AI-based air quality assessment ([arXiv][2])

---

## 📜 License

This project is intended for educational and research purposes.

---

## ⭐ GitHub Repository

[Intelligent Visual Air Quality Assessment System Repository](https://github.com/Sukriti-419/Intelligent-Visual-Air-Quality-Assessment-System?utm_source=chatgpt.com)

[1]: https://github.com/CoDIS-Lab/AQNet?utm_source=chatgpt.com "GitHub - CoDIS-Lab/AQNet"
[2]: https://arxiv.org/abs/2311.03920?utm_source=chatgpt.com "An Intelligent Edge-Deployable Indoor Air Quality Monitoring and Activity Recognition Approach"
