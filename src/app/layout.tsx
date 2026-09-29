import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TransitMatrix API - 한국형 TravelTime 대중교통 등시선 & 통근시간 매트릭스 API',
  description:
    '수도권 지하철·버스 통합 시간표 기반 대중교통 등시선(Isochrone Polygon GeoJSON) 및 1:N 초고속 통근시간 매트릭스 API. 네이버/카카오 지도 1:1 API 대비 비용 98% 절감 및 프롭테크·채용 플랫폼 최적화',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased bg-slate-50 text-slate-900">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
