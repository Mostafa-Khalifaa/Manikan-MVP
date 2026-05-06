# Manikan MVP

**A Comprehensive Platform for Real-Time 3D Body Avatar Generation, Virtual Try-On, and B2B Fashion E-Commerce Integration.**

Manikan MVP is a full-stack SaaS platform designed to bridge the gap between physical and digital fashion. It transforms five basic anthropometric measurements (height, weight, chest, waist, and hips) into a physically accurate 3D human mesh in under 5 seconds. This repository encompasses both the robust AI-driven 3D generation backend engine and a complete suite of consumer and business-facing frontend interfaces.

## Core Features

*   **Real-Time 3D Avatar Engine**: Differentiable optimization over the SMPL parametric body model using PyTorch, resolving shape parameters through gradient descent to accurately match target anatomical proportions.
*   **Consumer Storefront (B2C)**: A modern, high-performance e-commerce experience featuring dynamic product catalogs, AI size recommendations, and interactive 3D virtual try-ons rendered natively in the browser.
*   **Business Dashboard & Marketing (B2B)**: Dedicated business landing pages, pricing models, event styling hubs, and wardrobe management dashboards for enterprise clients.
*   **Internationalization (i18n)**: Full bidirectional support for English (LTR) and Arabic (RTL) across all marketing and product interfaces, utilizing an extensible localization context.
*   **Seamless Integration Architecture**: A modular React and Three.js frontend communicating asynchronously with a highly scalable FastAPI Python backend.

---

## Architecture Overview

The system is separated into two primary micro-services to ensure scalability and separation of concerns.

### Backend (AI & API Engine)
Built on FastAPI and PyTorch, the backend handles computationally intensive tasks. It exposes RESTful endpoints that receive user measurements. The engine leverages the `smplx` library to initialize a base mesh, calculates a loss function comparing the current mesh dimensions against the requested measurements, and uses backpropagation to iteratively deform the mesh. The final geometry is serialized and streamed back as a `.glb` binary file using `trimesh`.

### Frontend (Web Platform)
Built on React and Vite, the frontend application is styled with Tailwind CSS to provide a highly polished, responsive, and glassmorphic UI. 3D rendering is handled via `@react-three/fiber` and `@react-three/drei`, which interpret the `.glb` files streamed from the backend, applying professional studio lighting and camera controls directly within the user's browser.

---

## Project Structure

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
│   │   ├── i18n/             # Localization dictionaries (en.js, ar.js)
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

## Setup & Installation

### Prerequisites
*   **Python 3.10+**
*   **Node.js 18+**
*   **SMPL Models**: Obtain `SMPL_MALE.pkl` and `SMPL_FEMALE.pkl` from the official [SMPL project page](https://smpl.is.tue.mpg.de/).

### 1. Backend Initialization

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Prepare the SMPL Models:**
Place your downloaded `.pkl` files inside the `backend/models/smpl/` directory. If the models are in Python 2 pickle format, run the provided cleaner utility:
```bash
python tools/clean_smpl_pkl.py
```

**Start the API Server:**
```bash
python -m uvicorn main:app --reload
```
*The API will be available at `http://localhost:8000`.*

### 2. Frontend Initialization

Open a new terminal window and execute:
```bash
cd frontend
npm install
npm run dev
```
*The Web App will be available at `http://localhost:5173`.*

---

## Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Three.js, React Three Fiber |
| **Backend** | FastAPI, PyTorch, smplx, trimesh |
| **3D Modeling** | SMPL (Skinned Multi-Person Linear Model) |
| **Data Transport**| REST API, Binary GLB Streaming |

---

## Core API Reference

### `POST /generate-avatar`
Generates a customized 3D body mesh based on user-provided anthropometric data.

**Payload Requirements (`application/json`):**
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
**Response:** 
Returns a binary `.glb` file (`application/octet-stream`) ready for immediate 3D rendering.

---

## Licensing & Credits

*   **Platform Source Code**: Manikan MVP proprietary source code. All rights reserved.
*   **SMPL Models**: Subject to the strict [SMPL Model License](https://smpl.is.tue.mpg.de/modellicense) for non-commercial/academic use, or custom commercial licensing agreements via the Max Planck Institute.
*   **Academic References**:
    *   Loper, M., et al. (2015). *SMPL: A Skinned Multi-Person Linear Model.*
    *   Bojanic, D. (2023). *SMPL-Anthropometry.*
