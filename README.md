# Design with Absence: London Air Quality & Data Missingness Visualizer

An interactive spatial data visualization project mapping London air pollution alongside physical monitoring blind spots, Missing Not At Random (MNAR) patterns, and socio-economic deprivation.

## Overview

Environmental mapping interfaces often present continuous, interpolated surfaces that project an impression of complete spatial coverage. **Design with Absence** visualizes both measured concentrations and unmeasured voids—exposing the uneven spatial distribution of physical air quality monitoring stations across London's 33 boroughs.

By combining historical London Air Quality Network (LAQN) sensor data with the UK Index of Multiple Deprivation (IMD), this research prototype examines how environmental monitoring infrastructure intersects with socio-spatial equity.

## Features

- **Split-View Map**: Interactive comparison between borough-level pollutant models and physical sensor monitoring locations.
- **Uncertainty & MNAR Analytics**: Categorization of boroughs into monitored vs. unmonitored zones to highlight data missingness.
- **Socio-Economic Analysis**: Scatter plots and matrix clustering comparing IMD deprivation deciles against active monitoring density.
- **Critical Synthesis Modal**: Contextualized scholarly analysis on spatial sampling bias, data ethics, and urban sensing.
- **Community Witness Marking**: Counter-mapping tool allowing users to mark localized observations in unmonitored zones.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Mapping**: Leaflet, CartoDB Basemaps, GeoJSON
- **Data Visualization**: Recharts, Simple-Statistics

## Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/1rff1116/DesignwithAbsence.git
   cd DesignwithAbsence
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

## Data Sources

- **LAQN (London Air Quality Network)**: Air quality station readings ($\text{NO}_2, \text{PM}_{2.5}, \text{PM}_{10}, \text{O}_3$).
- **MHCLG**: UK Index of Multiple Deprivation (IMD 2019).
- **ONS & GLA**: Greater London Authority borough boundaries and demographic statistics.

## License

MIT License
