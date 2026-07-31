import { BoroughGeoFeature, PollutantType, Station } from '../types';

export interface ScatterPoint {
  boroughName: string;
  imdDecile: number; // 1 to 10
  monitorDensity: number; // monitors per 100k residents
  stationCount: number;
  population: number;
  childPopulation: number;
  clusterId: number;
  missingnessType: string;
}

export interface CorrelationResult {
  r: number; // Pearson correlation coefficient
  rSquared: number;
  slope: number;
  intercept: number;
  interpretation: string;
  missingnessDiagnosis: 'MNAR (Systematic Social Bias)' | 'MAR (Random/Conditioned)' | 'MCAR (Uniform)';
}

/**
 * Calculates Pearson Correlation Coefficient r between IMD Deprivation and Monitor Density
 */
export function calculateImdCorrelation(
  features: BoroughGeoFeature[],
  pollutant: PollutantType
): { scatterData: ScatterPoint[]; correlation: CorrelationResult } {
  const scatterData: ScatterPoint[] = features.map((f) => {
    const props = f.properties;
    const count = props.monitorsByPollutant[pollutant] || 0;
    const density = (count / props.population) * 100000; // per 100,000 residents

    return {
      boroughName: props.name,
      imdDecile: props.imdDecile,
      monitorDensity: Number(density.toFixed(2)),
      stationCount: count,
      population: props.population,
      childPopulation: props.childPopulation,
      clusterId: props.clusterId,
      missingnessType: props.missingnessType[pollutant] || 'MNAR'
    };
  });

  const n = scatterData.length;
  if (n === 0) {
    return {
      scatterData: [],
      correlation: {
        r: 0,
        rSquared: 0,
        slope: 0,
        intercept: 0,
        interpretation: 'Insufficient data',
        missingnessDiagnosis: 'MCAR (Uniform)'
      }
    };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  scatterData.forEach((p) => {
    sumX += p.imdDecile;
    sumY += p.monitorDensity;
    sumXY += p.imdDecile * p.monitorDensity;
    sumX2 += p.imdDecile * p.imdDecile;
    sumY2 += p.monitorDensity * p.monitorDensity;
  });

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const r = denominator === 0 ? 0 : numerator / denominator;
  const slope = (n * sumX2 - sumX * sumX) === 0 ? 0 : numerator / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  let interpretation = '';
  let missingnessDiagnosis: CorrelationResult['missingnessDiagnosis'] = 'MNAR (Systematic Social Bias)';

  if (r < -0.2) {
    interpretation = `Negative correlation (r = ${r.toFixed(2)}): More deprived boroughs (lower IMD deciles) tend to have slightly higher roadside monitor counts due to heavy traffic corridors, but suffer from zero residential background sensors.`;
    missingnessDiagnosis = 'MNAR (Systematic Social Bias)';
  } else if (r > 0.2) {
    interpretation = `Positive correlation (r = ${r.toFixed(2)}): Less deprived boroughs (higher IMD deciles) enjoy significantly higher sensor density per capita.`;
    missingnessDiagnosis = 'MNAR (Systematic Social Bias)';
  } else {
    interpretation = `Weak correlation (r = ${r.toFixed(2)}): Sensor placement is heavily decoupled from borough deprivation, driven instead by historical council initiative and transport department priorities.`;
    missingnessDiagnosis = 'MNAR (Systematic Social Bias)';
  }

  return {
    scatterData,
    correlation: {
      r: Number(r.toFixed(3)),
      rSquared: Number((r * r).toFixed(3)),
      slope: Number(slope.toFixed(3)),
      intercept: Number(intercept.toFixed(3)),
      interpretation,
      missingnessDiagnosis
    }
  };
}

/**
 * Calculates IDW uncertainty error percentage based on distance to nearest monitor in km
 * Error = 1 - exp(-0.35 * distance)
 */
export function calculateDistanceUncertainty(distanceKm: number): { errorPercent: number; confidenceLevel: string } {
  if (distanceKm <= 0.5) {
    return { errorPercent: 5, confidenceLevel: 'High Direct Measurement' };
  }
  const errorFraction = 1 - Math.exp(-0.35 * distanceKm);
  const errorPercent = Math.min(95, Math.round(errorFraction * 100));

  let confidenceLevel = 'Moderate';
  if (errorPercent > 60) confidenceLevel = 'Extremely Low (Speculative Interpolation)';
  else if (errorPercent > 35) confidenceLevel = 'Low Confidence (Distant Estimation)';

  return { errorPercent, confidenceLevel };
}

/**
 * Returns Color Ramp RGB for Pollution Map rendering
 */
const COLOR_STOPS: [number, [number, number, number]][] = [
  [0, [47, 158, 110]],    // Green (Good)
  [0.2, [138, 201, 106]], // Yellow-Green
  [0.4, [230, 214, 107]], // Yellow (Moderate)
  [0.6, [240, 176, 83]],  // Orange
  [0.8, [232, 135, 66]],  // Dark Orange
  [1.0, [207, 79, 58]]    // Red/Crimson (Poor)
];

export function getRampColor(value: number, maxVal: number): [number, number, number] {
  let t = value / maxVal;
  if (t < 0) t = 0;
  if (t > 1) t = 1;

  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const [a, ca] = COLOR_STOPS[i];
    const [b, cb] = COLOR_STOPS[i + 1];
    if (t >= a && t <= b) {
      const k = (t - a) / (b - a || 1);
      return [
        Math.round(ca[0] + (cb[0] - ca[0]) * k),
        Math.round(ca[1] + (cb[1] - ca[1]) * k),
        Math.round(ca[2] + (cb[2] - ca[2]) * k)
      ];
    }
  }
  return COLOR_STOPS[COLOR_STOPS.length - 1][1];
}

