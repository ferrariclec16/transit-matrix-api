'use client';

import React, { useState, useMemo } from 'react';
import {
  Compass,
  MapPin,
  Clock,
  Layers,
  Download,
  Share2,
  CheckCircle2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { TransitHub, IsochroneResult } from '@/lib/types';
import { MAJOR_HUBS } from '@/lib/mock-data';
import { calculateIsochrone } from '@/lib/transit-engine';

export function IsochroneMapVisualizer() {
  const [selectedHub, setSelectedHub] = useState<TransitHub>(MAJOR_HUBS[0]);
  const [timeLimit, setTimeLimit] = useState<number>(30); // 15, 30, 45, 60분

  const isochroneData: IsochroneResult = useMemo(() => {
    return calculateIsochrone(selectedHub, timeLimit);
  }, [selectedHub, timeLimit]);

  const handleDownloadGeoJson = () => {
    const geoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            hub: selectedHub.name,
            maxMinutes: timeLimit,
            areaKm2: isochroneData.reachableAreaKm2,
            engine: 'TransitMatrix RAPTOR v3',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              isochroneData.polygonPoints.map(([x, y]) => [
                selectedHub.coords.lng + ((x - 250) / 250) * 0.15,
                selectedHub.coords.lat + ((250 - y) / 250) * 0.12,
              ]),
            ],
          },
        },
      ],
    };

    const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedHub.id}-${timeLimit}min-isochrone.geojson`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const svgPolygonString = isochroneData.polygonPoints
    .map(([x, y]) => `${x},${y}`)
    .join(' ');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* 1. Hub & Time Limit Control Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              대중교통 도달시간 등시선(Isochrone) 시각화 엔진
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              원하는 주요 중심지와 제한 시간을 선택하면, 실제 지하철 시간표 및 환승 보행시간이 반영된 등시선 폴리곤을 실시간 계산합니다.
            </p>
          </div>

          {/* Time Limit Pills */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-gray-500 px-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 소요시간:
            </span>
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setTimeLimit(mins)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  timeLimit === mins
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mins}분 이내
              </button>
            ))}
          </div>
        </div>

        {/* Hub Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" /> 출발/도착 거점:
          </span>
          {MAJOR_HUBS.map((hub) => (
            <button
              key={hub.id}
              onClick={() => setSelectedHub(hub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border flex items-center gap-1.5 ${
                selectedHub.id === hub.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs'
                  : 'border-gray-200 bg-gray-50/50 hover:bg-white text-gray-700'
              }`}
            >
              <span>{hub.name}</span>
              <span className="text-[10px] text-gray-400">({hub.district.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive SVG Map & Stations Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Interactive Map (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-xs font-bold text-gray-900">
                대중교통 통근 도달 영역 (GeoJSON Polygon)
              </h3>
              <span className="text-[11px] text-gray-500">
                {selectedHub.name} 중심 · {timeLimit}분 이내 이동 가능 영역
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-600" />
                {isochroneData.calculationLatencyMs}ms 연산 완료
              </span>

              <button
                onClick={handleDownloadGeoJson}
                className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition border border-indigo-200 cursor-pointer flex items-center gap-1"
                title="GeoJSON 파일 다운로드"
              >
                <Download className="w-3.5 h-3.5" />
                <span>GeoJSON</span>
              </button>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center p-2">
            <svg
              viewBox="0 0 500 500"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Map Grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
                <radialGradient id="isochroneGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
                </radialGradient>
              </defs>

              <rect width="500" height="500" fill="#090d16" />
              <rect width="500" height="500" fill="url(#grid)" />

              {/* Subway Line Guideway Radiations */}
              <line x1="0" y1="250" x2="500" y2="250" stroke="#334155" strokeDasharray="3 3" strokeWidth="1.2" />
              <line x1="250" y1="0" x2="250" y2="500" stroke="#334155" strokeDasharray="3 3" strokeWidth="1.2" />
              <line x1="70" y1="70" x2="430" y2="430" stroke="#1e293b" strokeDasharray="2 2" strokeWidth="1" />
              <line x1="70" y1="430" x2="430" y2="70" stroke="#1e293b" strokeDasharray="2 2" strokeWidth="1" />

              {/* Distance Rings (15m, 30m, 45m, 60m) */}
              {[45, 90, 135, 180].map((r, i) => (
                <circle
                  key={i}
                  cx="250"
                  cy="250"
                  r={r}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                />
              ))}

              {/* The Isochrone Polygon */}
              <polygon
                points={svgPolygonString}
                fill="url(#isochroneGlow)"
                stroke="#6366f1"
                strokeWidth="2.5"
                className="transition-all duration-500 ease-out drop-shadow-lg"
              />

              {/* Subway Station Dots within polygon */}
              {isochroneData.reachableStations.slice(0, 10).map((st, i) => {
                // Distribute around center
                const angle = (i * 2 * Math.PI) / 10;
                const dist = (st.minutes / timeLimit) * 150 + 20;
                const sx = 250 + dist * Math.cos(angle);
                const sy = 250 + dist * Math.sin(angle);

                return (
                  <g key={st.name} className="cursor-pointer group">
                    <circle cx={sx} cy={sy} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                    <text
                      x={sx + 6}
                      y={sy + 3}
                      fill="#e2e8f0"
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                    >
                      {st.name} ({st.minutes}분)
                    </text>
                  </g>
                );
              })}

              {/* Center Transit Hub Pin */}
              <circle cx="250" cy="250" r="14" fill="#6366f1" fillOpacity="0.3" className="animate-ping" />
              <circle cx="250" cy="250" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              <text
                x="250"
                y="274"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="black"
              >
                {selectedHub.name} (출발지)
              </text>
            </svg>
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> 기준 거점
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> 도달 지하철역
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-indigo-500 rounded"></span> {timeLimit}분 등시선 경계
              </span>
            </div>
            <span>좌표계: EPSG:4326 (WGS84)</span>
          </div>
        </div>

        {/* Right Station Metrics & Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-medium text-gray-500">도달 가능 면적</span>
              <div className="text-2xl font-black text-indigo-700 mt-0.5">
                {isochroneData.reachableAreaKm2} <span className="text-xs font-normal text-gray-500">km²</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">대중교통 축에 따른 비대칭 커버리지</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-medium text-gray-500">도달 지하철역</span>
              <div className="text-2xl font-black text-indigo-700 mt-0.5">
                {isochroneData.reachedStationCount} <span className="text-xs font-normal text-gray-500">개 역</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">수도권 광역급행 및 직통 포함</p>
            </div>
          </div>

          {/* Reachable Station List */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="text-xs font-bold text-gray-900">
                도달 가능 주요 역사 목록 ({isochroneData.reachableStations.length}개)
              </h4>
              <span className="text-[11px] text-gray-400">소요시간 순</span>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {isochroneData.reachableStations.map((st) => (
                <div
                  key={st.name}
                  className="p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-white transition flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <div>
                      <span className="font-bold text-gray-900">{st.name}</span>
                      <span className="text-[10px] text-gray-500 ml-1.5">{st.line}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-medium">{st.transfers === 0 ? '환승 0회' : `환승 ${st.transfers}회`}</span>
                    <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                      {st.minutes}분
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
