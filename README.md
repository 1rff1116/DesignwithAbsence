# Design with Absence: London Air Quality & Data Missingness Visualizer

A critical urban data visualization platform mapping London air pollution alongside spatial sensor blind spots, Missing Not At Random (MNAR) patterns, and socio-economic deprivation.

---

## 🌟 Overview

Standard environmental maps often present continuous, interpolated color surfaces that create an illusion of total coverage. **Design with Absence** renders both what is measured and what remains unmeasured—exposing the uneven spatial distribution of physical air quality monitoring stations across London's 33 boroughs.

By interfacing historical London Air Quality Network (LAQN) sensor data with the UK Index of Multiple Deprivation (IMD), this tool highlights data blind spots and examines how environmental monitoring infrastructure intersects with socio-spatial inequality.

---

## ✨ Key Features

- **Split Curtain Dual Map**: Compare interpolated borough-level pollutant models against the dark reality of physical monitoring voids and sensor locations side-by-side.
- **MNAR & Uncertainty Analytics**: Categorize boroughs into monitored vs. unmonitored dark zones, uncovering data missingness that is Missing Not At Random.
- **Socio-Economic Correlation**: Interactive scatter plots and matrix clustering connecting IMD deprivation deciles to active sensor counts.
- **AI Critical Insights**: Gemini-powered critical data analysis contextualizing spatial sampling bias and urban data ethics.
- **Citizen Witness Marks**: Counter-mapping tool allowing users to place community observation marks on unmonitored zones.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Mapping**: Leaflet, CartoDB Voyager & Dark Matter Tiles, GeoJSON
- **Charts & Math**: Recharts, Simple-Statistics
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Deployment**: Vercel / Node.js Serverless API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm / pnpm / yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/1rff1116/DesignwithAbsence.git
   cd DesignwithAbsence
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` (or `http://localhost:5173`) in your browser.

---

## 📊 Data Sources

- **LAQN (London Air Quality Network)**: Imperial College London air quality station readings ($\text{NO}_2, \text{PM}_{2.5}, \text{PM}_{10}, \text{O}_3$).
- **MHCLG**: UK Index of Multiple Deprivation (IMD 2019).
- **ONS & GLA**: Greater London Authority borough boundaries and demographic statistics.

---

## 📄 License

Distributed under the MIT License.
