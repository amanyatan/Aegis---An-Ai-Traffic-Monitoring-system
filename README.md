# 🛡️ AEGIS

### Intelligence That Protects Every Road

AEGIS is an AI-powered Traffic Intelligence Platform designed to automate traffic monitoring, violation detection, vehicle identification, and smart city safety operations using Computer Vision, OCR, and Real-Time Analytics.

The platform transforms traditional traffic surveillance into an intelligent ecosystem capable of detecting violations, tracking vehicles, generating digital evidence, and assisting law enforcement agencies with actionable insights.

---

## 🚀 Features

### Traffic Violation Detection

* Helmet Non-Compliance Detection
* Seatbelt Non-Compliance Detection
* Triple Riding Detection
* Wrong-Side Driving Detection
* Illegal Parking Detection
* Stop-Line Violation Detection
* Red-Light Violation Detection

### Vehicle Intelligence

* License Plate Recognition (OCR)
* Vehicle Re-Identification
* Missing Vehicle Tracking
* Last Seen Vehicle Location Detection
* Vehicle Search & History Timeline

### Smart Safety Features

* Accident Detection & Severity Analysis
* Automatic Ambulance Alerts
* Automatic Police Alerts
* Hospital Notification System
* Women's Safe Route Recommendation

### Predictive Intelligence

* Traffic Congestion Forecasting
* Weather-Based Traffic Risk Prediction
* Road Hazard Detection & Alerts
* Real-Time Analytics Dashboard

### Evidence Management

* Automated Evidence Generation
* Timestamped Violation Records
* Annotated Violation Images
* Searchable Violation Database
* Downloadable Reports

---

# 🏗️ System Architecture

```text
Traffic Cameras / CCTV / Drone Feeds
                 │
                 ▼
      Image Preprocessing Layer
                 │
                 ▼
       AI Detection Engine
                 │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
Violation      OCR       Re-ID
Engine       Engine      Engine
      │          │          │
      └──────────┴──────────┘
                 │
                 ▼
      Evidence Generation
                 │
                 ▼
          Supabase Cloud
                 │
                 ▼
         Analytics Dashboard
                 │
                 ▼
     Police & Emergency Alerts
```

---

# 🧠 Tech Stack

## Frontend

* React Native
* Expo
* TypeScript
* Tailwind CSS (NativeWind)
* React Navigation

## Backend

* Supabase
* PostgreSQL
* Supabase Storage
* Supabase Realtime

## Authentication

* Supabase Auth
* Google Login

## AI/ML (Planned Integration)

* YOLOv11
* PaddleOCR
* FastReID
* DeepSORT
* ByteTrack

## Deployment

* Expo Go
* EAS Build

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/aegis.git
cd aegis
```

Install dependencies:

```bash
npm install
```

or

```bash
yarn install
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory.

```env
EXPO_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL

EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

# ▶️ Running the Project

Start the Expo development server:

```bash
npx expo start
```

OR

```bash
npm start
```

After running the command:

* Press **a** → Android Emulator
* Press **i** → iOS Simulator
* Press **w** → Web
* Scan the QR Code using **Expo Go App**

---

# 📱 Running on Physical Device

1. Install Expo Go on your mobile device.
2. Connect phone and PC to the same Wi-Fi network.
3. Run:

```bash
npx expo start
```

4. Scan the generated QR Code.
5. Application will launch instantly.

---

# 📂 Project Structure

```text
src
│
├── app
├── components
├── screens
├── navigation
├── hooks
├── services
├── lib
├── types
├── assets
├── animations
├── constants
└── utils
```

---

# 🔒 Authentication Flow

```text
User
  │
  ▼
Google Login / Email Login
  │
  ▼
Supabase Authentication
  │
  ▼
Dashboard Access
```

---

# 📊 Future Enhancements

* Live CCTV Integration
* AI Model Deployment
* Smart City Integrations
* National Vehicle Registry Integration
* Predictive Accident Prevention
* Edge AI Processing
* Real-Time Emergency Coordination

---

# 🎯 Problem Statement

Automated Photo Identification and Classification for Traffic Violations Using Computer Vision

AEGIS addresses the challenge of manually processing massive traffic surveillance datasets by automating violation detection, vehicle recognition, evidence generation, and intelligent traffic analytics.

---

# 👨‍💻 Team

Developed for Gridlock Hackathon

Project Name: **AEGIS**

Tagline:

> Intelligence That Protects Every Road

---

# 📄 License

This project is developed for educational, research, and hackathon purposes.
