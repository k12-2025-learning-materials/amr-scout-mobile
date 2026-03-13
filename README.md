# AMR-Scout Mobile App

A React Native (Expo) mobile application for mapping, predicting, and teaching about Antimicrobial Resistance (AMR) in South Dakota waterways.

## Features

### Map Screen
- Interactive map of Rapid City, SD sampling sites
- Color-coded markers showing AMR risk levels (Low/Medium/High/Critical)
- Tap any site to view detailed sample data, ARG detections, and environmental parameters
- 10 real-world sampling locations (parks, creeks, urban areas)

### Predict Screen
- Enter environmental sample parameters:
  - Bacterial Count (CFU/mL), pH, Temperature, Turbidity, Dissolved Oxygen
  - Sample Type (Water/Soil/Sediment)
- **AMR Risk Prediction**: Get risk level with confidence score and probability breakdown
- **ARG Gene Prediction**: See which of 7 resistance genes are likely present
- Works in demo mode (mock predictions) when the API is unavailable

### Learn Screen
- 10-question gamified quiz about AMR, ARGs, and water quality
- Score tracking with progress bar
- Badge system: Beginner Scientist, AMR Explorer, Resistance Fighter, AMR Champion
- Rotating fun facts carousel about antimicrobial resistance

### About Screen
- Project overview and science fair context
- System architecture (mobile app, web DST, AI model)
- Data sources and references
- Key metrics tracked

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- [Expo Go](https://expo.dev/go) app on your phone (for testing)
- (Optional) Python AI model running for live predictions

## Setup

```bash
cd amr-scout-mobile
npm install
```

## Running the App

```bash
# Start the development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run in web browser
npx expo start --web
```

Scan the QR code with Expo Go (Android) or Camera app (iOS) to run on your phone.

## Connecting to the AI Model

1. Start the Python API: `cd ../amr-prediction-model && python api/app.py`
2. The API runs on `http://localhost:5000`
3. The app automatically falls back to mock predictions if the API is unavailable

For testing on a physical device, update the `API_BASE` in `services/api.ts` to your computer's local IP address (e.g., `http://192.168.1.100:5000`).

## Tech Stack

- **React Native** with **Expo** (SDK 52)
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **Custom components** for risk badges and quiz cards

## Project Structure

```
amr-scout-mobile/
├── app/
│   ├── _layout.tsx              # Root layout
│   └── (tabs)/
│       ├── _layout.tsx          # Tab navigation
│       ├── index.tsx            # Redirect to map
│       ├── map.tsx              # AMR map screen
│       ├── predict.tsx          # Prediction screen
│       ├── learn.tsx            # Gamified learning
│       └── about.tsx            # About screen
├── components/
│   ├── RiskBadge.tsx            # Risk level badge
│   └── QuizCard.tsx             # Quiz question card
├── constants/
│   ├── theme.ts                 # Colors and theme
│   ├── sampleData.ts            # Rapid City sample points
│   └── quizData.ts              # Quiz questions and facts
├── services/
│   └── api.ts                   # API client with mock fallback
├── app.json                     # Expo configuration
└── README.md
```
