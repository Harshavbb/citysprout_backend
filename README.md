# CitySprout Backend

REST API for **CitySprout**, a community urban agriculture platform. Users upload a photo of their balcony, terrace, backyard or windowsill, describe their growing conditions, and get ranked crop recommendations with transparent, explainable scoring.

**Frontend repo:** [CitySprout_pro](https://github.com/Harshavbb/CitySprout_pro) · **Live demo:** [city-sprout-pro.vercel.app](https://city-sprout-pro.vercel.app/)

---

## Features

- **JWT authentication**: signup, login, and protected profile endpoints with bcrypt password hashing and 7-day tokens
- **AI garden analysis**: Gemini Vision identifies the space type, visible features, constraints, suitable growing methods and estimated area from an uploaded image
- **Explainable crop recommendations**: a weighted scoring engine ranks crops across seven factors and reports confidence and evidence coverage instead of hiding missing data
- **Analysis history**: every analysis is saved per user and can be listed or deleted
- **Image uploads**: validated uploads (JPG, PNG, WEBP, max 5 MB)
- **Consultation services**: a catalogue of paid urban-farming consultation offerings

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES modules) |
| Framework | Express 5 |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens, bcryptjs |
| AI | Google Gemini (`gemini-2.5-flash` by default) via `@google/genai` |
| Uploads | Multer |

## How the Recommendation Pipeline Works

```
Garden photo ──► Gemini Vision ──► space type, growing methods, constraints
                                          │
User inputs (sunlight, water, area,       ▼
maintenance, season) ───────────► Scoring engine ──► ranked crops + reasons
                                          │
                                          ▼
                                  Saved to MongoDB (Analysis)
```

1. **Vision step.** Gemini describes only what is visible in the image. It never guesses sunlight hours or water availability and does not recommend crops. Output is constrained to a strict JSON schema.
2. **Scoring step.** Crops from the knowledge base are filtered by space type, then scored on seven weighted factors:

| Factor | Weight |
|---|---|
| Sunlight | 25 |
| Water access | 15 |
| Growing method | 15 |
| Season | 15 |
| Available area | 10 |
| Growing space | 10 |
| Maintenance | 10 |

3. **Honest uncertainty.** Factors without reliable crop data are marked *unassessed* rather than counted as failures. Each result includes `matchScore`, `assessedMatch`, `evidenceCoverage`, a confidence level, a per-factor `scoreBreakdown`, and plain-language `reasons`. Crops are ranked by evidence coverage first, then match score, and the top 5 are returned.

The current knowledge base covers 9 crops: tomato, chilli, spinach, mint, coriander, lettuce, okra, microgreens and basil.

## Project Structure

```
src/
├── app.js                  # Express app, middleware and route mounting
├── server.js               # Entry point: DB connection and server start
├── config/
│   ├── db.js               # MongoDB connection
│   └── gemini.js           # Gemini client
├── controllers/            # Request handlers (auth, farming, vision)
├── data/
│   └── cropKnowledgeBase.js
├── middleware/             # JWT guard, upload handling
├── models/                 # User and Analysis schemas
├── routes/                 # auth, farming, consultations
├── services/
│   ├── visionService.js          # Gemini image analysis
│   └── recommendationService.js  # Scoring engine
└── utils/                  # Token generation, helpers
```

## Getting Started

### Prerequisites

- Node.js 20.6 or later (uses the built-in `--env-file` flag)
- A MongoDB instance (local or Atlas)
- A [Gemini API key](https://aistudio.google.com/apikey)

### Installation

```bash
git clone https://github.com/Harshavbb/citysprout_backend.git
cd citysprout_backend
npm install
npm install @google/genai
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/citysprout
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash   # optional
```

### Run

```bash
npm run dev     # development, with nodemon
npm start       # production
```

The server starts at `http://localhost:5000`.

## API Reference

### Auth: `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Register a new user |
| POST | `/login` | No | Log in and receive a JWT |
| GET | `/user/profile` | Bearer | Get the current user's profile |
| PUT | `/user/profile/update` | Bearer | Update name, contact or address |

Protected routes expect `Authorization: Bearer <token>`.

### Farming: `/api/farming`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/analyze` | Full pipeline: image analysis, crop recommendations, and save (multipart) |
| POST | `/vision` | Image analysis only (multipart) |
| POST | `/upload` | Upload an image and get its URL (multipart) |
| GET | `/history/:userId` | List a user's saved analyses, newest first |
| DELETE | `/history/:analysisId` | Delete a saved analysis |
| POST | `/detect` | Deprecated, returns `410 Gone`. Use `/analyze` |

**`POST /api/farming/analyze`** (multipart/form-data)

| Field | Type | Required | Notes |
|---|---|---|---|
| `file` | image | Yes | JPG, PNG or WEBP, max 5 MB |
| `user_id` | string | Yes | Valid MongoDB user ID |
| `sunlight` | number | Yes | Hours per day, 0 to 24 |
| `water_availability` | string | Yes | `reliable`, `intermittent` or `limited` |
| `available_area` | number | Yes | Square feet, greater than 0 |
| `maintenance` | string | No | `low` (default), `medium` or `high` |
| `season` | string | No | `rabi`, `kharif`, `zaid` or `perennial` |

Example response (abridged):

```json
{
  "success": true,
  "message": "Garden analyzed successfully",
  "analysisId": "665f...",
  "vision": { "spaceType": "balcony", "growingMethods": ["container gardening"], "imageQuality": "good" },
  "recommendations": {
    "primaryRecommendation": "container gardening",
    "topCrop": { "crop": "Tomato", "matchScore": 40, "evidenceCoverage": 50, "recommendationConfidence": "low" },
    "suitableCrops": [],
    "warnings": []
  }
}
```

### Consultations: `/api/consultations`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/services` | List available consultation services |

## Data Models

- **User**: `name`, `email` (unique), `password` (hashed), `role`, `contact`, `address`
- **Analysis**: `userId`, input conditions, `visionAnalysis`, `topCrop`, `suitableCrops[]`, warnings and scoring notes, with timestamps

## Roadmap

- Expand the crop knowledge base and fill in missing sunlight, water and season data
- Add centralized error handling and request validation
- Add automated tests
- Require authentication on the farming endpoints

## Author

**Harshavardhan Bandarupalli**
[GitHub](https://github.com/Harshavbb) · [LinkedIn](https://linkedin.com/in/harshavardhan-bandarupalli-a5641b247)
