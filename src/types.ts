export type PollutantType = 'NO2' | 'PM25' | 'PM10' | 'O3';

export type StationType = 'Kerbside' | 'Roadside' | 'Urban Background' | 'Suburban' | 'Industrial';

export interface Station {
  id: string;
  name: string;
  short: string;
  boro: string;
  type: StationType;
  lat: number;
  lon: number;
  val: number; // Reading for currently selected pollutant
  readings: Record<PollutantType, number | null>;
  activeYears: [number, number]; // e.g. [1998, 2024]
  isClosed: boolean;
  closureReason?: string;
}

export interface BoroughProperties {
  name: string;
  imdDecile: number; // 1 (most deprived) to 10 (least deprived)
  population: number;
  childPopulation: number;
  areaKm2: number;
  clusterId: number; // 1 to 4
  primaryLandUse: string;
  monitorsByPollutant: Record<PollutantType, number>;
  unmonitoredRadiusKm: Record<PollutantType, number>;
  missingnessType: Record<PollutantType, 'MONITORED' | 'MAR' | 'MNAR' | 'MCAR'>;
}

export interface BoroughGeoFeature {
  type: 'Feature';
  properties: BoroughProperties;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any;
  };
}

export interface BoroughFeatureCollection {
  type: 'FeatureCollection';
  features: BoroughGeoFeature[];
}

export interface ClusterGroup {
  id: number;
  name: string;
  nameCn: string;
  color: string;
  bgHex: string;
  boroughs: string[];
  avgImd: number;
  totalPopulation: number;
  unmonitoredRatePercent: number;
  description: string;
  criticalAnalysis: string;
}

export interface PollutantMeta {
  key: PollutantType;
  label: string;
  unit: string;
  maxVal: number;
  whoLimit: number;
  ukLimit: number;
  note: string;
  description: string;
}

export interface FilterState {
  pollutant: PollutantType;
  stationTypes: StationType[];
  imdRange: [number, number]; // [min, max] decile
  coverageFilter: 'ALL' | 'MONITORED_ONLY' | 'UNMONITORED_DARK';
  clusterIdFilter: number | 'ALL';
  year: number; // 1993 - 2024
  searchPostcode: string;
}

export interface WitnessMark {
  id: string;
  lat: number;
  lon: number;
  boroughName: string;
  note: string;
  timestamp: string;
  userType: string;
}
