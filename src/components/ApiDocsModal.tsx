'use client';

import React, { useState } from 'react';
import { X, Code2, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiDocsModal({ isOpen, onClose }: ApiDocsModalProps) {
  const [activeEndpoint, setActiveEndpoint] = useState<'isochrone' | 'time-filter' | 'commute-score'>('isochrone');
  const [activeLang, setActiveLang] = useState<'curl' | 'typescript' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeSnippets = {
    isochrone: {
      curl: `curl -X POST https://api.transitmatrix.kr/v1/isochrone \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "center": { "lat": 37.4979, "lng": 127.0276 },
    "maxTravelTimeMinutes": 30,
    "mode": "PUBLIC_TRANSIT",
    "departureTime": "2026-10-01T08:30:00+09:00"
  }'`,
      typescript: `import axios from 'axios';

const response = await axios.post(
  'https://api.transitmatrix.kr/v1/isochrone',
  {
    center: { lat: 37.4979, lng: 127.0276 }, // 강남역
    maxTravelTimeMinutes: 30,
    mode: 'PUBLIC_TRANSIT',
  },
  {
    headers: { Authorization: \`Bearer \${process.env.TRANSIT_MATRIX_API_KEY}\` },
  }
);

console.log('Reachable Area Km2:', response.data.areaKm2);
console.log('GeoJSON Polygon:', response.data.geojson);`,
      python: `import requests

url = "https://api.transitmatrix.kr/v1/isochrone"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
payload = {
    "center": {"lat": 37.4979, "lng": 127.0276},
    "maxTravelTimeMinutes": 30,
    "mode": "PUBLIC_TRANSIT"
}

res = requests.post(url, json=payload, headers=headers)
data = res.json()
print("Stations reached:", len(data["reachableStations"]))`,
    },
    'time-filter': {
      curl: `curl -X POST https://api.transitmatrix.kr/v1/time-filter \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "targetDestination": { "lat": 37.4979, "lng": 127.0276 },
    "maxMinutes": 30,
    "origins": [
      { "id": "prop_1", "lat": 37.4842, "lng": 126.9298 },
      { "id": "prop_2", "lat": 37.4765, "lng": 126.9816 }
    ]
  }'`,
      typescript: `const matrix = await fetch('https://api.transitmatrix.kr/v1/time-filter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${API_KEY}\`,
  },
  body: JSON.stringify({
    targetDestination: { lat: 37.4979, lng: 127.0276 },
    maxMinutes: 30,
    origins: propertyList.map(p => ({ id: p.id, lat: p.lat, lng: p.lng })),
  }),
});`,
      python: `import requests

res = requests.post(
    "https://api.transitmatrix.kr/v1/time-filter",
    headers={"Authorization": "Bearer YOUR_KEY"},
    json={
        "targetDestination": {"lat": 37.4979, "lng": 127.0276},
        "maxMinutes": 30,
        "origins": [{"id": "p1", "lat": 37.4842, "lng": 126.9298}]
    }
)`,
    },
    'commute-score': {
      curl: `curl -X POST https://api.transitmatrix.kr/v1/commute-score \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"address": "서울시 관악구 남부순환로 1600"}'`,
      typescript: `const score = await client.commuteScore({
  address: '서울시 관악구 남부순환로 1600',
});
console.log('Score:', score.overallScore); // 88점 (Grade A)`,
      python: `res = requests.post(
    "https://api.transitmatrix.kr/v1/commute-score",
    headers={"Authorization": "Bearer YOUR_KEY"},
    json={"address": "서울시 관악구 남부순환로 1600"}
)`,
    },
  };

  const currentCode = codeSnippets[activeEndpoint][activeLang];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <Code2 className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">TransitMatrix REST API 개발자 명세</h3>
              <p className="text-xs text-slate-300">
                수도권 지하철·버스 통합 시간표 및 초고속 RAPTOR 다대다 통근 매트릭스
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50/70 px-6 pt-2 overflow-x-auto">
          {[
            { id: 'isochrone', name: 'POST /v1/isochrone (등시선 폴리곤)' },
            { id: 'time-filter', name: 'POST /v1/time-filter (다대다 통근 필터)' },
            { id: 'commute-score', name: 'POST /v1/commute-score (통근 접근성 지수)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveEndpoint(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeEndpoint === tab.id
                  ? 'border-indigo-600 text-indigo-700 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Code & Response Preview */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold">
              {(['curl', 'typescript', 'python'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1 rounded-lg uppercase transition cursor-pointer ${
                    activeLang === lang
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨' : '코드 복사'}</span>
            </button>
          </div>

          <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
            <pre>{currentCode}</pre>
          </div>

          {/* Response Payload Preview */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-700">예시 JSON 응답 (HTTP 200 OK):</span>
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[220px]">
              <pre>
{`{
  "status": "success",
  "executionTimeMs": 14,
  "data": {
    "center": { "name": "강남역", "lat": 37.4979, "lng": 127.0276 },
    "maxMinutes": 30,
    "reachableAreaKm2": 86.4,
    "reachedStationCount": 18,
    "geojson": {
      "type": "Polygon",
      "coordinates": [[[126.9816, 37.4765], [127.0364, 37.5006], ...]]
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
