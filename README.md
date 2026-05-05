# Manikan MVP

**A comprehensive platform for real-time 3D body avatar generation, virtual try-on, and B2B fashion e-commerce integration.**

Manikan MVP is a full-stack platform that transforms five basic anthropometric measurements (height, weight, chest, waist, and hips) into a physically accurate 3D human mesh in under 5 seconds. This repository encompasses both the robust AI-driven 3D generation engine and a complete suite of consumer and business-facing frontend interfaces.

## 🌟 Key Features

*   **Real-Time 3D Avatar Engine**: Differentiable optimization over the SMPL parametric body model using PyTorch, resolving shape parameters to accurately match target proportions.
*   **Consumer Storefront**: A modern e-commerce experience featuring dynamic product pages, size recommendations, and interactive 3D virtual try-ons.
*   **B2B Dashboard & Marketing**: Dedicated business landing pages, pricing models, event styling hubs, and wardrobe management dashboards for enterprise clients.
*   **Seamless Integration**: A modular React + Three.js frontend communicating with a high-performance FastAPI backend.

---

## 🏗️ Project Structure

The repository is organized into a modular full-stack architecture:

```text
manican-mvp/
├── backend/                  # AI & API Engine
│   ├── main.py               # FastAPI server & SMPL optimization endpoints
│   ├── requirements.txt      # Python dependencies
│   ├── models/smpl/          # SMPL model directory (requires manual setup)
│   └── tools/                # Utility scripts (e.g., SMPL pickle cleaners)
│
├── frontend/                 # Web Platform (B2C & B2B)
│   ├── src/
│   │   ├── components/       # Reusable UI (ManikanWidget, ControlPanel, etc.)
│   │   ├── pages/            # Core views (StorePage, ProductDetailPage, etc.)
│   │   │   └── manikan/      # B2B & specialized marketing views
│   │   ├── App.jsx           # Main application routing
│   │   └── main.jsx          # React entry point
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Build configuration
│
└── docs/                     # Documentation and assets
```

---

## 🚀 Setup & Installation

### Prerequisites
*   **Python 3.10+**
*   **Node.js 18+**
*   **SMPL Models**: Obtain `SMPL_MALE.pkl` and `SMPL_FEMALE.pkl` from [smpl.is.tue.mpg.de](https://smpl.is.tue.mpg.de/)

### 1. Backend Initialization

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Prepare the SMPL Models:**
Place your `.pkl` files inside `backend/models/smpl/`, then run the cleaner tool:
```bash
python tools/clean_smpl_pkl.py
```

**Start the API Server:**
```bash
python -m uvicorn main:app --reload
```
*The API will be available at `http://localhost:8000`.*

### 2. Frontend Initialization

```bash
cd frontend
npm install
npm run dev
```
*The Web App will be available at `http://localhost:5173`.*

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Three.js, React Three Fiber |
| **Backend** | FastAPI, PyTorch, smplx, trimesh |
| **3D Modeling** | SMPL (Skinned Multi-Person Linear Model) |
| **Data Transport**| REST API, Binary GLB Streaming |

---

## 📚 Core API Reference

### `POST /generate-avatar`
Generates a customized 3D body mesh.

**Payload:**
```json
{
  "sex": "male",
  "height_cm": 175,
  "weight_kg": 75,
  "chest_cm": 96,
  "waist_cm": 82,
  "hips_cm": 96
}
```
**Response:** Binary `.glb` file (`application/octet-stream`) ready for Three.js rendering.

---

## 📄 Licensing & Credits

*   **Platform Code**: Manikan MVP proprietary source code.
*   **SMPL Models**: Subject to the strict [SMPL Model License](https://smpl.is.tue.mpg.de/modellicense) for non-commercial/academic use, or custom commercial licensing.
*   **Academic References**:
    *   Loper, M., et al. (2015). *SMPL: A Skinned Multi-Person Linear Model.*
    *   Bojanic, D. (2023). *SMPL-Anthropometry.*
