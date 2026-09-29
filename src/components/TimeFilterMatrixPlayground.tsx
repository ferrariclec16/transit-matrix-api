'use client';

import React, { useState, useMemo } from 'react';
import {
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
  XCircle,
  Zap,
  TrendingDown,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { TransitHub, PropertyOrigin, FilteredPropertyResult } from '@/lib/types';
import { MAJOR_HUBS, MOCK_PROPERTIES } from '@/lib/mock-data';
import { filterPropertiesByTransitTime } from '@/lib/transit-engine';

export function TimeFilterMatrixPlayground() {
  const [targetHub, setTargetHub] = useState<TransitHub>(MAJOR_HUBS[0]);
  const [maxMinutes, setMaxMinutes] = useState<number>(30);
  const [filterType, setFilterType] = useState<string>('ALL');

  const { results, benchmark } = useMemo(() => {
    return filterPropertiesByTransitTime(targetHub, MOCK_PROPERTIES, maxMinutes);
  }, [targetHub, maxMinutes]);

  const filteredProperties = results.filter((p) => {
    return filterType === 'ALL' || p.propertyType === filterType;
  });

  const reachableCount = filteredProperties.filter((p) => p.reachable).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* 1. Header & Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              대중교통 시간 필터(Time-Filter) & 다대다 매트릭스 시뮬레이터
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              부동산 매물 2,000건, 구직자 이력서 10,000건의 통근 시간을 100ms 내에 일괄 계산하는 엔터프라이즈 매트릭스 API입니다.
            </p>
          </div>

          {/* Time Filter Slider */}
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
              통근 한계 시간: <strong className="text-indigo-600">{maxMinutes}분 이내</strong>
            </span>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={maxMinutes}
              onChange={(e) => setMaxMinutes(Number(e.target.value))}
              className="w-32 accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Hub & Property Type Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-500 font-semibold mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" /> 목적지(직장/본사):
            </span>
            {MAJOR_HUBS.map((hub) => (
              <button
                key={hub.id}
                onClick={() => setTargetHub(hub)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer border ${
                  targetHub.id === hub.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {hub.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> 매물 유형:
            </span>
            {['ALL', '원룸', '오피스텔', '아파트'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                  filterType === type
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Benchmark Comparison Callout (Legacy 1:1 API vs TransitMatrix) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-lg border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>레거시 지도 API 대비 다대다 연산 벤치마크</span>
            </div>
            <h3 className="text-lg font-black">
              12개 매물 평가 소요시간: <span className="text-emerald-400">{benchmark.transitMatrixLatencyMs}ms</span> (단 1회 배치 호출)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              네이버/카카오 지도 API로 같은 작업을 수행하면 12번의 개별 HTTP 요청과 약 {benchmark.legacyApiEstimatedLatencyMs}ms가 소요됩니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-800/80 rounded-xl border border-indigo-800/40 text-center">
              <span className="text-[10px] text-slate-400 block">응답 지연시간 단축</span>
              <span className="text-xl font-black text-emerald-400">98.8% ↓</span>
            </div>

            <div className="px-4 py-2 bg-slate-800/80 rounded-xl border border-indigo-800/40 text-center">
              <span className="text-[10px] text-slate-400 block">API 호출 비용 절감</span>
              <span className="text-xl font-black text-amber-400">{benchmark.costReductionPercentage}% ↓</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filtered Property Results Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>
            {targetHub.name}까지 대중교통 <strong>{maxMinutes}분 이내</strong> 도달 가능 매물: 
            <strong className="text-indigo-600 ml-1">{reachableCount}개</strong> / {filteredProperties.length}개
          </span>
          <span className="text-gray-400">실시간 환승 시간표 및 도보 4분 가산 반영</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                prop.reachable
                  ? 'bg-white border-gray-200 hover:border-indigo-300 shadow-sm'
                  : 'bg-gray-50/70 border-gray-200/80 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                    {prop.propertyType}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 ${
                      prop.reachable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {prop.reachable ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{prop.transitDurationMinutes}분 통근 가능</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{prop.transitDurationMinutes}분 (초과)</span>
                      </>
                    )}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-gray-900 mb-1">{prop.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{prop.subwayStation}</p>

                <div className="text-xs font-black text-indigo-700 mb-3">
                  보증금/월세: {prop.depositAndRent} 만원
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">추천 대중교통 경로:</span>
                  <span className="text-gray-400">환승 {prop.transfers}회</span>
                </div>
                <p className="text-gray-500 bg-gray-50 p-2 rounded-lg leading-relaxed">
                  {prop.routeSummary}
                </p>
                <div className="text-[10px] text-gray-400 text-right">
                  직선거리: {prop.directDistanceKm}km
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