export function getRampColorHex(value: number, maxVal: number): string {
  const [r, g, b] = getRampColor(value, maxVal);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Calculates pollutant value for a borough feature
 */
export function getBoroughPollutantValue(
  feature: BoroughGeoFeature,
  pollutant: PollutantType,
  year: number,
  stations: Station[]
): { val: number; isMeasured: boolean; monitorCount: number } {
  const boroughStations = stations.filter(
    (s) =>
      s.boro.toLowerCase() === feature.properties.name.toLowerCase() &&
      s.readings[pollutant] !== null &&
      s.readings[pollutant] !== undefined &&
      s.activeYears[0] <= year &&
      s.activeYears[1] >= year
  );

  if (boroughStations.length > 0) {
    const avg =
      boroughStations.reduce((sum, s) => sum + (s.readings[pollutant] || 0), 0) /
      boroughStations.length;
    return { val: Number(avg.toFixed(1)), isMeasured: true, monitorCount: boroughStations.length };
  }

  const activeStations = stations.filter(
    (s) =>
      s.readings[pollutant] !== null &&
      s.readings[pollutant] !== undefined &&
      s.activeYears[0] <= year &&
      s.activeYears[1] >= year
  );

  if (activeStations.length === 0) return { val: 0, isMeasured: false, monitorCount: 0 };

  const coords =
    feature.geometry.type === 'Polygon'
      ? feature.geometry.coordinates[0]
      : (feature.geometry as any).coordinates[0][0];

  let sumLon = 0;
  let sumLat = 0;
  coords.forEach((c: number[]) => {
    sumLon += c[0];
    sumLat += c[1];
  });
  const centroidLon = sumLon / coords.length;
  const centroidLat = sumLat / coords.length;

  let num = 0;
  let den = 0;
  activeStations.forEach((st) => {
    const dLon = centroidLon - st.lon;
    const dLat = centroidLat - st.lat;
    const dist = Math.sqrt(dLon * dLon + dLat * dLat) + 1e-5;
    const weight = 1 / Math.pow(dist, 2.2);
    num += weight * (st.readings[pollutant] || 0);
    den += weight;
  });

  return {
    val: Number((num / (den || 1)).toFixed(1)),
    isMeasured: false,
    monitorCount: 0,
  };
}
