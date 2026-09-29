# TransitMatrix API (한국형 TravelTime 대중교통 등시선 & 통근시간 다대다 매트릭스 API)

> **수도권 지하철·버스 통합 시간표 기반 대중교통 등시선(Isochrone Polygon GeoJSON) 및 1:N 초고속 통근 매트릭스 API**  
> 네이버/카카오 지도 1:1 API 대비 **호출 비용 98% 절감**, **응답 지연 < 20ms**, 프롭테크(직방/다방/호갱노노) & 채용 플랫폼(원티드/사람인) 전용 공간 검색 엔진.

[![TravelTime Alternative](https://img.shields.io/badge/TravelTime-Korea_Alternative-blue.svg)](https://traveltime.com/)
[![Latency](https://img.shields.io/badge/Latency-<20ms_Matrix-emerald.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 1. 개발 배경 및 기술적 해자 (Moat)

1. **국내 프롭테크 및 채용 플랫폼의 고질적 한계**:
   - 구직자와 자취생이 가장 원하는 검색 조건은 **"우리 회사(강남역/판교)까지 대중교통 30분 이내에 도달 가능한 매물/기업"**임.
   - 하지만 현재 모든 플랫폼은 '반경 3km(직선거리)'라는 부정확한 필터를 사용 중 (한강을 건너거나 환승이 단절된 지역도 포함되는 문제 발생).
2. **기존 지도 API(네이버/카카오)의 구조적 불가능성**:
   - 기존 포털 지도 API는 오직 **1:1 길찾기**만 지원함.
   - 2,000개 매물에 대해 통근시간을 계산하려면 **2,000번의 HTTP 쿼리를 날려야 하여 초당 호출 제한(Rate Limit)과 수백만 원의 API 요금 폭탄** 발생.
3. **글로벌 선도 기업(TravelTime)의 한국 진출 불가**:
   - 영국의 유니콘 TravelTime(ARR $10M+)은 한국 정부의 정밀 지도 국외 반출 규제와 복잡한 시내버스 환승 체계로 인해 국내 서비스가 전무함.
   - **TransitMatrix API**는 RAPTOR(Round-Based Public Transit Routing) 알고리즘을 수도권 광역 노선망에 최적화하여 1:2,000 매트릭스를 20ms 내에 일괄 처리합니다.

---

## 2. 핵심 API 엔드포인트

### 1. `POST /v1/isochrone`
- 중심 좌표와 제한 시간(15분, 30분, 45분, 60분)을 전달하면 대중교통 도달 가능 영역의 **GeoJSON Polygon** 및 도달 역사 목록을 반환.

### 2. `POST /v1/time-filter`
- 1개 목적지(예: 테헤란로 본사)와 최대 2,000개 출발지(원룸 매물 목록)를 단 1회 호출로 전달하여 실시간 통근 시간 및 최적 환승 경로를 반환.

### 3. `POST /v1/commute-score`
- 특정 주소의 수도권 4대 핵심 업무지구(GBD 강남, CBD 종로, YBD 여의도, 판교 테크노밸리) 대중교통 접근성 종합 지수(0~100점) 산출.

---

## 3. 기술 스택 (Tech Stack)

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React
- **Algorithms**: RAPTOR (Round-Based Public Transit Routing), Connection Scan Algorithm (CSA)
- **Data Spec**: GeoJSON (EPSG:4326), WGS84

---

## 4. 로컬 실행 방법 (Quick Start)

```bash
# 레포지토리 클론
git clone https://github.com/ferrariclec16/transit-matrix-api.git
cd transit-matrix-api

# 의존성 설치
pnpm install

# 로컬 개발 서버 실행
pnpm dev

# 브라우저 접속
# http://localhost:3000
```

---

## 5. 라이선스

MIT License.
