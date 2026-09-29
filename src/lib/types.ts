export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TransitHub {
  id: string;
  name: string;
  subName: string;
  district: 'GBD (강남)' | 'CBD (종로/도심)' | 'YBD (여의도)' | 'PANGYO (판교)' | 'SEONGSU (성수)' | 'GASAN (가산)';
  coords: Coordinates;
  majorLines: string[];
}

export interface StationReachInfo {
  name: string;
  line: string;
  minutes: number;
  transfers: number;
  direction: string;
}

export interface IsochroneResult {
  hub: TransitHub;
  maxTravelTimeMinutes: number;
  reachableAreaKm2: number;
  reachedStationCount: number;
  reachableStations: StationReachInfo[];
  polygonPoints: [number, number][]; // SVG map relative coordinates [x, y]
  calculationLatencyMs: number;
}

export interface PropertyOrigin {
  id: string;
  name: string;
  subwayStation: string;
  propertyType: '원룸' | '오피스텔' | '아파트';
  depositAndRent: string; // e.g. "1,000 / 65"
  coords: Coordinates;
  directDistanceKm: number;
}

export interface FilteredPropertyResult extends PropertyOrigin {
  reachable: boolean;
  transitDurationMinutes: number;
  transfers: number;
  routeSummary: string;
}

export interface MatrixBenchmark {
  totalOriginsEvaluated: number;
  transitMatrixLatencyMs: number;
  legacyApiEstimatedLatencyMs: number;
  legacyApiCallCount: number;
  costReductionPercentage: number;
}

export interface CommuteScoreResult {
  address: string;
  gbdMinutes: number;
  cbdMinutes: number;
  ybdMinutes: number;
  pangyoMinutes: number;
  overallScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  verdict: string;
}
