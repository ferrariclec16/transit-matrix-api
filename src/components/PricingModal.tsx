'use client';

import React from 'react';
import { X, Check, Zap, Building2, Rocket, ShieldCheck } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              B2B 프롭테크 & 채용 플랫폼 전용
            </span>
            <h3 className="text-xl font-black mt-1">
              대중교통 다대다 매트릭스 API 요금제
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              네이버/카카오 지도 1:1 길찾기 API 비용을 98% 절감하고, 실시간 대중교통 통근시간 필터를 구현하세요.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Plan 1: Developer */}
          <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <Rocket className="w-4 h-4 text-blue-600" />
                <span>개발자 및 테스트</span>
              </div>
              <h4 className="text-base font-bold text-gray-900 mt-1">Developer Free</h4>
              <p className="text-xs text-gray-500 mt-1">
                프로토타입 개발, 학술 연구 및 사이드 프로젝트용
              </p>

              <div className="mt-4 pb-4 border-b border-gray-200">
                <span className="text-2xl font-black text-gray-900">₩0</span>
                <span className="text-xs text-gray-500 ml-1">/ 평생 무료</span>
              </div>

              <ul className="mt-4 space-y-2.5 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>월 1,000건 API 호출</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>대중교통 등시선 GeoJSON 생성</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>초당 5 QPS 제한</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>개발자 커뮤니티 지원</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => alert('무료 API 키 발급이 완료되었습니다. 콘솔에서 키를 확인하세요.')}
              className="w-full py-2.5 text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition cursor-pointer shadow-sm"
            >
              무료 API 키 받기
            </button>
          </div>

          {/* Plan 2: PropTech Growth (Recommended) */}
          <div className="p-5 rounded-2xl border-2 border-indigo-600 bg-indigo-50/20 relative flex flex-col justify-between space-y-4 shadow-lg shadow-indigo-600/10">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
              스타트업 최다 선택
            </span>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span>프롭테크 & 채용 플랫폼</span>
              </div>
              <h4 className="text-base font-bold text-gray-900 mt-1">PropTech Growth</h4>
              <p className="text-xs text-gray-500 mt-1">
                직방/다방 스타일의 실시간 통근시간 검색 필터를 탑재하려는 플랫폼
              </p>

              <div className="mt-4 pb-4 border-b border-indigo-100">
                <span className="text-2xl font-black text-gray-900">₩290,000</span>
                <span className="text-xs text-gray-500 ml-1">/ 월</span>
              </div>

              <ul className="mt-4 space-y-2.5 text-xs text-gray-700">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>월 50,000건 API 호출 (초당 50 QPS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>다대다 매트릭스 (1회 요청당 최대 2,000개 매물)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>수도권 4대 업무지구 Commute Score API</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>99.9% 가동시간 SLA 보장</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => alert('Growth 플랜 14일 무료 트라이얼이 시작되었습니다.')}
              className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer shadow-md shadow-indigo-600/30"
            >
              14일 무료 체험 시작
            </button>
          </div>

          {/* Plan 3: Enterprise Platform */}
          <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>대규모 프롭테크 & 모빌리티</span>
              </div>
              <h4 className="text-base font-bold text-gray-900 mt-1">Enterprise Platform</h4>
              <p className="text-xs text-gray-500 mt-1">
                월 수백만 방문자를 보유한 대형 부동산 포털 및 취업 매칭 포털
              </p>

              <div className="mt-4 pb-4 border-b border-gray-200">
                <span className="text-2xl font-black text-gray-900">₩890,000</span>
                <span className="text-xs text-gray-500 ml-1">/ 월~</span>
              </div>

              <ul className="mt-4 space-y-2.5 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>월 500,000건+ 무제한 다대다 쿼리</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>전용 캐시 인메모리 노드 지원 (응답 &lt; 15ms)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>실시간 지하철 지연/우회 반영 웹훅</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>전담 엔지니어링 Slack 채널 (SLA 1h)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => alert('엔터프라이즈 도입 상담 신청이 접수되었습니다.')}
              className="w-full py-2.5 text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition cursor-pointer shadow-sm"
            >
              엔터프라이즈 상담
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-gray-200 text-center text-xs text-gray-500">
          모든 플랜은 세금계산서 발행 및 국내 원화 결제(신용카드/계좌이체)를 100% 지원합니다.
        </div>
      </div>
    </div>
  );
}
