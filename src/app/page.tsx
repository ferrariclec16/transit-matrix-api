'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { IsochroneMapVisualizer } from '@/components/IsochroneMapVisualizer';
import { TimeFilterMatrixPlayground } from '@/components/TimeFilterMatrixPlayground';
import { ApiDocsModal } from '@/components/ApiDocsModal';
import { PricingModal } from '@/components/PricingModal';
import { Compass, Zap, MapPin, Database, Cpu, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Home() {
  const [activeView, setActiveView] = useState<'isochrone' | 'time-filter'>('isochrone');
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Navbar */}
      <Navbar
        onOpenDocs={() => setIsDocsModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* 2. Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/60 p-4 lg:p-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-cyan-300 border border-cyan-400/30">
                국내 유일 대중교통 등시선 & 통근 매트릭스 엔진
              </span>
              <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                초당 10,000건 다대다 연산 · 응답 지연 &lt; 20ms
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              &quot;강남역까지 대중교통 30분 이내&quot; 초고속 공간 검색 API
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              엉터리 직선거리 반경 검색을 끝내세요. 수도권 지하철 시간표와 환승 보행시간이 완벽히 반영된 
              등시선(Isochrone Polygon)과 다대다 통근시간 필터 매트릭스를 API 1회 호출로 해결합니다.
            </p>
          </div>

          {/* Quick View Toggle Buttons */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-2xl border border-indigo-800/40">
            <button
              onClick={() => setActiveView('isochrone')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'isochrone'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>등시선 폴리곤 맵</span>
            </button>
            <button
              onClick={() => setActiveView('time-filter')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'time-filter'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>다대다 매트릭스 필터</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Dynamic View */}
      <main className="flex-1">
        {activeView === 'isochrone' ? (
          <IsochroneMapVisualizer />
        ) : (
          <TimeFilterMatrixPlayground />
        )}

        {/* 4. Technical Moat Deep Dive Section */}
        <section className="w-full max-w-7xl mx-auto px-4 py-12">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-indigo-900/60 shadow-xl space-y-8">
            <div className="max-w-3xl">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-widest">
                Technical Moat & Algorithmic Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-3 tracking-tight">
                왜 기존 네이버/카카오 지도 API로는 이 기능을 구현할 수 없는가?
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                네이버 지도나 카카오맵은 <strong>&apos;A에서 B로 가는 1:1 길찾기&apos;</strong>에 최적화되어 있습니다. 
                부동산 플랫폼에서 매물 1,000개의 통근시간을 필터링하려면 1,000번의 HTTP 쿼리를 날려야 하며, 
                수초 이상의 지연시간과 막대한 종량제 API 비용(수십~수백만 원)이 발생하여 서비스 탑재가 원천적으로 불가능했습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-indigo-800/40">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">RAPTOR 환승 그래프 알고리즘</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  마이크로소프트 리서치가 고안한 라운드 기반 대중교통 경로 탐색 알고리즘을 수도권 지하철·버스 노선망에 커스텀 구현하여 10,000개 출발지를 20ms 내에 일괄 계산합니다.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">한국 로컬 지도 규제 해자</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  영국 TravelTime 등 해외 선도 기업은 한국 정부의 정밀 지도 국외 반출 규제 및 복잡한 시내버스 환승 체계로 인해 국내 시장에 진입하지 못하는 독점적 공백 상태입니다.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">API 호출 비용 98% 절감</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  단 한 번의 배치 요청으로 2,000개 매물 좌표의 이동 시간을 반환하므로, 레거시 지도 API 대비 서버 부하와 청구 비용을 98% 이상 획기적으로 줄여줍니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Footer */}
      <footer className="w-full border-t border-gray-200 bg-white py-8 px-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">TransitMatrix API</span>
            <span>—</span>
            <span>Korea Public Transit Isochrone & TravelTime Matrix Engine</span>
          </div>

          <div className="flex items-center gap-4 text-gray-600 font-medium">
            <button onClick={() => setIsPricingModalOpen(true)} className="hover:text-indigo-600 cursor-pointer">
              B2B 요금제
            </button>
            <button onClick={() => setIsDocsModalOpen(true)} className="hover:text-indigo-600 cursor-pointer">
              REST API 문서
            </button>
            <a
              href="https://github.com/ferrariclec16/transit-matrix-api"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-900"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApiDocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </div>
  );
}
